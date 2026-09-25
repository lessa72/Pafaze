from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.avaliacao import Avaliacao
from app.models.receita import Receita
from app.schemas.receita import ReceitaResponse


def listar_categorias(db: Session) -> list[str]:
    """Retorna todas as categorias únicas de receitas cadastradas para o filtro (US03)."""
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
    """
    Busca receitas aplicando filtros de nome e categoria (US03)
    e ordenação por avaliação calculada (US05).
    """
    # Agrega média e total de avaliações via outer join para manter receitas sem avaliação (US05)
    query = (
        db.query(
            Receita,
            func.coalesce(func.avg(Avaliacao.nota), 0.0).label("media_avaliacao"),
            func.count(Avaliacao.id).label("total_avaliacoes"),
        )
        .outerjoin(Avaliacao, Avaliacao.receita_id == Receita.id)
        .group_by(Receita.id)
    )

    # Filtro por nome: busca parcial case-insensitive (US03)
    if nome:
        query = query.filter(Receita.nome.ilike(f"%{nome.strip()}%"))

    # Filtro por categoria exata case-insensitive (US03)
    if categoria:
        query = query.filter(func.lower(Receita.categoria) == categoria.strip().lower())

    # Ordenação por média de avaliação (US05) ou por ID mais recente (padrão)
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
