from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=255)
    senha: str = Field(..., min_length=6, max_length=128)

    @field_validator("email")
    @classmethod
    def validar_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Formato de e-mail inválido.")
        return v


class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
