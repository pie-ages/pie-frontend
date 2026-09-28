export interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CategoryRowData {
  id: string;
  title: string;
  items: ClothingItem[];
  hasNext: boolean;
}

export interface ClosetData {
  rows: CategoryRowData[];
}

export const mockClosetData: ClosetData = {
  rows: [
    {
      id: 't_shirt',
      title: 'Camisetas',
      items: [
        {
          id: '1',
          name: 'Camiseta lisa',
          imageUrl: 'https://images.pexels.com/photos/9558265/pexels-photo-9558265.jpeg',
        },
        {
          id: '2',
          name: 'Camiseta estampada',
          imageUrl: '/',
        },
        {
          id: '3',
          name: 'Camiseta gola V',
          imageUrl: '/',
        },
        {
          id: '4',
          name: 'Camiseta polo',
          imageUrl: '/',
        },
      ],
      hasNext: true,
    },
    {
      id: 'pants',
      title: 'Calças',
      items: [
        {
          id: '10',
          name: 'Calça preta',
          imageUrl: '/',
        },
        {
          id: '11',
          name: 'Calça alfaiataria',
          imageUrl: '/',
        },
        {
          id: '12',
          name: 'Calça Jeans',
          imageUrl: '/',
        },
        {
          id: '13',
          name: 'Calça cargo',
          imageUrl: '/',
        },
      ],
      hasNext: true,
    },
    {
      id: 'dress',
      title: 'Vestido',
      items: [
        {
          id: '20',
          name: 'Vestido Verde',
          imageUrl: '/',
        },
      ],
      hasNext: false,
    },
    {
      id: 'empty_category',
      title: 'Casacos',
      items: [],
      hasNext: false,
    },
  ],
};
