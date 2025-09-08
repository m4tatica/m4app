# Relatório da Fase 1: Fundação do Backend e Schema do Banco de Dados PostgreSQL

## Objetivo
O objetivo desta fase foi construir a fundação crítica do sistema, focando na criação da estrutura do banco de dados no PostgreSQL externo, conectando a aplicação a ele, populando com dados iniciais e provando que a conexão é 100% persistente.

## Tecnologias Utilizadas
- **Backend:** Node.js v18.x com Express v4.18.2
- **Banco de Dados:** Cliente PostgreSQL (pg versão 8.x)

## Estrutura do Projeto
A seguinte estrutura de pastas foi criada:
```
backend_project/
├── index.js
├── package.json
├── package-lock.json
└── src/
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── taxasController.js
    ├── models/
    │   └── init.js
    └── routes/
        └── taxas.js
```

## Conexão com PostgreSQL
A conexão com o PostgreSQL foi estabelecida utilizando a Connection String fornecida:
`postgresql://neondb_owner:npg_Uvs1FOHpbhw5@ep-square-base-adqa2n6a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

Uma mensagem de sucesso 


é exibida no console ao iniciar o servidor, confirmando a conexão.

## Schema do Banco de Dados e Dados Iniciais
As tabelas `taxas`, `usuarios` e `produtos` foram criadas com sucesso. Os dados iniciais para `taxas` e `produtos` foram inseridos utilizando `ON CONFLICT DO NOTHING` para evitar duplicatas.

## Teste Crítico de Persistência
Para testar a persistência dos dados, os seguintes passos foram executados:

1.  Um endpoint `PUT /api/taxas/:id` foi criado para atualizar as taxas.
2.  A taxa para a parcela '12x' (ID 14) foi atualizada para `99.99`.
3.  O servidor foi reiniciado.
4.  Uma requisição `GET /api/taxas` foi feita para verificar se a alteração persistia.

O resultado da requisição `GET` confirmou que a taxa de '12x' permaneceu como `99.99`, provando a estabilidade e persistência da conexão com o banco de dados PostgreSQL.

## Conclusão da Fase 1
A Fase 1 foi concluída com sucesso. A fundação do backend está pronta e a conexão com o banco de dados PostgreSQL é estável e persistente. A aplicação está pronta para as próximas fases de desenvolvimento.

