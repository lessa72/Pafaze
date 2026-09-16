# Arquitetura

```mermaid
flowchart LR
    U[Usuário] --> R[React]
    R -->|HTTP / JSON| API[FastAPI]
    API --> SCH[Pydantic Schemas]
    API --> SVC[Services]
    SVC --> ORM[SQLAlchemy]
    ORM --> DB[(SQLite)]
```

O frontend é responsável pela interface e comunicação HTTP. O backend recebe as requisições, valida dados, aplica regras de negócio e persiste dados usando SQLAlchemy.

A base inicial não implementa histórias de usuário. Ela fornece a infraestrutura compartilhada para que cada integrante possa trabalhar em suas histórias.
