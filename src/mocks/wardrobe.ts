import type { WardrobePiece } from '@/types/look';

export const MOCK_WARDROBE_PIECES: WardrobePiece[] = [
  {
    id: 'w1',
    name: 'Camisa listrada',
    category: 'Parte de cima',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80&auto=format',
  },
  {
    id: 'w2',
    name: 'Blusa de cetim rosé',
    category: 'Parte de cima',
    imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80&auto=format',
  },
  {
    id: 'w3',
    name: 'Casaco terracota',
    category: 'Parte de cima',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80&auto=format',
  },
  {
    id: 'w4',
    name: 'Calça jeans',
    category: 'Parte de baixo',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80&auto=format',
  },
  {
    id: 'w5',
    name: 'Calça pantalona preta',
    category: 'Parte de baixo',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80&auto=format',
  },
  {
    id: 'w6',
    name: 'Tênis branco',
    category: 'Calçados',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80&auto=format',
  },
  {
    id: 'w7',
    name: 'Sandália de salto',
    category: 'Calçados',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&auto=format',
  },
  {
    id: 'w8',
    name: 'Scarpin nude',
    category: 'Calçados',
    imageUrl: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80&auto=format',
  },
];

const byId = (id: string) => MOCK_WARDROBE_PIECES.find((piece) => piece.id === id)!;

export const MOCK_LOOK_SUGGESTIONS: WardrobePiece[][] = [
  [byId('w1'), byId('w4'), byId('w6')],
  [byId('w2'), byId('w5'), byId('w8')],
];
