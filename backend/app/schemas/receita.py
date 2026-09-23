from pydantic import BaseModel, ConfigDict, Field


class ReceitaBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=150)
    categoria: str = Field(..., min_length=1, max_length=80)
    modo_preparo: str = Field(..., min_length=1)


class ReceitaCreate(ReceitaBase):
    usuario_id: int


class ReceitaResponse(ReceitaBase):
    id: int
    usuario_id: int
    media_avaliacao: float = 0.0
    total_avaliacoes: int = 0

    model_config = ConfigDict(from_attributes=True)
