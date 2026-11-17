def test_cadastrar_usuario_sucesso_e_nao_expoe_senha(client):
    res = client.post(
        "/api/usuarios",
        json={"nome": "Julia Luna", "email": "  Julia@Test.COM ", "senha": "segura123"},
    )

    assert res.status_code == 201
    dados = res.json()
    assert dados["id"] == 1
    assert dados["nome"] == "Julia Luna"
    assert dados["email"] == "julia@test.com"
    assert "criado_em" in dados
    assert "senha" not in dados
    assert "senha_hash" not in dados


def test_cadastrar_usuario_email_duplicado_retorna_400(client):
    payload = {"nome": "Ana", "email": "ana@test.com", "senha": "segura123"}
    assert client.post("/api/usuarios", json=payload).status_code == 201

    res_dup = client.post(
        "/api/usuarios",
        json={"nome": "Outra Ana", "email": "ANA@test.com", "senha": "outra123"},
    )
    assert res_dup.status_code == 400
    assert res_dup.json()["detail"] == "Email já cadastrado."


def test_cadastrar_usuario_dados_invalidos_retorna_422(client):
    res = client.post(
        "/api/usuarios",
        json={"nome": "A", "email": "invalido", "senha": "123"},
    )
    assert res.status_code == 422


def test_login_usuario_sucesso_e_credenciais_invalidas(client):
    client.post(
        "/api/usuarios",
        json={"nome": "Bruno", "email": "bruno@test.com", "senha": "SenhaForte1"},
    )

    res_ok = client.post(
        "/api/usuarios/login",
        json={"email": "  BRUNO@test.com ", "senha": "SenhaForte1"},
    )
    assert res_ok.status_code == 200
    assert res_ok.json()["email"] == "bruno@test.com"
    assert "senha_hash" not in res_ok.json()

    res_senha_errada = client.post(
        "/api/usuarios/login",
        json={"email": "bruno@test.com", "senha": "errada"},
    )
    assert res_senha_errada.status_code == 401

    res_inexistente = client.post(
        "/api/usuarios/login",
        json={"email": "ninguem@test.com", "senha": "SenhaForte1"},
    )
    assert res_inexistente.status_code == 401


def test_buscar_usuarios_por_email_e_obter_por_id_404(client):
    client.post("/api/usuarios", json={"nome": "Carla", "email": "carla.dev@test.com", "senha": "segura123"})
    client.post("/api/usuarios", json={"nome": "Diego", "email": "diego@test.com", "senha": "segura123"})

    res_email = client.get("/api/usuarios?q=carla.dev")
    assert res_email.status_code == 200
    assert len(res_email.json()) == 1
    assert res_email.json()[0]["nome"] == "Carla"

    res_vazio = client.get("/api/usuarios?q=inexistente")
    assert res_vazio.status_code == 200
    assert res_vazio.json() == []

    res_404 = client.get("/api/usuarios/999")
    assert res_404.status_code == 404
    assert res_404.json()["detail"] == "Usuário não encontrado."
