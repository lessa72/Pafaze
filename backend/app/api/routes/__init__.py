from fastapi import APIRouter

from app.api.routes.comentarios import router as comentarios_router
from app.api.routes.receitas import router as receitas_router
from app.api.routes.usuarios import router as usuarios_router

api_router = APIRouter(prefix="/api")
api_router.include_router(receitas_router)
api_router.include_router(usuarios_router)
api_router.include_router(comentarios_router)