from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import api_router
from app.core.cors import configure_cors
from app.db.init_db import create_tables


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="Pafazê API",
    version="0.1.0",
    description="API do sistema de receitas Pafazê.",
    lifespan=lifespan,
)

configure_cors(app)
app.include_router(api_router)


@app.get("/health")
def health():
    return {"status": "ok"}
