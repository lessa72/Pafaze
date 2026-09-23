from sqlalchemy.orm import Session

from app.core.security import gerar_hash_senha
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate


def criar_usuario(db: Session, nome: str, email: str, senha_hash: str) -> Usuario:
    usuario = Usuario(
        nome=nome,
        email=email.strip().lower(),
        senha_hash=senha_hash,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def registrar_usuario(db: Session, dados: UsuarioCreate) -> Usuario:
    return criar_usuario(
        db=db,
        nome=dados.nome,
        email=dados.email,
        senha_hash=gerar_hash_senha(dados.senha),
    )


def obter_usuario_por_email(db: Session, email: str) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.email == email.strip().lower()).first()


def obter_usuario_por_id(db: Session, usuario_id: int) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()
