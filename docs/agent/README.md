# Agente de desenvolvimento

Este projeto usa um agente especializado para ajudar no processo de análise e ensino antes da implementação. Para que ele funcione corretamente, é necessário configurar o acesso ao MCP do Linear e ativar o agente certo no chat do Copilot.

## Estrutura mínima necessária

```text
AGENTS.md
.github/
└── agents/
    └── teacher-agent.agent.md
.vscode/
└── mcp.json
docs/
└── agent/
    ├── workflow.md
    ├── linear.md
    ├── teaching.md
    ├── planning.md
    ├── output-format.md
    ├── tools.md
    └── validation.md
```

## 1) Criar o arquivo de configuração do MCP

Dentro da pasta `.vscode` do projeto, crie o arquivo `mcp.json` com o seguinte conteúdo:

```json
{
  "servers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

Esse arquivo é essencial porque informa ao VS Code como conectar ao servidor MCP do Linear. Sem isso, o agente não consegue recuperar a tarefa do Linear e não consegue validar o contexto da issue antes de responder.

## 2) Confirmar a estrutura do projeto

Verifique se os itens abaixo existem:

- `AGENTS.md`
- `.github/agents/teacher-agent.agent.md`
- `.vscode/mcp.json`
- `docs/agent/`

Esses arquivos definem as regras do agente, a identidade do agente `teacher-agent` e o fluxo de trabalho do projeto.

## 3) Abrir o chat do Copilot

Para usar o agente, siga este fluxo:

1. Abra o VS Code, diretamente no diretorio do repositorio.
2. Vá para a área de chat do Copilot.
3. No seletor de agente ou no menu de conversa, escolha o agente `teacher-agent`.
4. Escreva uma mensagem como:
   - `PIE-38`

Importante: o agente deve ser usado pela área de chat do Copilot e não apenas por prompts gerais do editor. O agente `teacher-agent` é o responsável por explicar conceitos, trade-offs e alternativas antes da implementação, sem alterar código.

## 4) Como o agente atua

Quando você usa o `teacher-agent`, ele:

- busca a tarefa no Linear via MCP
- verifica o contexto do projeto e da regra `AGENTS.md`
- lê os arquivos e a estrutura relevante do app Expo
- explica o problema e o que importa na tarefa
- mostra alternativas e trade-offs
- prepara um plano, sem implementar código, até que você confirme

## 5) O que cada parte faz

- `AGENTS.md`: regras gerais do agente.
- `.github/agents/teacher-agent.agent.md`: define o comportamento do agente `teacher-agent`.
- `.vscode/mcp.json`: conecta o VS Code ao Linear usando o MCP.
- `docs/agent/`: guarda as regras do fluxo, do ensino, do planejamento e da validação.

## 6) Regras importantes

- O agente só deve ser usado no chat do Copilot com o `teacher-agent` selecionado.
- A tarefa Linear é a fonte do requisito.
- O código do projeto define a implementação possível.
- O agente não implementa código sem confirmação explícita.
- Não versionar segredos, tokens ou credenciais de MCP.

Com isso, o fluxo fica completo: configuração do MCP, ativação do agente no chat e utilização do ID da tarefa para começar a análise.
