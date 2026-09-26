# Alteração de estilo — tela (mockada)

**Status:** Aprovada
**Data:** 2026-09-25

## Problema

Não existe nenhuma tela no app que permita ao usuário ver ou escolher o estilo de moda associado ao seu perfil. A lista de estilos disponíveis já existe no backend (hoje só usada para filtrar a vitrine), mas não há nenhuma tela que a use para o usuário escolher um estilo próprio.

## Comportamento esperado

- O usuário abre a tela de alteração de estilo (por enquanto acessada por rota direta em desenvolvimento — o ponto de entrada real vem da task do quiz de onboarding, ainda em andamento).
- O sistema carrega as opções de estilo a partir de `useTaxonomy()`, a mesma fonte real já usada no grupo "Estilos" dos filtros da vitrine.
- O sistema destaca visualmente os estilos mockados como "atuais" ao abrir a tela (valor fixo no código, não vindo de API de usuário) — o usuário pode ter mais de um estilo associado ao perfil.
- O usuário pode selecionar mais de um estilo (seleção múltipla, não exclusiva).
- O usuário toca num estilo pra marcar, e toca de novo pra desmarcar.
- O sistema atualiza imediatamente quais cards aparecem destacados como selecionados.
- O usuário toca em "Continuar" para confirmar a escolha.
- O sistema guarda a escolha confirmada só em memória (estado local da tela) — nada é persistido.
- A tela segue o padrão visual dos demais componentes do app (chips/cards no estilo já usado nos filtros de estilo da vitrine, cores da marca).

## Fora de escopo

- Chamadas a `GET /users/me/style` ou `PUT /users/me/style`.
- Qualquer persistência real da escolha (backend ou storage local).
- Ponto de entrada para esta tela (menu, botão em outra tela) — fica para a task do quiz/onboarding.
- Tratamento de erro de rede na busca de estilos além do que `useTaxonomy()` já entrega.
- Visualização detalhada do estilo atual com background específico.
- Fluxo/telas do questionário de onboarding (US09).

## Casos de borda

- `useTaxonomy()` ainda carregando ou retorna lista de estilos vazia: tela não quebra; nenhum card aparece até os dados chegarem.
- Nenhum dos estilos mockados como "atuais" bate com algum id da lista real (mock desatualizado): nenhum card aparece pré-selecionado, sem erro visual.
- Usuário desmarca todos os estilos: "Continuar" continua habilitado (nenhum estilo selecionado é um estado válido nesta task, sem validação de mínimo).
- Nome de estilo muito longo (vindo do backend): não quebra o layout do card.
- Usuário toca em "Continuar" sem trocar nada: comportamento igual a confirmar o mesmo estilo, sem erro.

## Decisões em aberto

(nenhuma)

## Critério de pronto

- A tela mostra as opções de estilo vindas de `useTaxonomy()`.
- Um ou mais estilos mockados aparecem destacados como "atuais" ao abrir a tela.
- Tocar num estilo marca/desmarca a seleção visualmente, permitindo mais de um selecionado ao mesmo tempo.
- O botão "Continuar" existe, é clicável, e não dispara nenhuma chamada de rede.
- Nenhuma chamada a `GET`/`PUT /users/me/style` acontece nesta task.
