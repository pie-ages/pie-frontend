import type { OnboardingStep } from '@/types/Onboarding';

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  {
    id: 'storefront',
    title: 'Vitrine de Peças',
    description:
      'Peças selecionadas especificamente de acordo com o seu perfil de estilo e colorimetria.',
    nextLabel: 'Próximo →',
    highlight: { type: 'tab', index: 0 },
    placement: 'bottom',
  },
  {
    id: 'closet',
    title: 'Seu Closet Digital',
    description: 'Cadastre e organize as roupas que você já possui no seu guarda-roupa físico.',
    nextLabel: 'Próximo →',
    highlight: { type: 'tab', index: 1 },
    placement: 'bottom',
  },
  {
    id: 'looks',
    title: 'Montador de Looks',
    description:
      'Combine peças novas da vitrine com roupas do seu closet para criar composições incríveis!',
    nextLabel: 'Próximo →',
    highlight: { type: 'tab', index: 2 },
    placement: 'bottom',
  },
  {
    id: 'filters',
    title: 'Filtros por Estilo',
    description: 'Navegue rapidamente entre os estilos: Romântico, Criativo, Casual e Clássico.',
    nextLabel: 'Próximo →',
    highlight: { type: 'filters' },
    placement: 'top',
  },
  {
    id: 'profile',
    title: 'Seu Perfil e Estilo',
    description:
      'Acesse o teste de estilo, refaça o quiz ou consulte sua cartela de colorimetria salva.',
    nextLabel: 'Próximo →',
    highlight: { type: 'profile' },
    placement: 'top',
  },
  {
    id: 'wishlist',
    title: 'Seus Desejos & Wishlist',
    description:
      'Acesse suas peças e listas salvas no ícone de prancheta no topo direito a qualquer momento.',
    nextLabel: 'Começar →',
    highlight: { type: 'wishlist' },
    placement: 'top',
  },
];
