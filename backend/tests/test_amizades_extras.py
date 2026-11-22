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
