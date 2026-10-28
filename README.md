Sistema Financeiro

Desenvolvi este projeto para gerenciar finanças pessoais, com cadastro, consulta, edição e exclusão de transações. O sistema conta com um painel para acompanhar receitas, despesas e saldo, além de filtros por categoria e paginação. A interface se adapta a computadores e celulares.

No back-end, utilizei Python com Flask, SQLAlchemy e Flask-Migrate, com uma API REST conectada ao PostgreSQL. O front-end foi feito com React, TypeScript, Vite e CSS3. Para executar a aplicação, utilizei Podman, Compose e Nginx.

Para rodar o projeto, configure as variáveis de ambiente e execute:

podman compose -f docker-compose.yaml up -d --build

Desenvolvido por Guilherme Zampar.
