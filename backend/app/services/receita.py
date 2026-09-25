from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.avaliacao import Avaliacao
from app.models.ingrediente import Ingrediente
from app.models.receita import Receita
from app.models.receita_ingrediente import ReceitaIngrediente
from app.models.usuario import Usuario
from app.schemas.receita import (
    AvaliacaoCreate,
    AvaliacaoResponse,
    IngredienteItem,
    ReceitaCreate,
    ReceitaDetalheResponse,
    ReceitaResponse,
)


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


def criar_receita(db: Session, dados: ReceitaCreate) -> ReceitaDetalheResponse:
    """Cadastra uma receita com seus ingredientes (US02)."""
    if not db.query(Usuario).filter(Usuario.id == dados.usuario_id).first():
        raise ValueError("Usuário não encontrado.")

    receita = Receita(
        nome=dados.nome.strip(),
        categoria=dados.categoria.strip(),
        modo_preparo=dados.modo_preparo.strip(),
        usuario_id=dados.usuario_id,
    )
    db.add(receita)
    db.flush()

    itens_resposta = []
    for item in dados.ingredientes:
        nome_ing = item.nome.strip()
        ing = db.query(Ingrediente).filter(func.lower(Ingrediente.nome) == nome_ing.lower()).first()
        if not ing:
            ing = Ingrediente(nome=nome_ing)
            db.add(ing)
            db.flush()

        relacao = ReceitaIngrediente(
            receita_id=receita.id, ingrediente_id=ing.id, quantidade=item.quantidade.strip()
        )
        db.add(relacao)
        itens_resposta.append(IngredienteItem(nome=ing.nome, quantidade=item.quantidade.strip()))

    db.commit()
    db.refresh(receita)
    return ReceitaDetalheResponse(
        id=receita.id,
        nome=receita.nome,
        categoria=receita.categoria,
        modo_preparo=receita.modo_preparo,
        usuario_id=receita.usuario_id,
        media_avaliacao=0.0,
        total_avaliacoes=0,
        ingredientes=itens_resposta,
    )


def obter_receita_por_id(db: Session, receita_id: int) -> ReceitaDetalheResponse | None:
    """Busca receita por ID com ingredientes e avaliações (US02)."""
    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if not receita:
        return None

    media = db.query(func.coalesce(func.avg(Avaliacao.nota), 0.0)).filter(Avaliacao.receita_id == receita_id).scalar() or 0.0
    total = db.query(func.count(Avaliacao.id)).filter(Avaliacao.receita_id == receita_id).scalar() or 0
    itens = [IngredienteItem(nome=ri.ingrediente.nome, quantidade=ri.quantidade) for ri in receita.ingredientes]

    return ReceitaDetalheResponse(
        id=receita.id,
        nome=receita.nome,
        categoria=receita.categoria,
        modo_preparo=receita.modo_preparo,
        usuario_id=receita.usuario_id,
        media_avaliacao=round(float(media), 1),
        total_avaliacoes=int(total),
        ingredientes=itens,
    )


def avaliar_receita(db: Session, receita_id: int, dados: AvaliacaoCreate) -> AvaliacaoResponse:
    """Atribui ou atualiza avaliação de um usuário para uma receita (US04)."""
    if not db.query(Receita).filter(Receita.id == receita_id).first():
        raise ValueError("Receita não encontrada.")
    if not db.query(Usuario).filter(Usuario.id == dados.usuario_id).first():
        raise ValueError("Usuário não encontrado.")

    avaliacao = (
        db.query(Avaliacao)
        .filter(Avaliacao.receita_id == receita_id, Avaliacao.usuario_id == dados.usuario_id)
        .first()
    )
    if avaliacao:
        avaliacao.nota = dados.nota
    else:
        avaliacao = Avaliacao(
            receita_id=receita_id,
            usuario_id=dados.usuario_id,
            nota=dados.nota,
        )
        db.add(avaliacao)

    db.commit()
    db.refresh(avaliacao)
    return AvaliacaoResponse(
        id=avaliacao.id,
        receita_id=avaliacao.receita_id,
        usuario_id=avaliacao.usuario_id,
        nota=avaliacao.nota,
    )



