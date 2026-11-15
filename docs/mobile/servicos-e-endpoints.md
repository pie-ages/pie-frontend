# Serviços e endpoints

Todo acesso à API passa por [`src/services/client.ts`](../../src/services/client.ts) e pelas funções de domínio em `src/services/`. As respostas são validadas com schemas Zod de `src/schemas/` usando `parseResponse`; se a resposta não bate com o schema, a função lança erro com mensagem amigável.

## Cliente HTTP

- **URL base:** `EXPO_PUBLIC_API_URL` (padrão `http://localhost:8080`).
- **Autenticação:** cabeçalho `Authorization: Bearer <accessToken>` nas chamadas `*Auth`; o token vem do armazenamento seguro.
- **Corpo:** JSON por padrão; `FormData` (multipart) para uploads, com a imagem no campo `file`.
- **Erros:** respostas não-2xx viram `ApiError(message, status, serverMessage)`, onde `serverMessage` é o campo `message` do corpo. `204` retorna `undefined`.

| Função                                 | Método         | Autenticada                            |
| -------------------------------------- | -------------- | -------------------------------------- |
| `apiFetch`                             | GET            | Não                                    |
| `apiPost`                              | POST           | Não                                    |
| `apiGetAuth`                           | GET            | Sim                                    |
| `apiPostAuth`                          | POST           | Sim                                    |
| `apiPutAuth`                           | PUT            | Sim                                    |
| `apiDeleteAuth`                        | DELETE         | Sim                                    |
| `apiUploadAuth`                        | POST multipart | Sim                                    |
| `apiPostWithToken` / `apiPutWithToken` | POST / PUT     | Token explícito (recuperação de senha) |

## Sessão

Armazenada por [`utils/auth-storage.ts`](../../src/utils/auth-storage.ts) (`SecureStore` no celular, `localStorage` na web):

| Chave               | Conteúdo             |
| ------------------- | -------------------- |
| `pie_auth_token`    | Access token         |
| `pie_refresh_token` | Refresh token        |
| `pie_expires_at`    | Expiração (epoch ms) |
| `pie_user_id`       | ID da usuária        |

O progresso do onboarding usa a chave `pie_onboarding_progress.<userId>`.

## Endpoints por fluxo

### Autenticação — `contexts/AuthContext.tsx`, `services/auth.ts`, `services/users.ts`

| Método | Endpoint                   | Uso                                       | Tela                               |
| ------ | -------------------------- | ----------------------------------------- | ---------------------------------- |
| POST   | `/api/auth/login`          | Login                                     | Login, Cadastro                    |
| POST   | `/api/auth/refresh`        | Renovar sessão ao abrir o app             | (inicialização)                    |
| POST   | `/api/auth/logout`         | Logout / revogar token de recuperação     | Perfil, Nova senha                 |
| POST   | `/api/users`               | Criar conta                               | Cadastro                           |
| POST   | `/api/auth/recover`        | Enviar / reenviar código                  | Recuperar acesso, Verificar código |
| POST   | `/api/auth/recover/verify` | Validar código → token de recuperação     | Verificar código                   |
| PUT    | `/api/auth/password`       | Definir nova senha (token de recuperação) | Nova senha                         |

### Usuária e perfil — `services/user.ts`

| Método | Endpoint          | Uso                                 | Tela                  |
| ------ | ----------------- | ----------------------------------- | --------------------- |
| GET    | `/api/users/me`   | Dados da usuária                    | Perfil, Editar perfil |
| PUT    | `/api/users/{id}` | Atualizar nome (`photoUrl` mantido) | Editar perfil         |

### Estilo — `services/style.ts`

| Método | Endpoint                         | Uso                         | Tela                                      |
| ------ | -------------------------------- | --------------------------- | ----------------------------------------- |
| GET    | `/api/style/questions`           | Perguntas do quiz (pública) | Quiz                                      |
| POST   | `/api/users/me/style/answers`    | Enviar respostas            | Quiz                                      |
| POST   | `/api/users/me/style/identify`   | Identificar estilo          | Quiz                                      |
| GET    | `/api/users/me/style/identified` | Último estilo identificado  | (função disponível, sem tela usando hoje) |
| GET    | `/api/users/me/style`            | Estilos favoritos           | Perfil, Editar estilos                    |
| PUT    | `/api/users/me/style`            | Salvar estilos favoritos    | Editar estilos                            |

