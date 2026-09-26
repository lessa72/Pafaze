from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.amizade import Amizade
from app.models.usuario import Usuario


def buscar_amizade(db: Session, u1: int, u2: int) -> Amizade | None:
    return db.query(Amizade).filter(
        or_(
            and_(Amizade.usuario_id == u1, Amizade.amigo_id == u2),
            and_(Amizade.usuario_id == u2, Amizade.amigo_id == u1),
        )
    ).first()


def enviar_pedido_amizade(db: Session, usuario_id: int, amigo_id: int) -> Amizade:
    if usuario_id == amigo_id:
        raise ValueError("Um usuário não pode adicionar a si mesmo.")
    if not db.query(Usuario).filter(Usuario.id == usuario_id).first():
        raise ValueError("Usuário não encontrado.")
    if not db.query(Usuario).filter(Usuario.id == amigo_id).first():
        raise ValueError("Amigo não encontrado.")

    existente = buscar_amizade(db, usuario_id, amigo_id)
    if existente:
        if existente.status == "aceito":
            raise ValueError("Usuários já são amigos.")
        if existente.status == "pendente":
            raise ValueError("Já existe um pedido de amizade pendente.")
        existente.usuario_id, existente.amigo_id, existente.status = (
            usuario_id,
            amigo_id,
            "pendente",
        )
        db.commit()
        db.refresh(existente)
        return existente

    nova = Amizade(usuario_id=usuario_id, amigo_id=amigo_id, status="pendente")
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova


def responder_pedido_amizade(
    db: Session, usuario_id: int, solicitante_id: int, status: str
) -> Amizade:
    amizade = db.query(Amizade).filter(
        Amizade.usuario_id == solicitante_id,
        Amizade.amigo_id == usuario_id,
        Amizade.status == "pendente",
    ).first()
    if not amizade:
        raise ValueError("Pedido de amizade pendente não encontrado.")
    amizade.status = status
    db.commit()
    db.refresh(amizade)
    return amizade


def listar_amigos(db: Session, usuario_id: int) -> list[Usuario]:
    amizades = db.query(Amizade).filter(
        or_(Amizade.usuario_id == usuario_id, Amizade.amigo_id == usuario_id),
        Amizade.status == "aceito",
    ).all()
    return [
        a.destinatario if a.usuario_id == usuario_id else a.solicitante
        for a in amizades
    ]


def listar_pedidos_pendentes(db: Session, usuario_id: int) -> list[Amizade]:
    return db.query(Amizade).filter(
        Amizade.amigo_id == usuario_id, Amizade.status == "pendente"
    ).all()


def remover_amigo(db: Session, usuario_id: int, amigo_id: int) -> bool:
    amizade = buscar_amizade(db, usuario_id, amigo_id)
    if not amizade:
        raise ValueError("Amizade não encontrada.")
    db.delete(amizade)
    db.commit()
    return True
