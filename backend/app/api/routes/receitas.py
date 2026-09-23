from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.receita import ReceitaResponse
from app.services.receita import buscar_receitas, listar_categorias

router = APIRouter(prefix="/receitas", tags=["receitas"])


@router.get("", response_model=list[ReceitaResponse])
def pesquisar_receitas(
    nome: str | None = Query(default=None, description="Pesquisar por nome da receita (US03)"),
    categoria: str | None = Query(default=None, description="Filtrar por categoria (US03)"),
    ordenar_por: str | None = Query(default=None, description="Critério de ordenação, ex: avaliacao (US05)"),
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
