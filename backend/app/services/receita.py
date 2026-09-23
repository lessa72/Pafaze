from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.receita import Receita
from app.schemas.receita import ReceitaCreate


def criar_receita(db: Session, dados: ReceitaCreate) -> Receita:
    receita = Receita(
        nome=dados.nome.strip(),
        categoria=dados.categoria.strip(),
        modo_preparo=dados.modo_preparo.strip(),
        usuario_id=dados.usuario_id,
    )
    db.add(receita)
    db.commit()
    db.refresh(receita)
    return receita


def listar_categorias(db: Session) -> list[str]:
    categorias = (
        db.query(Receita.categoria)
        .distinct()
        .order_by(Receita.categoria.asc())
        .all()
    )
    return [c[0] for c in categorias if c[0]]


def buscar_receitas(
    db: Session,
    nome: str | None = None,
    categoria: str | None = None,
) -> list[Receita]:
    query = db.query(Receita)

    if nome:
        query = query.filter(Receita.nome.ilike(f"%{nome.strip()}%"))

    if categoria:
        query = query.filter(func.lower(Receita.categoria) == categoria.strip().lower())

    return query.order_by(Receita.id.desc()).all()
