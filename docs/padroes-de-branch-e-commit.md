# Convenções de Branch e Commit

## Fluxo de branches

`main` contém versões estáveis e `dev` recebe a integração das mudanças aprovadas. Não faça commits diretamente nessas branches: crie uma branch a partir de `dev` e abra um pull request para `dev`.

Use o formato abaixo, incluindo o identificador da issue do Linear quando ele existir:

```text
<tipo>/<linear-id>-<descricao-curta>
```

Exemplos:

```text
feature/PIE-123-criar-tela-de-perfil
bugfix/PIE-456-corrigir-validacao-de-login
docs/atualizar-readme
```

| Tipo | Quando usar |
| --- | --- |
| `feature` | Nova funcionalidade. |
| `bugfix` | Correção de defeito. |
| `refactor` | Melhoria interna sem alterar o comportamento esperado. |
| `docs` | Criação ou atualização de documentação. |
| `chore` | Manutenção, dependências ou configuração. |
| `deploy` | Preparação ou ajuste de publicação. |
| `infra` | Infraestrutura, CI/CD ou serviços de suporte. |

## Commits

Use Conventional Commits:

```text
<tipo>: <descricao no imperativo>
```

Exemplos:

```text
feat: adiciona tela de perfil
fix: corrige validação do login
refactor: centraliza tratamento de erros
```

- Escreva a descrição em letras minúsculas, no imperativo e sem ponto final.
- Faça commits pequenos e independentes; não misture feature, correção e refatoração.

## Pull requests

Use o template do repositório, informe a issue no Linear e inclua evidências quando aplicável. Antes de abrir o PR, atualize a sua branch com `dev`.
