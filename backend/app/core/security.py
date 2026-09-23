import hashlib
import secrets


def gerar_hash_senha(senha: str) -> str:
    salt = secrets.token_hex(16)
    hash_obj = hashlib.pbkdf2_hmac("sha256", senha.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{hash_obj.hex()}"


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    try:
        salt, hash_salvo = senha_hash.split(":", 1)
        novo_hash = hashlib.pbkdf2_hmac("sha256", senha_plana.encode("utf-8"), salt.encode("utf-8"), 100000)
        return secrets.compare_digest(novo_hash.hex(), hash_salvo)
    except (ValueError, AttributeError):
        return False
