from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

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
