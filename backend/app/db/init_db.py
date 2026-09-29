from app import models
from app.core.security import gerar_hash_senha
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.usuario import Usuario


def seed_default_users():
    with SessionLocal() as db:
        if db.query(Usuario).count() == 0:
            usuarios_padrao = [
                Usuario(
                    nome="Usuario A",
                    email="usuario.a@pafaze.com",
                    senha_hash=gerar_hash_senha("senha123"),
                ),
                Usuario(
                    nome="Usuario B",
                    email="usuario.b@pafaze.com",
                    senha_hash=gerar_hash_senha("senha123"),
                ),
                Usuario(
                    nome="Usuario C",
                    email="usuario.c@pafaze.com",
                    senha_hash=gerar_hash_senha("senha123"),
                ),
            ]
            db.add_all(usuarios_padrao)
            db.commit()


def create_tables():
    Base.metadata.create_all(bind=engine)
    seed_default_users()
