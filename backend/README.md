# Backend

## Ambiente

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Rodar

```bash
uvicorn app.main:app --reload
```

API: `http://localhost:8000`
Documentação: `http://localhost:8000/docs`

## Testes

```bash
pytest backend/tests
```

## Endpoints Implementados

### Receitas (US03 e US05)
- `GET /api/receitas`: Consulta receitas com suporte a busca, filtro e ordenação:
  - `nome` (query opcional): Busca textual parcial por nome da receita (US03).
  - `categoria` (query opcional): Filtra pela categoria (US03).
  - `ordenar_por` (query opcional, ex: `avaliacao`): Ordena pela média calculada de notas (US05).
  - `ordem` (query, default `desc`): Sentido da ordenação (`desc` ou `asc`).
- `GET /api/receitas/categorias`: Lista as categorias cadastradas para filtros (US03).
