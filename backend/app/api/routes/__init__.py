from fastapi import APIRouter

from app.api.routes.usuarios import router as usuarios_router

api_router = APIRouter(prefix="/api")
api_router.include_router(usuarios_router)
