from sqlalchemy.orm import Session

from app.models.comentario import Comentario
from app.models.receita import Receita
from app.models.usuario import Usuario
from app.schemas.comentario import ComentarioCreate


def criar_comentario(
    db: Session,
    receita_id: int,
    dados: ComentarioCreate,
) -> Comentario:
    usuario = db.query(Usuario).filter(Usuario.id == dados.usuario_id).first()
    if usuario is None:
        raise ValueError("Usuário não encontrado.")

    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if receita is None:
        raise ValueError("Receita não encontrada.")

    comentario = Comentario(
        texto=dados.texto.strip(),
        usuario_id=dados.usuario_id,
        receita_id=receita_id,
    )

    db.add(comentario)
    db.commit()
    db.refresh(comentario)

    return comentario


def listar_comentarios(
    db: Session,
    receita_id: int,
) -> list[Comentario]:
    return (
        db.query(Comentario)
        .filter(Comentario.receita_id == receita_id)
        .order_by(Comentario.id)
        .all()
    )