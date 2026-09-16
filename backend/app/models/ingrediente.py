from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Ingrediente(Base):
    __tablename__ = "ingredientes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120), unique=True, index=True)

    receitas = relationship("ReceitaIngrediente", back_populates="ingrediente")
