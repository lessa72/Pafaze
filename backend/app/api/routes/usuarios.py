from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioLogin, UsuarioResponse
from app.services.usuario import (
    autenticar_usuario,
    listar_usuarios as listar_usuarios_service,
    obter_usuario_por_email,
    obter_usuario_por_id,
    registrar_usuario,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/login", response_model=UsuarioResponse)
def login_usuario(dados: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db, dados.email, dados.senha)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )
    return usuario


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

