from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import gerar_hash_senha, verificar_senha
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate


def autenticar_usuario(db: Session, email: str, senha: str) -> Usuario | None:
    usuario = obter_usuario_por_email(db, email)
    if not usuario:
        return None
    if not verificar_senha(senha, usuario.senha_hash):
        return None
    return usuario


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


def listar_usuarios(db: Session, q: str | None = None) -> list[Usuario]:
    query = db.query(Usuario)
    if q:
        termo = f"%{q.strip().lower()}%"
        query = query.filter(
            or_(
                Usuario.nome.ilike(termo),
                Usuario.email.ilike(termo),
            )
        )
    return query.all()

