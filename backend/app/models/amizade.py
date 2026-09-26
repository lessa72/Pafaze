from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Amizade(Base):
    __tablename__ = "amizades"

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"), primary_key=True
    )
    amigo_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"), primary_key=True
    )
    status: Mapped[str] = mapped_column(String(20), default="pendente")
    criado_em: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), server_default=func.now()
    )

    solicitante = relationship(
        "Usuario", foreign_keys=[usuario_id], backref="amizades_solicitadas"
    )
    destinatario = relationship(
        "Usuario", foreign_keys=[amigo_id], backref="amizades_recebidas"
    )
