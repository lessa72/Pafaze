import pytest

from app.models.avaliacao import Avaliacao
from app.models.receita import Receita
from app.models.usuario import Usuario
from app.services.receita import buscar_receitas, listar_categorias


@pytest.fixture
def cenario_busca_e_ordenacao(db_session):
    db, _ = db_session
    chef = Usuario(nome="Chef Alice", email="alice@test.com", senha_hash="xyz")
    db.add(chef)
    db.commit()

    r1 = Receita(nome="Bolo de Chocolate", categoria="Sobremesa", modo_preparo="Asse", usuario_id=chef.id)
    r2 = Receita(nome="Bolo de Cenoura", categoria="Sobremesa", modo_preparo="Bata", usuario_id=chef.id)
    r3 = Receita(nome="Sopa de Cebola", categoria="Sopas", modo_preparo="Ferva", usuario_id=chef.id)
    r4 = Receita(nome="Torta Salgada", categoria="Lanches", modo_preparo="Asse", usuario_id=chef.id)
    db.add_all([r1, r2, r3, r4])
    db.commit()

    db.add_all([
        Avaliacao(nota=5, usuario_id=chef.id, receita_id=r1.id),
        Avaliacao(nota=4, usuario_id=chef.id, receita_id=r2.id),
        Avaliacao(nota=3, usuario_id=chef.id, receita_id=r2.id),
    ])
    db.commit()
    return db


def test_busca_nome_case_insensitive_e_espacos(cenario_busca_e_ordenacao):
    db = cenario_busca_e_ordenacao
    res_lower = buscar_receitas(db, nome="bolo")
    res_upper = buscar_receitas(db, nome="  BOLO  ")
    assert len(res_lower) == 2
    assert len(res_upper) == 2
    assert {r.nome for r in res_lower} == {"Bolo de Chocolate", "Bolo de Cenoura"}


def test_busca_combinacao_nome_e_categoria(cenario_busca_e_ordenacao):
    db = cenario_busca_e_ordenacao
    res = buscar_receitas(db, nome="Bolo", categoria="Sobremesa")
    assert len(res) == 2
    res_sem_match = buscar_receitas(db, nome="Bolo", categoria="Sopas")
    assert res_sem_match == []


def test_busca_sem_correspondencias(cenario_busca_e_ordenacao):
    db = cenario_busca_e_ordenacao
    res = buscar_receitas(db, nome="InexistenteXYZ")
    assert res == []


def test_ordenacao_avaliacao_desc_e_asc(cenario_busca_e_ordenacao):
    db = cenario_busca_e_ordenacao
    res_desc = buscar_receitas(db, ordenar_por="avaliacao", ordem="desc")
    assert [r.nome for r in res_desc[:2]] == ["Bolo de Chocolate", "Bolo de Cenoura"]
    assert res_desc[0].media_avaliacao == 5.0
    assert res_desc[1].media_avaliacao == 3.5
    assert res_desc[2].media_avaliacao == 0.0

    res_asc = buscar_receitas(db, ordenar_por="avaliacao", ordem="asc")
    assert res_asc[-1].nome == "Bolo de Chocolate"
    assert res_asc[-1].media_avaliacao == 5.0
    assert res_asc[-2].nome == "Bolo de Cenoura"
    assert res_asc[-2].media_avaliacao == 3.5


def test_listar_categorias_unicas_e_ordenadas(cenario_busca_e_ordenacao):
    db = cenario_busca_e_ordenacao
    categorias = listar_categorias(db)
    assert categorias == ["Lanches", "Sobremesa", "Sopas"]
