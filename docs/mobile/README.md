# Documentação do Frontend Mobile — Piê Consultoria

Esta pasta descreve a aplicação mobile da Piê: como ela está organizada, como executá-la localmente, como a navegação funciona, o que cada tela faz, quais estados de interface existem, quais componentes são reutilizados e quais endpoints cada fluxo consome. Os mockups ficam em [`mockups/`](mockups/README.md), organizados por jornada e tela.

## Índice

| Documento                                           | Conteúdo                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Navegação](navegacao.md)                           | Navigators, abas, rotas protegidas, modais e mapa de relacionamento de telas          |
| [Telas — Autenticação](telas/autenticacao.md)       | Login, Cadastro, Recuperar acesso, Verificar código / Nova senha                      |
| [Telas — Perfil e Estilo](telas/perfil-e-estilo.md) | Quiz de estilo, Meu estilo, Seleção de estilos, Colorimetria, Perfil, edições         |
| [Telas — Vitrine e Recomendações](telas/vitrine.md) | Vitrine, filtros, Detalhes do produto, Wishlist, Onboarding                           |
| [Telas — Closet (guarda-roupa)](telas/closet.md)    | Closet e Adicionar peça                                                               |
| [Telas — Looks](telas/looks.md)                     | Meus Looks e Criar Look                                                               |
| [Estados da interface](estados.md)                  | Carregamento, vazio, erro, sucesso, sessão expirada e permissões                      |
| [Padrões visuais e componentes](padroes-visuais.md) | Tokens de tema, tipografia e componentes reutilizáveis                                |
| [Serviços e endpoints](servicos-e-endpoints.md)     | Cliente HTTP, autenticação e endpoints por fluxo                                      |
| [Divergências](divergencias.md)                     | Diferenças entre os mockups e o app, e pontos ainda parciais                          |
| [Mockups](mockups/README.md)                        | 7 mockups (Login, Quiz, Vitrine, Wishlist, Closet, Looks Foco/Grid) comparados ao app |

## Visão geral

O app permite que a cliente da consultoria:

1. **Crie conta e descubra seu estilo** por um quiz visual e por uma análise de **colorimetria** feita com IA a partir de uma selfie.
2. **Navegue pela Vitrine** de peças de lojas parceiras, com busca e filtros (estilo, peça, cor, loja, material), e salve peças na **Wishlist**.
3. **Monte seu Closet digital**, cadastrando peças por foto (a IA sugere tipo, estilo e cor) ou adicionando peças da Vitrine que já possui.
4. **Crie Looks** combinando de 1 a 4 peças do closet, com sugestão de composição por IA e foto opcional.
5. **Gerencie o Perfil**: nome, colorimetria, cores favoritas e estilos favoritos.

## Tecnologias

