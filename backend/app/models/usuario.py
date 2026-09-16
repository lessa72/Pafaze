from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255))

    receitas = relationship("Receita", back_populates="autor")
    avaliacoes = relationship("Avaliacao", back_populates="usuario")
    comentarios = relationship("Comentario", back_populates="usuario")
