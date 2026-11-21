import pytest

from app.models.avaliacao import Avaliacao
from app.models.ingrediente import Ingrediente
from app.models.receita import Receita
from app.models.receita_ingrediente import ReceitaIngrediente
from app.models.usuario import Usuario
from app.services.receita import (
    buscar_receitas,
    buscar_receitas_por_ingredientes,
    listar_categorias,
)


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


@pytest.fixture
def cenario_compatibilidade(db_session):
    db, _ = db_session
    user = Usuario(nome="Chef Bob", email="bob@test.com", senha_hash="xyz")
    db.add(user)
    db.commit()

    i_ovo = Ingrediente(nome="Ovo")
    i_leite = Ingrediente(nome="Leite")
    i_farinha = Ingrediente(nome="Farinha")
    i_acucar = Ingrediente(nome="Açúcar")
    db.add_all([i_ovo, i_leite, i_farinha, i_acucar])
    db.commit()

    r1 = Receita(nome="Panqueca", categoria="Lanches", modo_preparo="Frite", usuario_id=user.id)
    r2 = Receita(nome="Omelete", categoria="Lanches", modo_preparo="Bata", usuario_id=user.id)
    r3 = Receita(nome="Bolo Simples", categoria="Sobremesa", modo_preparo="Asse", usuario_id=user.id)
    db.add_all([r1, r2, r3])
    db.commit()

    db.add_all([
        ReceitaIngrediente(receita_id=r1.id, ingrediente_id=i_ovo.id, quantidade="2"),
        ReceitaIngrediente(receita_id=r1.id, ingrediente_id=i_leite.id, quantidade="1 xícara"),
        ReceitaIngrediente(receita_id=r1.id, ingrediente_id=i_farinha.id, quantidade="1 xícara"),
        ReceitaIngrediente(receita_id=r2.id, ingrediente_id=i_ovo.id, quantidade="3"),
        ReceitaIngrediente(receita_id=r3.id, ingrediente_id=i_ovo.id, quantidade="2"),
        ReceitaIngrediente(receita_id=r3.id, ingrediente_id=i_leite.id, quantidade="1 xícara"),
        ReceitaIngrediente(receita_id=r3.id, ingrediente_id=i_farinha.id, quantidade="2 xícaras"),
        ReceitaIngrediente(receita_id=r3.id, ingrediente_id=i_acucar.id, quantidade="1 xícara"),
    ])
    db.commit()
    return db


def test_compatibilidade_calculo_e_ordenacao_prioridade(cenario_compatibilidade):
    db = cenario_compatibilidade
    res = buscar_receitas_por_ingredientes(db, ["Ovo", "Leite"])
    assert len(res) == 3
    assert res[0].nome == "Panqueca"
    assert res[0].ingredientes_disponiveis == 2
    assert res[0].ingredientes_faltantes == 1

    assert res[1].nome == "Bolo Simples"
    assert res[1].ingredientes_disponiveis == 2
    assert res[1].ingredientes_faltantes == 2

    assert res[2].nome == "Omelete"
    assert res[2].ingredientes_disponiveis == 1
    assert res[2].ingredientes_faltantes == 0


def test_compatibilidade_todos_ingredientes_disponiveis(cenario_compatibilidade):
    db = cenario_compatibilidade
    res = buscar_receitas_por_ingredientes(db, ["ovo"])
    omelete = next(r for r in res if r.nome == "Omelete")
    assert omelete.ingredientes_disponiveis == 1
    assert omelete.ingredientes_faltantes == 0
    assert omelete.total_ingredientes == 1


def test_compatibilidade_normalizacao_e_espacos(cenario_compatibilidade):
    db = cenario_compatibilidade
    res = buscar_receitas_por_ingredientes(db, ["  OVO  ", "  lEiTe  ", "   "])
    assert res[0].ingredientes_disponiveis == 2


def test_compatibilidade_sem_correspondencias(cenario_compatibilidade):
    db = cenario_compatibilidade
    res = buscar_receitas_por_ingredientes(db, ["Chocolate", "Morango"])
    for r in res:
        assert r.ingredientes_disponiveis == 0
        assert r.ingredientes_faltantes == r.total_ingredientes


def test_api_pesquisar_receitas_filtros_e_ordenacao(client, cenario_busca_e_ordenacao):
    res = client.get("/api/receitas?nome=bolo&categoria=Sobremesa&ordenar_por=avaliacao&ordem=desc")
    assert res.status_code == 200
    dados = res.json()
    assert len(dados) == 2
    assert dados[0]["nome"] == "Bolo de Chocolate"
    assert dados[0]["media_avaliacao"] == 5.0
    assert dados[1]["nome"] == "Bolo de Cenoura"
    assert dados[1]["media_avaliacao"] == 3.5


def test_api_listar_categorias(client, cenario_busca_e_ordenacao):
    res = client.get("/api/receitas/categorias")
    assert res.status_code == 200
    assert res.json() == ["Lanches", "Sobremesa", "Sopas"]


def test_api_compatibilidade_ingredientes(client, cenario_compatibilidade):
    res = client.get("/api/receitas/compatibilidade?ingredientes=Ovo&ingredientes=Leite")
    assert res.status_code == 200
    dados = res.json()
    assert len(dados) == 3
    assert dados[0]["nome"] == "Panqueca"
    assert dados[0]["ingredientes_disponiveis"] == 2
    assert dados[0]["ingredientes_faltantes"] == 1
    assert dados[0]["total_ingredientes"] == 3


def test_api_compatibilidade_sem_ingredientes_retorna_422(client):
    res = client.get("/api/receitas/compatibilidade")
    assert res.status_code == 422
