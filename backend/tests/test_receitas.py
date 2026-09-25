import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.avaliacao import Avaliacao
from app.models.receita import Receita
from app.models.usuario import Usuario


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)
    db = Session()

    user = Usuario(nome="Chef", email="chef@test.com", senha_hash="xyz")
    db.add(user)
    db.commit()

    r1 = Receita(nome="Bolo de Chocolate", categoria="Sobremesa", modo_preparo="Misture", usuario_id=user.id)
    r2 = Receita(nome="Bolo de Cenoura", categoria="Sobremesa", modo_preparo="Bata", usuario_id=user.id)
    r3 = Receita(nome="Sopa de Legumes", categoria="Sopas", modo_preparo="Cozinhe", usuario_id=user.id)
    db.add_all([r1, r2, r3])
    db.commit()

    db.add_all([
        Avaliacao(nota=5, usuario_id=user.id, receita_id=r1.id),
        Avaliacao(nota=3, usuario_id=user.id, receita_id=r2.id),
        Avaliacao(nota=4, usuario_id=user.id, receita_id=r2.id),
    ])
    db.commit()

    def override_get_db():
        test_db = Session()
        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    db.close()


def test_pesquisar_e_filtrar_receitas(client):
    # US03: busca por nome
    res_busca = client.get("/api/receitas?nome=bolo").json()
    assert len(res_busca) == 2

    # US03: filtro por categoria
    res_cat = client.get("/api/receitas?categoria=Sopas").json()
    assert len(res_cat) == 1
    assert res_cat[0]["nome"] == "Sopa de Legumes"

    # US03: categorias únicas
    assert client.get("/api/receitas/categorias").json() == ["Sobremesa", "Sopas"]


def test_ordenar_receitas_por_avaliacao(client):
    # US05: ordenadas por avaliação decrescente
    res = client.get("/api/receitas?ordenar_por=avaliacao&ordem=desc").json()
    assert [r["nome"] for r in res] == ["Bolo de Chocolate", "Bolo de Cenoura", "Sopa de Legumes"]
    assert res[0]["media_avaliacao"] == 5.0
    assert res[1]["media_avaliacao"] == 3.5
    assert res[2]["media_avaliacao"] == 0.0


def test_cadastrar_receita_sucesso_e_detalhes(client):
    payload = {
        "nome": "Torta de Maçã",
        "categoria": "Sobremesa",
        "modo_preparo": "Asse por 40 min",
        "usuario_id": 1,
        "ingredientes": [
            {"nome": "Maçã", "quantidade": "3 unidades"},
            {"nome": "Farinha", "quantidade": "200g"},
        ],
    }
    res = client.post("/api/receitas", json=payload)
    assert res.status_code == 201
    dados = res.json()
    assert dados["nome"] == "Torta de Maçã"
    assert len(dados["ingredientes"]) == 2

    res_detalhe = client.get(f"/api/receitas/{dados['id']}")
    assert res_detalhe.status_code == 200
    assert res_detalhe.json()["categoria"] == "Sobremesa"


