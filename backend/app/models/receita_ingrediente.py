from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ReceitaIngrediente(Base):
    __tablename__ = "receita_ingredientes"

    receita_id: Mapped[int] = mapped_column(
        ForeignKey("receitas.id"), primary_key=True
    )
    ingrediente_id: Mapped[int] = mapped_column(
        ForeignKey("ingredientes.id"), primary_key=True
    )
    quantidade: Mapped[str] = mapped_column(String(80))

    receita = relationship("Receita", back_populates="ingredientes")
    ingrediente = relationship("Ingrediente", back_populates="receitas")
