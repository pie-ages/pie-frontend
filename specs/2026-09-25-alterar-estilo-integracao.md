# Alteração de estilo — integração com backend

**Status:** Rascunho
**Data:** 2026-09-25

## Problema

A tela de alteração de estilo (task anterior) funciona só com um estilo mockado como "atual" e não persiste nada — o usuário não consegue de fato ver nem alterar o estilo salvo no seu perfil.

## Comportamento esperado

- O sistema busca os estilos atuais do usuário via `GET /users/me/style` ao abrir a tela.
- O sistema destaca os cards correspondentes aos estilos retornados pela API (podem ser mais de um).
- O usuário marca/desmarca estilos entre as opções disponíveis (seleção múltipla, não exclusiva).
- O usuário toca em "Continuar" para confirmar.
- O sistema envia a escolha via `PUT /users/me/style`, com os estilos selecionados no formato esperado pelo backend.
- O sistema mostra um estado de carregamento enquanto a alteração está sendo enviada.
- O sistema impede um novo toque em "Continuar" enquanto a requisição anterior ainda está em andamento.
- O sistema atualiza a tela para refletir o novo estilo confirmado após sucesso.
- O sistema mostra um estado de erro visual caso a consulta ou a alteração falhem.

## Fora de escopo

- Construir a infraestrutura de autenticação/sessão do app. Hoje não existe nenhuma: `useAuth()` é só um boolean, `signIn()` não recebe nada, e `apiFetch` só faz GET sem nenhum header de autorização — não há como identificar "o usuário atual" para uma chamada autenticada. Essa task depende de uma infra de sessão/token existir em outro lugar do projeto; a spec assume que, quando isso existir, haverá uma forma de anexar a identidade do usuário às chamadas.
- Criar o ponto de entrada da tela (vem da task do quiz/onboarding).
- Alterar o enum `Style` ou os endpoints do backend.
- Identificação automática de estilo, IA/recomendação, análise facial ou corporal.
- Questionário da US09.

## Casos de borda

- Usuário sem estilo definido: como esta tela só é alcançada depois do quiz de onboarding (que define um estilo), isso não deveria acontecer no fluxo normal. Tratado defensivamente: nenhum card aparece selecionado, sem mensagem de erro.
- Erro ao consultar o estilo atual (`GET` falha): mostra estado de erro visual, sem quebrar a tela.
- Erro ao confirmar a alteração (`PUT` falha): mostra erro, mantém a seleção anterior como "atual", permite tentar de novo.
- Usuário toca em "Continuar" múltiplas vezes rápido: só a primeira chamada é enviada; botão fica desabilitado/em loading até a resposta.
- Voltar para uma tela de visualização do estilo (se existir) depois de confirmar: deve refletir o novo estilo, não o antigo.

## Decisões em aberto

- Como o app vai identificar "o usuário atual" para essas chamadas (token, sessão) depende de uma infraestrutura de autenticação que ainda não existe no projeto. Esta task não pode ser considerada aprovada para implementação até essa dependência ser resolvida em outro lugar.
- Formato exato de `GET`/`PUT /users/me/style` para múltiplos estilos (lista de valores do enum `Style`, provavelmente) — a task original descrevia um valor único; precisa confirmar o contrato real com quem define o backend antes de implementar.

## Critério de pronto

- A tela busca e reflete o estilo real do usuário via `GET /users/me/style`.
- Confirmar uma nova escolha persiste via `PUT /users/me/style`.
- Loading aparece durante as duas chamadas.
- Erros de rede (consulta e alteração) têm tratamento visual.
- Múltiplos toques em "Continuar" durante o envio não disparam múltiplas chamadas.
- Nenhum dado mockado é mais necessário para o fluxo principal da tela.
