from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Receita(Base):
    __tablename__ = "receitas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(150), index=True)
    categoria: Mapped[str] = mapped_column(String(80), index=True)
    modo_preparo: Mapped[str] = mapped_column(Text)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    autor = relationship("Usuario", back_populates="receitas")
    ingredientes = relationship("ReceitaIngrediente", back_populates="receita")
    avaliacoes = relationship("Avaliacao", back_populates="receita")
    comentarios = relationship("Comentario", back_populates="receita")
