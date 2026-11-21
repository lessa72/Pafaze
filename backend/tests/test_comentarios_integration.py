import pytest

from app.models.receita import Receita
from app.models.usuario import Usuario


@pytest.fixture
def seed_usuario_e_receita(db_session):
    db, _ = db_session
    usuario = Usuario(nome="Ana", email="ana@test.com", senha_hash="salt:hash")
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    receita = Receita(
        nome="Bolo Simples",
        categoria="Sobremesa",
        modo_preparo="Misture e asse.",
        usuario_id=usuario.id,
    )
    db.add(receita)
    db.commit()
    db.refresh(receita)
    return usuario.id, receita.id


def test_cadastrar_e_listar_comentarios_em_ordem(client, seed_usuario_e_receita):
    usuario_id, receita_id = seed_usuario_e_receita

    res_inicial = client.get(f"/api/receitas/{receita_id}/comentarios")
    assert res_inicial.status_code == 200
    assert res_inicial.json() == []

    res_1 = client.post(
        f"/api/receitas/{receita_id}/comentarios",
        json={"usuario_id": usuario_id, "texto": "  Ficou ótimo!  "},
    )
    assert res_1.status_code == 201
    assert res_1.json()["texto"] == "Ficou ótimo!"
    assert res_1.json()["usuario_id"] == usuario_id
    assert res_1.json()["receita_id"] == receita_id

    res_2 = client.post(
        f"/api/receitas/{receita_id}/comentarios",
        json={"usuario_id": usuario_id, "texto": "Vou fazer novamente."},
    )
    assert res_2.status_code == 201

    res_lista = client.get(f"/api/receitas/{receita_id}/comentarios")
    assert res_lista.status_code == 200
    textos = [item["texto"] for item in res_lista.json()]
    assert textos == ["Ficou ótimo!", "Vou fazer novamente."]


def test_cadastrar_comentario_receita_ou_usuario_inexistente_retorna_404(client, seed_usuario_e_receita):
    usuario_id, receita_id = seed_usuario_e_receita

    res_sem_receita = client.post(
        "/api/receitas/999/comentarios",
        json={"usuario_id": usuario_id, "texto": "Comentário"},
    )
    assert res_sem_receita.status_code == 404
    assert res_sem_receita.json()["detail"] == "Receita não encontrada."

    res_sem_usuario = client.post(
        f"/api/receitas/{receita_id}/comentarios",
        json={"usuario_id": 999, "texto": "Comentário"},
    )
    assert res_sem_usuario.status_code == 404
    assert res_sem_usuario.json()["detail"] == "Usuário não encontrado."


def test_cadastrar_comentario_texto_invalido_retorna_422(client, seed_usuario_e_receita):
    usuario_id, receita_id = seed_usuario_e_receita

    res_vazio = client.post(
        f"/api/receitas/{receita_id}/comentarios",
        json={"usuario_id": usuario_id, "texto": ""},
    )
    assert res_vazio.status_code == 422

    res_longo = client.post(
        f"/api/receitas/{receita_id}/comentarios",
        json={"usuario_id": usuario_id, "texto": "a" * 1001},
    )
    assert res_longo.status_code == 422
