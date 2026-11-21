from unittest.mock import MagicMock

import pytest
from pydantic import ValidationError

from app.models.comentario import Comentario
from app.models.receita import Receita
from app.models.usuario import Usuario
from app.schemas.comentario import ComentarioCreate
from app.services.comentario import criar_comentario, listar_comentarios


def test_comentario_create_valido_e_limites():
    valido = ComentarioCreate(usuario_id=1, texto="Receita excelente!")
    assert valido.texto == "Receita excelente!"

    with pytest.raises(ValidationError):
        ComentarioCreate(usuario_id=1, texto="")

    with pytest.raises(ValidationError):
        ComentarioCreate(usuario_id=1, texto="a" * 1001)


def test_criar_comentario_sucesso_aplica_strip():
    db = MagicMock()
    usuario_fake = Usuario(id=1, nome="Ana", email="ana@test.com", senha_hash="h")
    receita_fake = Receita(id=10, nome="Bolo", categoria="Sobremesa", modo_preparo="Asse", usuario_id=1)
    db.query.return_value.filter.return_value.first.side_effect = [usuario_fake, receita_fake]

    dados = ComentarioCreate(usuario_id=1, texto="   Muito bom!   ")
    criado = criar_comentario(db, receita_id=10, dados=dados)

    assert isinstance(criado, Comentario)
    assert criado.texto == "Muito bom!"
    assert criado.usuario_id == 1
    assert criado.receita_id == 10
    db.add.assert_called_once_with(criado)
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(criado)


def test_criar_comentario_usuario_nao_encontrado():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    dados = ComentarioCreate(usuario_id=999, texto="Ótimo")
    with pytest.raises(ValueError, match="Usuário não encontrado."):
        criar_comentario(db, receita_id=10, dados=dados)

    db.add.assert_not_called()
    db.commit.assert_not_called()


def test_criar_comentario_receita_nao_encontrada():
    db = MagicMock()
    usuario_fake = Usuario(id=1, nome="Ana", email="ana@test.com", senha_hash="h")
    db.query.return_value.filter.return_value.first.side_effect = [usuario_fake, None]

    dados = ComentarioCreate(usuario_id=1, texto="Ótimo")
    with pytest.raises(ValueError, match="Receita não encontrada."):
        criar_comentario(db, receita_id=999, dados=dados)

    db.add.assert_not_called()
    db.commit.assert_not_called()


def test_listar_comentarios_retorna_lista_ordenada():
    db = MagicMock()
    c1 = Comentario(id=1, texto="Primeiro", usuario_id=1, receita_id=10)
    c2 = Comentario(id=2, texto="Segundo", usuario_id=2, receita_id=10)
    db.query.return_value.filter.return_value.order_by.return_value.all.return_value = [c1, c2]

    resultado = listar_comentarios(db, receita_id=10)

    assert resultado == [c1, c2]
    db.query.assert_called_once_with(Comentario)
