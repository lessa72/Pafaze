from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.services.usuario import (
    listar_usuarios as listar_usuarios_service,
    obter_usuario_por_email,
    obter_usuario_por_id,
    registrar_usuario,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    if obter_usuario_por_email(db, dados.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado.",
        )
    return registrar_usuario(db, dados)


@router.get("", response_model=list[UsuarioResponse])
def listar_usuarios(q: str | None = None, db: Session = Depends(get_db)):
    return listar_usuarios_service(db, q)


@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obter_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = obter_usuario_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )
    return usuario

