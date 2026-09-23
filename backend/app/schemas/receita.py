from pydantic import BaseModel, ConfigDict


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
