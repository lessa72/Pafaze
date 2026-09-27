# Modelo inicial do banco

Entidades previstas: Usuario, Receita, Ingrediente, ReceitaIngrediente, Avaliacao, Comentario e Amizade.

## Tabela `usuarios`
- `id`: Inteiro, chave primária (auto-incremento).
- `nome`: String (até 120 caracteres), obrigatório.
- `email`: String (até 255 caracteres), único e indexado, obrigatório.
- `senha_hash`: String (até 255 caracteres), hash seguro da senha.
- `criado_em`: DateTime, timestamp de criação da conta (default atual).

## Tabela `amizades`
- `usuario_id`: Inteiro, chave primária composta (FK para `usuarios.id`, remetente do pedido).
- `amigo_id`: Inteiro, chave primária composta (FK para `usuarios.id`, destinatário do pedido).
- `status`: String (até 20 caracteres), valores: `"pendente"`, `"aceito"`, `"recusado"` (default `"pendente"`).
- `criado_em`: DateTime, timestamp de envio da solicitação (default atual).

`ReceitaIngrediente` representa a relação N:N entre receitas e ingredientes. A quantidade pertence ao relacionamento, não ao ingrediente global.

A US07 pode receber uma lista de ingredientes disponíveis pelo HTTP, sem exigir uma tabela de despensa no primeiro sprint.


