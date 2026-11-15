# Estados da interface

Este documento consolida como o app trata **carregamento, vazio, erro, sucesso, sessão expirada e permissões**. Detalhes por tela estão nos documentos de [telas](README.md#índice).

## Padrão geral

A maioria dos hooks de dados expõe um `status` com os valores abaixo, e a tela renderiza um bloco por valor:

```ts
type Status = 'loading' | 'success' | 'error' | 'empty';
```

| Estado    | Componente padrão                                              | Aparência                                      |
| --------- | -------------------------------------------------------------- | ---------------------------------------------- |
| `loading` | `LoadingState` (`text?`)                                       | Spinner central com texto opcional             |
| `error`   | `ErrorState` (`title`, `subtitle?`, `onRetry?`, `retryLabel?`) | Título, subtítulo e botão **Tentar novamente** |
| `empty`   | `EmptyState` (`icon?`, `title`, `subtitle?`)                   | Ícone esmaecido, título e subtítulo            |
| `success` | Conteúdo da tela                                               | —                                              |

Em formulários, o estado de envio aparece no próprio botão (`AuthButton`/`ProductActionButton` com `isLoading`), e os campos ficam desabilitados durante a operação. Erros de validação aparecem sob cada campo; erros de API aparecem em texto vermelho (`Colors.error`) acima das ações.

Requisições longas usam `AbortController`, para que respostas atrasadas não alterem uma tela que já foi fechada ou recarregada.

## Matriz de estados por tela

| Tela                            | Carregando                                    | Vazio                                    | Erro                                                     | Sucesso / feedback                                   |
| ------------------------------- | --------------------------------------------- | ---------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| Login                           | Botão em loading                              | —                                        | Campo inválido; credenciais; sem conexão                 | Entra nas abas                                       |
| Cadastro                        | Botão em loading                              | —                                        | Validação; e-mail em uso; login pós-cadastro falhou      | Vai ao Quiz                                          |
| Recuperar acesso                | Botão em loading                              | —                                        | Validação; API                                           | Vai a Verificar código                               |
| Verificar código / Nova senha   | Botões em loading                             | Sem e-mail na rota                       | Código inválido; código expirado (401)                   | "Novo código solicitado"; alerta "Senha redefinida!" |
| Quiz de estilo                  | Spinner; "Identificando seu estilo..."        | Sem perguntas → erro                     | Falha ao carregar; falha ao identificar (tentar/alterar) | Vai a Meu estilo                                     |
| Colorimetria                    | "Preparando sua paleta de cores..." (≥ 4 s)   | —                                        | Câmera negada; câmera falhou; análise falhou             | Paleta exibida; salva favoritas                      |
| Perfil                          | Por seção                                     | Por seção (colorimetria, cores, estilos) | Por seção, com Tentar novamente                          | —                                                    |
| Editar perfil / estilos / cores | Botão em loading                              | —                                        | Carga; salvamento; cor duplicada; limite de 4            | Volta ao Perfil                                      |
| Vitrine                         | "Carregando produtos..."; mais itens no fim   | "Nenhum produto encontrado"              | "Não foi possível carregar a storefront"                 | Aviso temporário (`notice`)                          |
| Detalhes do produto             | Spinner; verificação do closet                | —                                        | Produto não carregado; falha ao adicionar/abrir loja     | Volta à Vitrine com aviso; "já está no closet"       |
| Wishlist                        | —                                             | "Sua lista de desejos está vazia"        | —                                                        | Item "Indisponível"                                  |
| Closet                          | "A carregar o seu guarda-roupa..."            | "O seu guarda-roupa está vazio."         | Geral e por categoria; falha ao remover                  | Confirmação de remoção                               |
| Adicionar peça                  | "Identificando tipo, estilo e cor..."; salvar | —                                        | Formato/tamanho; análise falhou; taxonomia; câmera       | Alerta "Peça salva!"                                 |
| Meus Looks                      | "Carregando looks..."; mais itens             | "Você ainda não tem looks"               | Geral; paginação                                         | —                                                    |
| Criar Look                      | Sugestão; salvamento                          | Closet vazio no seletor; sem sugestões   | Sugestão; criação; foto                                  | Modal "Look salvo!"                                  |

## Sessão expirada

`isSessionExpiredError` (em `services/client.ts`) considera sessão expirada uma resposta **401** ou **404 com "Usuário não encontrado"**. As telas do Perfil e as de edição usam `useSessionExpiredRedirect`, que faz `signOut()` e leva ao Login. O Quiz trata o mesmo caso por meio de `StyleSessionError`.

Ao abrir o app, se o token salvo estiver expirado, o app tenta renová-lo (`POST /api/auth/refresh`) antes de decidir a rota inicial.

## Permissões

Declaradas em `app.json` (plugin `expo-image-picker`):

| Permissão | Texto exibido pelo sistema                                                | Onde é pedida                                         | Se negada                                                                        |
| --------- | ------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| Câmera    | "O app acessa sua câmera para fotografar peças e iniciar a colorimetria." | Adicionar peça (Tirar Foto), Colorimetria             | Alerta "Permissão necessária" / "Permita o acesso à câmera para tirar sua foto." |
| Fotos     | "O app acessa suas fotos para adicionar uma imagem ao look."              | Criar Look, Meus Looks, Editar perfil, Adicionar peça | Criar/Meus Looks: nada acontece; Editar perfil: alerta                           |
| Microfone | Desabilitado                                                              | —                                                     | —                                                                                |

Antes de abrir a câmera da colorimetria, o app exibe um **consentimento próprio** ("Antes da foto" → **Concordo e tirar foto** / **Agora não**), uma vez por visita à tela.

## Plataforma web

O app também roda na web (`npm run web`). Diferenças relevantes: tokens ficam em `localStorage` em vez do `SecureStore`; em Adicionar peça a escolha de foto vai direto para a galeria; as abas limitam a altura à janela para evitar scroll duplo.
