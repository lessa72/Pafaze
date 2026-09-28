from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict


class AmigoUsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class AmizadeResponse(BaseModel):
    usuario_id: int
    amigo_id: int
    status: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class AmizadeDetalhadaResponse(BaseModel):
    usuario_id: int
    amigo_id: int
    status: str
    criado_em: datetime
    solicitante: AmigoUsuarioResponse
    destinatario: AmigoUsuarioResponse

    model_config = ConfigDict(from_attributes=True)


class AmizadeUpdateStatus(BaseModel):
    status: Literal["aceito", "recusado"]
