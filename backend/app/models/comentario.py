from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Comentario(Base):
    __tablename__ = "comentarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    texto: Mapped[str] = mapped_column(Text)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"))

    usuario = relationship("Usuario", back_populates="comentarios")
    receita = relationship("Receita", back_populates="comentarios")