### Colorimetria e preferências — `services/preferences.ts`

| Método | Endpoint                    | Uso                                          | Tela                       |
| ------ | --------------------------- | -------------------------------------------- | -------------------------- |
| POST   | `/api/users/me/colorimetry` | Analisar selfie (multipart)                  | Colorimetria               |
| GET    | `/api/users/me/preferences` | Estação, cores de destaque/evitar, favoritas | Perfil, Editar cores       |
| PUT    | `/api/users/me/preferences` | Salvar `favoriteColors`                      | Colorimetria, Editar cores |

### Catálogo — `services/products.ts`, `services/taxonomy.ts`, `services/companies.ts`

| Método | Endpoint                    | Uso                                                                                                                                                   | Tela                    |
| ------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| GET    | `/api/products`             | Catálogo paginado. Query: `search`, `styles`, `categories`, `colors`, `companies`, `materials` (repetíveis), `page`, `size` (20), `sort` (`name,ASC`) | Vitrine                 |
| GET    | `/api/products/{id}/public` | Detalhe do produto                                                                                                                                    | Detalhes do produto     |
| GET    | `/api/taxonomy`             | Estilos, categorias, cores e materiais (cache em memória)                                                                                             | Vitrine, Adicionar peça |
| GET    | `/api/companies/active`     | Lojas ativas (cache em memória)                                                                                                                       | Vitrine (filtro Lojas)  |

### Guarda-roupa — `services/wardrobe.ts`

| Método | Endpoint                               | Uso                                          | Tela                                    |
| ------ | -------------------------------------- | -------------------------------------------- | --------------------------------------- |
| GET    | `/api/users/me/wardrobe/items`         | Listar peças                                 | Closet, Criar Look, Detalhes do produto |
| POST   | `/api/users/me/wardrobe/items`         | Criar peça (multipart: `file` + `item` JSON) | Adicionar peça, Detalhes do produto     |
| POST   | `/api/users/me/wardrobe/items/analyze` | IA identifica categoria, estilo e cor        | Adicionar peça                          |
| DELETE | `/api/users/me/wardrobe/items/{id}`    | Remover peça                                 | Closet                                  |

### Looks — `services/looks.ts`

| Método | Endpoint                         | Uso                                                 | Tela                   |
| ------ | -------------------------------- | --------------------------------------------------- | ---------------------- |
| GET    | `/api/users/me/looks`            | Looks paginados (`size=20`, `createdAt,DESC`)       | Meus Looks             |
| POST   | `/api/users/me/looks`            | Criar look (`title`, `occasion?`, `items` em ordem) | Criar Look             |
| GET    | `/api/users/me/looks/suggestion` | Sugestão de look por regras (closet + Vitrine)      | Criar Look             |
| POST   | `/api/users/me/looks/{id}/image` | Foto do look (multipart)                            | Criar Look, Meus Looks |

### Sem endpoint

- **Wishlist:** estado local em `WishlistContext`, sem persistência (a API de wishlist existe; ver abaixo).
- **Onboarding:** progresso salvo apenas no dispositivo.

## Disponíveis na API e ainda não usados pelo app

| Método              | Endpoint                                                                  | O que oferece                                                 |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| GET                 | `/api/products/recommendations?limit=`                                    | Produtos recomendados pelo perfil (estilos e cores favoritas) |
| GET / POST / DELETE | `/api/wishlist`, `/api/wishlist/items`, `/api/wishlist/items/{productId}` | Wishlist salva por usuária                                    |
| GET / PUT / DELETE  | `/api/users/me/looks/{lookId}`                                            | Ver, editar e excluir um look                                 |
| DELETE              | `/api/users/me/looks/{lookId}/image`                                      | Remover a foto do look                                        |
| GET / PATCH         | `/api/users/me/wardrobe/items/{itemId}`                                   | Ver e editar uma peça do closet                               |
| GET / PUT           | `/api/users/me/product-styles`                                            | Estilos de produto preferidos (usados nas recomendações)      |
| GET                 | `/api/styles`                                                             | Lista pública de estilos                                      |
