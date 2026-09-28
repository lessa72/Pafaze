import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app
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

    u1 = Usuario(nome="Alice", email="alice@test.com", senha_hash="xyz")
    u2 = Usuario(nome="Bob", email="bob@test.com", senha_hash="xyz")
    u3 = Usuario(nome="Carol", email="carol@test.com", senha_hash="xyz")
    db.add_all([u1, u2, u3])
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


def test_solicitar_amizade_e_validacoes(client):
    # Enviar solicitação com sucesso
    res = client.post("/api/usuarios/1/amigos/2")
    assert res.status_code == 201
    assert res.json()["status"] == "pendente"

    # Não pode adicionar a si mesmo
    res_self = client.post("/api/usuarios/1/amigos/1")
    assert res_self.status_code == 400

    # Pedido duplicado
    res_dup = client.post("/api/usuarios/1/amigos/2")
    assert res_dup.status_code == 400


def test_aceitar_listar_e_remover_amigo(client):
    client.post("/api/usuarios/1/amigos/2")

    # Listar pedidos pendentes para o usuário 2
    res_pedidos = client.get("/api/usuarios/2/amigos/pedidos")
    assert res_pedidos.status_code == 200
    assert len(res_pedidos.json()) == 1

    # Aceitar pedido
    res_aceite = client.patch(
        "/api/usuarios/2/amigos/1", json={"status": "aceito"}
    )
    assert res_aceite.status_code == 200
    assert res_aceite.json()["status"] == "aceito"

    # Listar amigos de ambos os lados
    assert len(client.get("/api/usuarios/1/amigos").json()) == 1
    assert len(client.get("/api/usuarios/2/amigos").json()) == 1

    # Remover amigo
    res_del = client.delete("/api/usuarios/1/amigos/2")
    assert res_del.status_code == 204
    assert len(client.get("/api/usuarios/1/amigos").json()) == 0
