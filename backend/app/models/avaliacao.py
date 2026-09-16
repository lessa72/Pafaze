from sqlalchemy import CheckConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Avaliacao(Base):
    __tablename__ = "avaliacoes"
    __table_args__ = (CheckConstraint("nota BETWEEN 1 AND 5"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    nota: Mapped[int]
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    receita_id: Mapped[int] = mapped_column(ForeignKey("receitas.id"))

    usuario = relationship("Usuario", back_populates="avaliacoes")
    receita = relationship("Receita", back_populates="avaliacoes")
