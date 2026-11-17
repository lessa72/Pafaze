from unittest.mock import MagicMock

import pytest
from pydantic import ValidationError

from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioLogin
from app.services import usuario as usuario_service


def test_usuario_create_normaliza_email():
    dados = UsuarioCreate(
        nome="Ana Silva",
        email="  Ana.Silva@Exemplo.COM  ",
        senha="segura123",
    )
    assert dados.email == "ana.silva@exemplo.com"


@pytest.mark.parametrize("email_invalido", ["semarroba.com", "ana@semdominio", "a@b"])
def test_usuario_create_email_invalido(email_invalido):
    with pytest.raises(ValidationError):
        UsuarioCreate(nome="Ana", email=email_invalido, senha="segura123")


@pytest.mark.parametrize(
    "nome,senha",
    [("A", "segura123"), ("Ana", "12345")],
)
def test_usuario_create_nome_ou_senha_curtos(nome, senha):
    with pytest.raises(ValidationError):
        UsuarioCreate(nome=nome, email="ana@test.com", senha=senha)


def test_usuario_login_valida_e_normaliza_email():
    login = UsuarioLogin(email="  Bob@Test.COM ", senha="123")
    assert login.email == "bob@test.com"

    with pytest.raises(ValidationError):
        UsuarioLogin(email="invalido", senha="123")


def test_criar_usuario_persiste_com_email_normalizado():
    db = MagicMock()

    criado = usuario_service.criar_usuario(
        db=db,
        nome="Ana",
        email="  ANA@Test.COM ",
        senha_hash="salt:hash",
    )

    assert isinstance(criado, Usuario)
    assert criado.nome == "Ana"
    assert criado.email == "ana@test.com"
    assert criado.senha_hash == "salt:hash"
    db.add.assert_called_once_with(criado)
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(criado)


def test_registrar_usuario_gera_hash_e_cria_usuario(monkeypatch):
    db = MagicMock()
    mock_hash = MagicMock(return_value="salt:hash_fake")
    monkeypatch.setattr(usuario_service, "gerar_hash_senha", mock_hash)

    dados = UsuarioCreate(nome="Bruno", email="bruno@test.com", senha="MinhaSenha1")
    criado = usuario_service.registrar_usuario(db, dados)

    mock_hash.assert_called_once_with("MinhaSenha1")
    assert criado.senha_hash == "salt:hash_fake"
    db.commit.assert_called_once()


def test_autenticar_usuario_sucesso_e_falhas(monkeypatch):
    db = MagicMock()
    usuario_fake = Usuario(id=1, nome="Ana", email="ana@test.com", senha_hash="salt:hash")

    db.query.return_value.filter.return_value.first.return_value = usuario_fake
    monkeypatch.setattr(usuario_service, "verificar_senha", lambda s, h: s == "correta")

    assert usuario_service.autenticar_usuario(db, "ana@test.com", "correta") is usuario_fake
    assert usuario_service.autenticar_usuario(db, "ana@test.com", "errada") is None

    db.query.return_value.filter.return_value.first.return_value = None
    assert usuario_service.autenticar_usuario(db, "naoexiste@test.com", "correta") is None


def test_obter_por_id_e_listar_usuarios():
    db = MagicMock()
    usuario_fake = Usuario(id=7, nome="Clara", email="clara@test.com", senha_hash="h")

    db.query.return_value.filter.return_value.first.return_value = usuario_fake
    assert usuario_service.obter_usuario_por_id(db, 7) is usuario_fake

    db.query.return_value.all.return_value = [usuario_fake]
    assert usuario_service.listar_usuarios(db) == [usuario_fake]
    db.query.return_value.filter.return_value.all.return_value = [usuario_fake]
    assert usuario_service.listar_usuarios(db, q="  Clara ") == [usuario_fake]
