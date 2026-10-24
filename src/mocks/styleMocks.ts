export type StyleType =
  | 'classic'
  | 'casual'
  | 'creative'
  | 'romantic'
  | 'refined'
  | 'sexy'
  | 'dramatic'
  | 'minimalist'
  | 'boho';

export interface StyleOption {
  id: StyleType;
  label: string;
  bgImageUrl: string;
}

export const availableStyles: StyleOption[] = [
  {
    id: 'classic',
    label: 'Clássico',
    bgImageUrl: 'https://images.pexels.com/photos/32639448/pexels-photo-32639448.jpeg',
  },
  {
    id: 'casual',
    label: 'Casual',
    bgImageUrl: '/',
  },
  {
    id: 'creative',
    label: 'Criativo',
    bgImageUrl: 'https://images.pexels.com/photos/23602561/pexels-photo-23602561.jpeg',
  },
  {
    id: 'romantic',
    label: 'Romântico',
    bgImageUrl: 'https://images.pexels.com/photos/16846962/pexels-photo-16846962.jpeg',
  },
  {
    id: 'refined',
    label: 'Refinado',
    bgImageUrl: '/',
  },
  {
    id: 'sexy',
    label: 'Sensual',
    bgImageUrl: 'https://images.pexels.com/photos/14722448/pexels-photo-14722448.jpeg',
  },
  {
    id: 'dramatic',
    label: 'Dramático',
    bgImageUrl: '/',
  },
  {
    id: 'minimalist',
    label: 'Minimalista',
    bgImageUrl: 'https://images.pexels.com/photos/18356481/pexels-photo-18356481.jpeg',
  },
  {
    id: 'boho',
    label: 'Boho',
    bgImageUrl: '/',
  },
];

// Simulando a resposta do backend com o estilo previamente identificado
export const mockUserIdentifiedStyles: StyleType[] = ['classic', 'romantic', 'creative'];
