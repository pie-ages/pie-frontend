import type { LookPiece } from '@/types/Look';

// precisa pegar os arquivos no figma.
export const MOCK_CLOSET_PIECES: LookPiece[] = [
  { id: 'top-1', name: 'Camisa pêssego', category: 'Parte de cima', color: '#CBA790' },
  { id: 'top-2', name: 'Camiseta branca', category: 'Parte de cima', color: '#909090' },
  { id: 'bottom-1', name: 'Calça preta', category: 'Parte de baixo', color: '#333333' },
  { id: 'bottom-2', name: 'Calça jeans', category: 'Parte de baixo', color: '#57758C' },
  { id: 'shoes-1', name: 'Tênis branco', category: 'Calçados', color: '#909090' },
  { id: 'shoes-2', name: 'Sapato nude', category: 'Calçados', color: '#AA8060' },
];

export const MOCK_LOOK_SUGGESTIONS = [
  [MOCK_CLOSET_PIECES[0], MOCK_CLOSET_PIECES[2], MOCK_CLOSET_PIECES[4]],
  [MOCK_CLOSET_PIECES[1], MOCK_CLOSET_PIECES[3], MOCK_CLOSET_PIECES[5]],
];
