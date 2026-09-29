from app.schemas.common import SchemaBase


class ReceitaCompatibilidadeResponse(SchemaBase):
    id: int
    nome: str
    categoria: str
    modo_preparo: str
    usuario_id: int
    media_avaliacao: float
    total_avaliacoes: int
    ingredientes_disponiveis: int
    total_ingredientes: int
    ingredientes_faltantes: int