# Modelo inicial do banco

Entidades previstas: Usuario, Receita, Ingrediente, ReceitaIngrediente, Avaliacao, Comentario e Amizade.

`ReceitaIngrediente` representa a relação N:N entre receitas e ingredientes. A quantidade pertence ao relacionamento, não ao ingrediente global.

A US07 pode receber uma lista de ingredientes disponíveis pelo HTTP, sem exigir uma tabela de despensa no primeiro sprint.
