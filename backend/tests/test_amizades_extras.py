import pytest

from app.models.usuario import Usuario
from app.services.amizade import (
    buscar_amizade,
    enviar_pedido_amizade,
    listar_amigos,
    listar_pedidos_pendentes,
    remover_amigo,
    responder_pedido_amizade,
)


@pytest.fixture
def usuarios_amizade(db_session):
    db, _ = db_session
    u1 = Usuario(nome="Davi", email="davi@test.com", senha_hash="hash1")
    u2 = Usuario(nome="Alice", email="alice@test.com", senha_hash="hash2")
    u3 = Usuario(nome="Gabriel", email="gabriel@test.com", senha_hash="hash3")
    db.add_all([u1, u2, u3])
    db.commit()
    return db, u1, u2, u3


def test_enviar_pedido_usuarios_inexistentes_e_auto_adicao(usuarios_amizade):
    db, u1, _, _ = usuarios_amizade

    with pytest.raises(ValueError, match="Um usuário não pode adicionar a si mesmo."):
        enviar_pedido_amizade(db, u1.id, u1.id)

    with pytest.raises(ValueError, match="Usuário não encontrado."):
        enviar_pedido_amizade(db, 999, u1.id)

    with pytest.raises(ValueError, match="Amigo não encontrado."):
        enviar_pedido_amizade(db, u1.id, 999)


def test_enviar_pedido_duplicado_invertido_e_ja_amigos(usuarios_amizade):
    db, u1, u2, _ = usuarios_amizade
    enviar_pedido_amizade(db, u1.id, u2.id)

    # Pedido invertido enquanto o primeiro ainda está pendente
    with pytest.raises(ValueError, match="Já existe um pedido de amizade pendente."):
        enviar_pedido_amizade(db, u2.id, u1.id)

    responder_pedido_amizade(db, usuario_id=u2.id, solicitante_id=u1.id, status="aceito")

    # Tentativa de novo pedido quando já são amigos (em qualquer direção)
    with pytest.raises(ValueError, match="Usuários já são amigos."):
        enviar_pedido_amizade(db, u1.id, u2.id)

    with pytest.raises(ValueError, match="Usuários já são amigos."):
        enviar_pedido_amizade(db, u2.id, u1.id)


def test_recusar_pedido_e_reenviar_solicitacao(usuarios_amizade):
    db, u1, u2, _ = usuarios_amizade
    enviar_pedido_amizade(db, u1.id, u2.id)

    recusado = responder_pedido_amizade(
        db, usuario_id=u2.id, solicitante_id=u1.id, status="recusado"
    )
    assert recusado.status == "recusado"
    assert listar_amigos(db, u1.id) == []
    assert listar_pedidos_pendentes(db, u2.id) == []

    # Reenvio após recusa (inclusive invertendo quem solicita) reutiliza o registro
    reenviado = enviar_pedido_amizade(db, u2.id, u1.id)
    assert reenviado.status == "pendente"
    assert reenviado.usuario_id == u2.id
    assert reenviado.amigo_id == u1.id
    assert buscar_amizade(db, u1.id, u2.id) is not None


def test_responder_e_remover_amizade_inexistente(usuarios_amizade):
    db, u1, u2, u3 = usuarios_amizade

    with pytest.raises(ValueError, match="Pedido de amizade pendente não encontrado."):
        responder_pedido_amizade(db, usuario_id=u2.id, solicitante_id=u1.id, status="aceito")

    enviar_pedido_amizade(db, u1.id, u2.id)
    # Solicitante tentando aceitar o próprio pedido enviado
    with pytest.raises(ValueError, match="Pedido de amizade pendente não encontrado."):
        responder_pedido_amizade(db, usuario_id=u1.id, solicitante_id=u2.id, status="aceito")

    with pytest.raises(ValueError, match="Amizade não encontrada."):
        remover_amigo(db, u1.id, u3.id)


def test_api_solicitar_amizade_usuarios_inexistentes_e_invertido(client, usuarios_amizade):
    _, u1, u2, _ = usuarios_amizade

    res_remetente_inexistente = client.post(f"/api/usuarios/999/amigos/{u2.id}")
    assert res_remetente_inexistente.status_code == 400
    assert res_remetente_inexistente.json()["detail"] == "Usuário não encontrado."

    res_destinatario_inexistente = client.post(f"/api/usuarios/{u1.id}/amigos/999")
    assert res_destinatario_inexistente.status_code == 400
    assert res_destinatario_inexistente.json()["detail"] == "Amigo não encontrado."

    assert client.post(f"/api/usuarios/{u1.id}/amigos/{u2.id}").status_code == 201
    res_invertido = client.post(f"/api/usuarios/{u2.id}/amigos/{u1.id}")
    assert res_invertido.status_code == 400
    assert res_invertido.json()["detail"] == "Já existe um pedido de amizade pendente."


def test_api_recusar_reenviar_e_solicitar_ja_amigos(client, usuarios_amizade):
    _, u1, u2, _ = usuarios_amizade

    client.post(f"/api/usuarios/{u1.id}/amigos/{u2.id}")
    res_recusa = client.patch(
        f"/api/usuarios/{u2.id}/amigos/{u1.id}", json={"status": "recusado"}
    )
    assert res_recusa.status_code == 200
    assert res_recusa.json()["status"] == "recusado"

    # Reenvia pedido após recusa e aceita
    res_reenvio = client.post(f"/api/usuarios/{u2.id}/amigos/{u1.id}")
    assert res_reenvio.status_code == 201
    assert res_reenvio.json()["status"] == "pendente"

    res_aceite = client.patch(
        f"/api/usuarios/{u1.id}/amigos/{u2.id}", json={"status": "aceito"}
    )
    assert res_aceite.status_code == 200

    res_ja_amigos = client.post(f"/api/usuarios/{u1.id}/amigos/{u2.id}")
    assert res_ja_amigos.status_code == 400
    assert res_ja_amigos.json()["detail"] == "Usuários já são amigos."


def test_api_responder_e_remover_amizade_erros(client, usuarios_amizade):
    _, u1, u2, _ = usuarios_amizade

    res_pedido_inexistente = client.patch(
        f"/api/usuarios/{u2.id}/amigos/{u1.id}", json={"status": "aceito"}
    )
    assert res_pedido_inexistente.status_code == 400
    assert (
        res_pedido_inexistente.json()["detail"]
        == "Pedido de amizade pendente não encontrado."
    )

    res_status_invalido = client.patch(
        f"/api/usuarios/{u2.id}/amigos/{u1.id}", json={"status": "talvez"}
    )
    assert res_status_invalido.status_code == 422

    res_del_inexistente = client.delete(f"/api/usuarios/{u1.id}/amigos/{u2.id}")
    assert res_del_inexistente.status_code == 400
    assert res_del_inexistente.json()["detail"] == "Amizade não encontrada."
