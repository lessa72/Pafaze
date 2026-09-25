from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.receita import ReceitaCreate, ReceitaDetalheResponse, ReceitaResponse
from app.services.receita import (
    buscar_receitas,
    criar_receita,
    listar_categorias,
    obter_receita_por_id,
)

router = APIRouter(prefix="/receitas", tags=["receitas"])


@router.get("", response_model=list[ReceitaResponse])
def pesquisar_receitas(
    nome: str | None = Query(default=None, description="Pesquisar por nome da receita"),
    categoria: str | None = Query(default=None, description="Filtrar por categoria"),
    ordenar_por: str | None = Query(default=None, description="Critério de ordenação, ex: avaliacao"),
    ordem: str = Query(default="desc", pattern="^(asc|desc)$", description="Direção da ordenação: desc ou asc"),
    db: Session = Depends(get_db),
):
    """
    Pesquisa receitas por nome e filtra por categoria (US03),
    com suporte à ordenação pela nota média de avaliação (US05).
    """
    return buscar_receitas(
        db=db,
        nome=nome,
        categoria=categoria,
        ordenar_por=ordenar_por,
        ordem=ordem,
    )


@router.get("/categorias", response_model=list[str])
def obter_categorias(db: Session = Depends(get_db)):
    """Retorna as categorias distintas cadastradas para alimentar o filtro (US03)."""
    return listar_categorias(db=db)


@router.post("", response_model=ReceitaDetalheResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_receita(dados: ReceitaCreate, db: Session = Depends(get_db)):
    """Cadastra uma nova receita com ingredientes (US02)."""
    try:
        return criar_receita(db=db, dados=dados)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{id}", response_model=ReceitaDetalheResponse)
def detalhar_receita(id: int, db: Session = Depends(get_db)):
    """Retorna os detalhes de uma receita por ID (US02)."""
    receita = obter_receita_por_id(db=db, receita_id=id)
    if not receita:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receita não encontrada.")
    return receita

