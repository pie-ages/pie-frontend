# Padrões visuais e componentes reutilizáveis

Fonte da verdade: [`src/constants/Theme.ts`](../../src/constants/Theme.ts). Use esses tokens em vez de valores fixos para manter a consistência visual.

## Cores

### Marca

| Token                    | Valor     | Uso típico                                         |
| ------------------------ | --------- | -------------------------------------------------- |
| `Colors.brand.primary`   | `#661414` | Botões primários, ícones de ação, links, destaques |
| `Colors.brand.secondary` | `#CBA790` | Apoio                                              |
| `Colors.brand.tertiary`  | `#FDE2D9` | Fundos suaves, destaque sobre fundos escuros       |
| `Colors.brand.accent`    | `#6E263D` | Acento                                             |

### Neutras e de estado

| Token                             | Valor                 | Uso                               |
| --------------------------------- | --------------------- | --------------------------------- |
| `Colors.light.text`               | `#1F1F1F`             | Texto principal                   |
| `Colors.light.textSecondary`      | `#60646C`             | Texto de apoio, descrições        |
| `Colors.light.background`         | `#FFFFFF`             | Fundo das telas                   |
| `Colors.light.backgroundElement`  | `#F0F0F3`             | Cartões, campos                   |
| `Colors.light.backgroundSelected` | `#E0E1E6`             | Item selecionado                  |
| `Colors.border`                   | `#D8D8D8`             | Bordas                            |
| `Colors.placeholder`              | `#B3B3B3`             | Placeholder de campos             |
| `Colors.icon` / `iconMuted`       | `#777777` / `#B0B4BA` | Ícones / ícones de estados vazios |
| `Colors.error`                    | `#FF383C`             | Mensagens de erro                 |
| `BrandColors.disabled`            | `#787880`             | Botões desabilitados              |

O app usa **tema claro**: a status bar é escura, exceto em telas com imagem de fundo (MyStyle, StyleSelection), que a trocam para clara.

## Tipografia

| Família           | Token                                         | Uso                                                          |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------ |
| Plus Jakarta Sans | `FontFamilies.jakartaRegular` / `jakartaBold` | Títulos e textos de marca                                    |
| Inter             | `FontFamilies.interRegular` / `interBold`     | Texto de interface no Android/web                            |
| Fonte do sistema  | `SystemFonts.regular` / `bold`                | No iOS usa a fonte do sistema; nas demais plataformas, Inter |

`ThemedText` oferece variantes: `default`, `title`, `subtitle`, `small`, `smallBold`, `link`, `linkPrimary`, `code`, e aceita `themeColor` (`text`, `textSecondary`, …).

## Espaçamento e layout

| Token           | Valor | Token               | Valor                     |
| --------------- | ----- | ------------------- | ------------------------- |
| `Spacing.half`  | 2     | `Spacing.four`      | 24                        |
| `Spacing.one`   | 4     | `Spacing.five`      | 32                        |
| `Spacing.two`   | 8     | `Spacing.six`       | 64                        |
| `Spacing.three` | 16    | `Spacing.fortyFour` | 44 (alvo de toque mínimo) |

- `BottomTabInset` (80 no celular, 90 na web): espaço inferior que listas dentro das abas devem reservar para a barra de abas.
- `MaxContentWidth` = 800: largura máxima do conteúdo; o Login limita a 430.
- `useLayoutScale` escala medidas proporcionalmente à tela (usado no Quiz).
- Telas respeitam a _safe area_ (`SafeAreaView` / `useSafeAreaInsets`) e usam `KeyboardAvoidingView` em formulários.

## Componentes reutilizáveis

### Botões e formulários

| Componente                 | Variantes / props-chave                                               | Onde aparece                                           |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| `AuthButton`               | `primary` (vinho, texto branco) · `secondary` (contorno); `isLoading` | Autenticação, Adicionar peça, Criar Look, Colorimetria |
| `ProductActionButton`      | `primary` · `outline` · `done`; `iconName` (Feather); `isLoading`     | Detalhes do produto, Perfil, edições, Quiz             |
| `SectionActionButton`      | Ação compacta com ícone no título de seção                            | Perfil                                                 |
| `AuthInput`                | `label`, `error` + props de `TextInput`                               | Autenticação                                           |
| `AuthPasswordInput`        | `isVisible`, `onToggleVisibility`                                     | Login, Cadastro, Nova senha                            |
| `FormInput` / `FormSelect` | Campo de texto / seletor que abre lista de opções                     | Adicionar peça                                         |
| `ImagePickerArea`          | Área para escolher/trocar foto                                        | Adicionar peça                                         |
| `ColorPickerModal`         | Seletor de cor (reanimated-color-picker)                              | Colorimetria, Editar cores                             |

### Estrutura e navegação

| Componente                                | Descrição                                                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `ScreenToolBar`                           | Cabeçalho padrão: título + ações (ícones Feather/Ionicons/MaterialCommunity) + botão Perfil (`showProfile`). Suporta alvo de onboarding |
| `BottomTabBar` / `TabBarButton`           | Barra de abas customizada com blur                                                                                                      |
| `ProductHeader`                           | Cabeçalho de modal com fechar, título e coração                                                                                         |
| `OnboardingOverlay` / `OnboardingTooltip` | Tour guiado com spotlight                                                                                                               |

### Estados

`LoadingState`, `ErrorState`, `EmptyState`, `ProfileSectionStatus`, `ProfileEmptyState`, `StorefrontNotice` — ver [Estados da interface](estados.md).

### Domínio

| Grupo        | Componentes                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitrine      | `StorefrontSearchBar`, `StorefrontFilterChips`, `StorefrontFilterSheet`, `StorefrontProductGrid`, `StorefrontProductCard`, `ProductImageCarousel`, `ProductSizeSelector`                      |
| Closet       | `CategoryRow`, `ClothingCard`, `WardrobePickerModal`                                                                                                                                          |
| Looks        | `LooksViewModeToggle`, `LookFocusCarousel`, `LookFlipCard`, `LookPiecesStack`, `LookFocusInfo`, `LookFocusPagination`, `LooksGrid`, `LookCard`, `LookImage`, `LookPieceCard`, `SaveLookSheet` |
| Estilo       | `StyleQuizOptionCard`, `StyleQuizFooter`, `StyleQuizChoicePreview`, `StyleOptionGrid`, `StyleOptionCard`                                                                                      |
| Colorimetria | `ColorimetryColorRow`, `ColorSwatch`, `ColorimetryConsentModal`                                                                                                                               |
| Perfil       | `ProfileAvatar`, `ProfileUserSection`, `ProfileColorSection`, `ProfileStyleSection`, `ProfileSectionCard`                                                                                     |
| Base         | `ThemedText`, `ThemedView`, `AnimatedIcon` (splash animada)                                                                                                                                   |

**Sem uso atual nas telas** (herdados do template ou substituídos): `StorefrontToolBar`, `Collapsible`, `ExternalLink`, `WebBadge`, `HintRow`. Avalie antes de reutilizar.

## Boas práticas observadas

- Texto de interface em português; mensagens de erro dizem o que fazer ("Tente novamente", "Verifique sua conexão").
- Botões de ícone têm `accessibilityLabel`; mensagens de erro usam `accessibilityRole="alert"` e progresso usa `accessibilityLiveRegion="polite"`.
- Ações destrutivas pedem confirmação (`utils/confirm.ts`).
- Preços formatados em BRL (`utils/format-price.ts`); cores formatadas por `utils/format-color.ts`.
