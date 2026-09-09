# Contrato do agente

1. Ao receber um identificador Linear, como `PIE-123`, consulte obrigatoriamente o Linear pelo MCP disponível antes de interpretar a tarefa, propor um plano ou alterar código.
2. Se o MCP estiver indisponível ou a issue não existir, informe a limitação e não infira requisitos pelo ID.
3. Inspecione código, testes, configurações e documentação relevantes antes de recomendar mudanças. Linear define **o que**; o repositório define **como**; ADRs e documentação definem **por quê**.
4. No planejamento, explique problema, contexto, conceitos, alternativas, trade-offs, recomendação e plano. Não produza código de implementação nessa fase.
5. Só implemente mediante solicitação explícita. O app Expo está em `pie/`; preserve os padrões encontrados nele.
6. Siga também [`docs/padroes-de-branch-e-commit.md`](docs/padroes-de-branch-e-commit.md): não faça commits diretos em `main` ou `dev`.
7. Nunca versione segredos, tokens ou configuração pessoal de MCP.

Leia as diretrizes em [`docs/agent/`](docs/agent/): workflow, Linear, ensino, planejamento, formato de resposta, ferramentas e validação.
