# 🍳 Pafazê

Sistema web para compartilhamento e descoberta de receitas a partir dos
ingredientes disponíveis pelo usuário.

## Equipe
Júlia Almeida Luna (Backend), Gabriel de Souza Gomes (Full-stack), Alice Lessa Ferreira (Full-stack), Davi Santos Rodrigues (Frontend)

# Objetivo

O Pafazê é um sistema web para cadastro, pesquisa e avaliação de receitas
culinárias. Além de permitir a consulta de receitas cadastradas, o sistema possibilita que
o usuário informe os ingredientes que possui disponíveis.

A partir dessas informações, o Pafazê identifica quais receitas podem ser
preparadas e quais ainda necessitam de ingredientes adicionais. As receitas são ordenadas pela quantidade de ingredientes faltantes, facilitando o aproveitamento dos alimentos que o usuário já possui.

---
# Histórias de Usuário

## US01 — Criar conta

Como usuário, quero criar uma conta de usuário e acessar o sistema com minhas credenciais.

---

## US02 — Cadastrar receita

Como usuário, quero cadastrar uma receita informando nome, categoria,
ingredientes e modo de preparo.

---

## US03 — Pesquisar receitas

Como usuário, quero pesquisar receitas pelo nome e filtrar por categoria.

---

## US04 — Avaliar receita

Como usuário, quero atribuir uma avaliação a uma receita.

---

## US05 — Visualizar receitas mais bem avaliadas

Como usuário, quero visualizar as receitas ordenadas por avaliação.

---

## US06 — Fazer comentário

Como usuário, quero deixar comentários e dicas nas receitas.

---

## US07 — Filtrar por maior quantidade de ingredientes

Como usuário, quero visualizar receitas ordenadas pela quantidade de ingredientes
que já possuo, para encontrar as receitas mais compatíveis com o que tenho disponível em casa.

---

## US8 — Fazer amigos

Como usuário, quero adicionar outros usuários como amigos,
para compartilhar receitas e acompanhar suas atividades na plataforma.

—--


# Tecnologias

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Python
- FastAPI
- SQLAlchemy

## Banco de dados

- SQLite

## Desenvolvimento

- Git
- GitHub

## Inteligência Artificial


- ChatGPT

Durante o desenvolvimento do Pafazê, utilizaremos o ChatGPT como ferramenta
de apoio à programação e ao desenvolvimento do sistema.

A IA será utilizada principalmente para auxiliar na implementação das histórias
de usuário, geração e melhoria de trechos de código, criação de componentes da
interface, resolução de erros, refatoração e documentação.

Também pretendemos utilizar a ferramenta como apoio na discussão de alternativas
de implementação e organização do código ao longo do desenvolvimento.

As sugestões produzidas pela IA serão analisadas pela equipe antes de serem
incorporadas ao projeto, permitindo que o grupo acompanhe e compreenda as
decisões tomadas durante a implementação.

---


# Arquitetura

O sistema seguirá uma arquitetura cliente-servidor dividida em três componentes:

1. Frontend Web, desenvolvido em React;
2. Backend, implementado como uma API REST utilizando FastAPI;
3. Banco de Dados SQLite, utilizado para persistência das receitas,
   ingredientes e avaliações.

```mermaid
flowchart LR
    U[Usuário]

    subgraph Frontend
        R[React]
    end

    subgraph Backend
        API[FastAPI REST API]
        S[Serviços / Regras de Negócio]
    end

    DB[(SQLite)]

    U --> R
    R -->|HTTP / JSON| API
    API --> S
    S --> DB
    DB --> S
    S --> API
    API --> R
```

Além disso, o Pafazê possui entidades principais (Usuário, Receita, Ingrediente, Avaliação e Comentário) e relacionamentos entre elas (como as conexões de amizade entre usuários e a ligação entre uma receita e suas avaliações). Essa modelagem visual serve como base lógica para estruturarmos as tabelas do nosso banco de dados no backend.

```mermaid
classDiagram
    class Usuario {
        +int id
        +String nome
        +String email
        +String senha
        +cadastrarReceita()
        +avaliarReceita()
        +adicionarAmigo()
    }
    
    class Receita {
        +int id
        +String nome
        +String categoria
        +String modoPreparo
        +listarIngredientes()
    }
    
    class Ingrediente {
        +int id
        +String nome
        +float quantidade
    }
    os
    class Avaliacao {
        +int id
        +int nota
    }
    
    class Comentario {
        +int id
        +String texto
    }

    Usuario "1" -- "*" Receita : cria >
    Usuario "*" -- "*" Usuario : amigos >
    Usuario "1" -- "*" Avaliacao : faz >
    Usuario "1" -- "*" Comentario : escreve >
    Receita "1" -- "*" Ingrediente : possui >
    Receita "1" -- "*" Avaliacao : recebe >
    Receita "1" -- "*" Comentario : possui >
```
