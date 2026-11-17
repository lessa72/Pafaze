import pytest

from app.core.security import gerar_hash_senha, verificar_senha


def test_gerar_hash_senha_formato_e_salt_unico():
    senha = "SenhaSegura123!"
    hash_1 = gerar_hash_senha(senha)
    hash_2 = gerar_hash_senha(senha)

    assert hash_1 != senha
    assert hash_1 != hash_2
    assert ":" in hash_1

    salt, digest = hash_1.split(":", 1)
    assert len(salt) == 32
    assert len(digest) == 64


def test_verificar_senha_valida():
    senha = "SenhaSegura123!"
    senha_hash = gerar_hash_senha(senha)

    assert verificar_senha(senha, senha_hash) is True


def test_verificar_senha_incorreta():
    senha_hash = gerar_hash_senha("SenhaSegura123!")

    assert verificar_senha("OutraSenha", senha_hash) is False
    assert verificar_senha("senhasegura123!", senha_hash) is False


@pytest.mark.parametrize(
    "hash_invalido",
    [
        "",
        "hash_sem_dois_pontos",
        "salt_sem_digest:",
        ":digest_sem_salt",
        "salt:digest_invalido",
        None,
    ],
)
def test_verificar_senha_hash_invalido_ou_malformado(hash_invalido):
    assert verificar_senha("SenhaSegura123!", hash_invalido) is False

