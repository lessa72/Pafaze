from pydantic import BaseModel, ConfigDict, Field


class ComentarioCreate(BaseModel):
    usuario_id: int
    texto: str = Field(..., min_length=1, max_length=1000)


class ComentarioResponse(BaseModel):
    id: int
    texto: str
    usuario_id: int
    receita_id: int

    model_config = ConfigDict(from_attributes=True)