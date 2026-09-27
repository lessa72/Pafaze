from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.amizade import (
    AmigoUsuarioResponse,
    AmizadeDetalhadaResponse,
    AmizadeResponse,
    AmizadeUpdateStatus,
)
from app.services import amizade as amizade_service

router = APIRouter(prefix="/usuarios/{usuario_id}/amigos", tags=["amigos"])


@router.post(
    "/{amigo_id}",
    response_model=AmizadeResponse,
    status_code=status.HTTP_201_CREATED,
)
def solicitar_amizade(
    usuario_id: int, amigo_id: int, db: Session = Depends(get_db)
):
    try:
        return amizade_service.enviar_pedido_amizade(db, usuario_id, amigo_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.patch("/{amigo_id}", response_model=AmizadeResponse)
def responder_amizade(
    usuario_id: int,
    amigo_id: int,
    dados: AmizadeUpdateStatus,
    db: Session = Depends(get_db),
):
    try:
        return amizade_service.responder_pedido_amizade(
            db, usuario_id, amigo_id, dados.status
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("", response_model=list[AmigoUsuarioResponse])
def listar_amigos(usuario_id: int, db: Session = Depends(get_db)):
    return amizade_service.listar_amigos(db, usuario_id)


@router.get("/pedidos", response_model=list[AmizadeDetalhadaResponse])
def listar_pedidos(usuario_id: int, db: Session = Depends(get_db)):
    return amizade_service.listar_pedidos_pendentes(db, usuario_id)


@router.delete("/{amigo_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_amizade(
    usuario_id: int, amigo_id: int, db: Session = Depends(get_db)
):
    try:
        amizade_service.remover_amigo(db, usuario_id, amigo_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )
