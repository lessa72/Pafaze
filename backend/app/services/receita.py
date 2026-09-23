from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.avaliacao import Avaliacao
from app.models.receita import Receita
from app.schemas.receita import ReceitaResponse


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
    ordenar_por: str | None = None,
    ordem: str = "desc",
) -> list[ReceitaResponse]:
    query = (
        db.query(
            Receita,
            func.coalesce(func.avg(Avaliacao.nota), 0.0).label("media_avaliacao"),
            func.count(Avaliacao.id).label("total_avaliacoes"),
        )
        .outerjoin(Avaliacao, Avaliacao.receita_id == Receita.id)
        .group_by(Receita.id)
    )

    if nome:
        query = query.filter(Receita.nome.ilike(f"%{nome.strip()}%"))

    if categoria:
        query = query.filter(func.lower(Receita.categoria) == categoria.strip().lower())

    if ordenar_por == "avaliacao":
        coluna_ordenacao = func.coalesce(func.avg(Avaliacao.nota), 0.0)
        if ordem.lower() == "asc":
            query = query.order_by(coluna_ordenacao.asc(), Receita.id.asc())
        else:
            query = query.order_by(coluna_ordenacao.desc(), Receita.id.desc())
    else:
        query = query.order_by(Receita.id.desc())

    resultados = []
    for receita, media, total in query.all():
        resultados.append(
            ReceitaResponse(
                id=receita.id,
                nome=receita.nome,
                categoria=receita.categoria,
                modo_preparo=receita.modo_preparo,
                usuario_id=receita.usuario_id,
                media_avaliacao=round(float(media), 1),
                total_avaliacoes=int(total),
            )
        )
    return resultados