| Área                    | Tecnologia                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Framework               | [Expo](https://expo.dev) SDK 58 + React Native 0.88 + React 19.3                     |
| Linguagem               | TypeScript 6 (`strict`, alias `@/` → `src/`)                                         |
| Navegação               | Expo Router 58 (rotas por arquivo, `typedRoutes` habilitado)                         |
| Formulários e validação | React Hook Form + Zod (`@hookform/resolvers`)                                        |
| Estado global           | React Context (`Auth`, `Wishlist`, `UserStyle`, `Onboarding`)                        |
| Armazenamento seguro    | `expo-secure-store` (nativo) / `localStorage` (web)                                  |
| Mídia                   | `expo-image`, `expo-image-picker` (câmera e galeria)                                 |
| UI                      | `@expo/vector-icons`, `expo-blur`, `reanimated-color-picker`, Reanimated             |
| Fontes                  | Plus Jakarta Sans, Inter, Shantell Sans (Google Fonts via Expo)                      |
| Qualidade               | ESLint (`eslint-config-expo`), Prettier, Jest + Testing Library, Husky + lint-staged |
| CI                      | GitHub Actions: lint, typecheck e testes automáticos                                 |

## Organização do projeto

```text
.
├── app.json                 # Configuração Expo (nome, ícones, splash, permissões)
├── assets/images/           # Logo, ícones, imagens do quiz e de fundo
├── docs/                    # Documentação (esta pasta em docs/mobile)
└── src/
    ├── app/                 # Rotas (Expo Router)
    │   ├── _layout.tsx      # Root Stack + providers + rotas protegidas
    │   ├── index.tsx        # Redirecionamento inicial
    │   ├── (tabs)/          # Abas: Storefront (Vitrine), Closet, Looks
    │   └── (screens)/       # Telas empilhadas e modais (uma pasta por tela)
    ├── components/          # Componentes reutilizáveis (index.tsx + styles.ts)
    ├── constants/           # Tema (cores, fontes, espaçamentos) e passos do onboarding
    ├── contexts/            # AuthContext, WishlistContext, UserStyleContext, OnboardingContext
    ├── hooks/               # Lógica de tela (Use<Nome>.ts): formulários, carregamento, paginação
    ├── mocks/               # Dados mockados (estilos usados em MyStyle/StyleSelection)
    ├── schemas/             # Schemas Zod de formulários e respostas da API
    ├── services/            # Cliente HTTP e funções por domínio (auth, products, wardrobe...)
    ├── types/               # Tipos de domínio (Look, Product, Filter, Onboarding...)
    └── utils/               # Funções puras (formatação, storage, ordenação, reducers)
```

**Convenções observadas no código**

- Cada tela fica em `src/app/(screens)/<Tela>/index.tsx`; cada componente em `src/components/<Componente>/index.tsx` com estilos em `styles.ts`.
- A lógica de estado e de chamadas fica em hooks `src/hooks/Use<Algo>.ts`; as telas apenas compõem UI.
- Toda resposta da API é validada com Zod (`parseResponse`) antes de chegar à UI.
- Testes ficam em `__tests__/` ao lado do código testado.

## Instalação e execução local

### Pré-requisitos

- **Node.js 22** ou superior e npm (o projeto também foi validado com Node 24).
- Para rodar no celular: app **Expo Go** ou um _development build_. Para emulador: Android Studio (Android) ou Xcode (iOS, apenas macOS).
- **Backend da Piê** em execução e acessível pelo dispositivo (ver [Backend](#backend)).

### Passo a passo

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a URL da API. Sem configuração, o app usa `http://localhost:8080`. Crie um arquivo `.env` na raiz:

   ```bash
   EXPO_PUBLIC_API_URL=http://<ip-da-sua-maquina>:8080
   ```

   > Em celular físico ou emulador Android, `localhost` aponta para o próprio dispositivo. Use o IP da máquina na rede local (ou `10.0.2.2` no emulador Android).

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   Atalhos: `npm run android`, `npm run ios`, `npm run web`.

4. No terminal, escaneie o QR code com o app **Expo Go** (Android) ou com a câmera (iOS), ou pressione `a` / `i` para abrir no emulador. Sem sessão salva, o app abre na tela de **Login**.

> Celular e computador precisam estar na mesma rede. A versão web (`npm run web`) serve para conferências rápidas; o alvo do app é Android e iOS.

### Backend

O app depende da API da Piê (Java 21 + Spring Boot + PostgreSQL), que roda localmente com Docker Compose e responde em `http://localhost:8080/api` (Swagger em `/api/swagger-ui/index.html`). Além do banco, o backend precisa de serviços externos configurados no `.env` dele:

| Serviço          | Para quê                                   | Impacto no app se não estiver configurado                        |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| Supabase Auth    | Login, cadastro e validação de sessão      | Nenhuma tela autenticada funciona                                |
| Supabase Storage | Fotos de produtos, peças do closet e looks | Falham o cadastro de peças com foto e a foto do look             |
| AWS Bedrock (IA) | Colorimetria e análise da foto da peça     | Colorimetria e preenchimento automático de Adicionar peça falham |

As instruções completas estão no README do repositório do backend.

### Scripts úteis

| Script                 | O que faz                           |
| ---------------------- | ----------------------------------- |
| `npm start`            | Inicia o Metro/Expo                 |
| `npm test`             | Roda os testes Jest (`--runInBand`) |
| `npm run lint`         | ESLint via `expo lint`              |
| `npm run typecheck`    | `tsc --noEmit`                      |
| `npm run format:check` | Verifica formatação Prettier        |

> O `typecheck` depende de `expo-env.d.ts`, gerado ao rodar `npm start` pela primeira vez (a CI cria esse arquivo manualmente).

### Forçar estados para testes visuais

A Vitrine aceita o parâmetro `status` na URL para forçar estados sem depender da API: `/Storefront?status=loading`, `?status=empty` ou `?status=error` (ver [`UseStorefrontCatalog.ts`](../../src/hooks/UseStorefrontCatalog.ts)). Útil para capturar mockups dos estados.
