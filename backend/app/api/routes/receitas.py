from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.receita import ReceitaResponse
from app.services.receita import buscar_receitas, listar_categorias

router = APIRouter(prefix="/receitas", tags=["receitas"])


@router.get("", response_model=list[ReceitaResponse])
def pesquisar_receitas(
    nome: str | None = Query(default=None, description="Pesquisar por nome da receita"),
    categoria: str | None = Query(default=None, description="Filtrar por categoria"),
    ordenar_por: str | None = Query(default=None, description="Critério de ordenação"),
    ordem: str = Query(default="desc", pattern="^(asc|desc)$", description="Direção da ordenação"),
    db: Session = Depends(get_db),
):
    return buscar_receitas(
        db=db,
        nome=nome,
        categoria=categoria,
        ordenar_por=ordenar_por,
        ordem=ordem,
    )


@router.get("/categorias", response_model=list[str])
def obter_categorias(db: Session = Depends(get_db)):
    return listar_categorias(db=db)

