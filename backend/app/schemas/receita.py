from pydantic import BaseModel, ConfigDict, Field


class ReceitaResponse(BaseModel):
    """Esquema de resposta de receita com métricas de avaliação (US03 e US05)."""

    id: int
    nome: str
    categoria: str
    modo_preparo: str
    usuario_id: int
    media_avaliacao: float = 0.0
    total_avaliacoes: int = 0

    model_config = ConfigDict(from_attributes=True)


class IngredienteItem(BaseModel):
    """Item de ingrediente com nome e quantidade."""

    nome: str = Field(min_length=1, max_length=120)
    quantidade: str = Field(min_length=1, max_length=80)

    model_config = ConfigDict(from_attributes=True)


class ReceitaCreate(BaseModel):
    """Esquema para criação de receita com ingredientes (US02)."""

    nome: str = Field(min_length=1, max_length=150)
    categoria: str = Field(min_length=1, max_length=80)
    modo_preparo: str = Field(min_length=1)
    usuario_id: int
    ingredientes: list[IngredienteItem] = Field(min_length=1)


class ReceitaDetalheResponse(ReceitaResponse):
    """Esquema de resposta de receita detalhada com ingredientes (US02)."""

    ingredientes: list[IngredienteItem] = []


class AvaliacaoCreate(BaseModel):
    """Esquema para atribuição de avaliação a uma receita (US04)."""

    usuario_id: int
    nota: int = Field(ge=1, le=5)


class AvaliacaoResponse(BaseModel):
    """Esquema de resposta para avaliação cadastrada (US04)."""

    id: int
    receita_id: int
    usuario_id: int
    nota: int

    model_config = ConfigDict(from_attributes=True)

