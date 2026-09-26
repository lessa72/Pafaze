from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.comentario import ComentarioCreate, ComentarioResponse
from app.services.comentario import criar_comentario, listar_comentarios

router = APIRouter(
    prefix="/receitas/{receita_id}/comentarios",
    tags=["comentarios"],
)


@router.post("", response_model=ComentarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_comentario(
    receita_id: int,
    dados: ComentarioCreate,
    db: Session = Depends(get_db),
):
    try:
        return criar_comentario(db, receita_id, dados)
    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(erro),
        )


@router.get("", response_model=list[ComentarioResponse])
def obter_comentarios(
    receita_id: int,
    db: Session = Depends(get_db),
):
    return listar_comentarios(db, receita_id)