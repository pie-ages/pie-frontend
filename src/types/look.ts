export type LookItem = {
  id: string;
  name?: string;
  imageUrl: string | null;
};

export type Look = {
  id: string;
  name: string;
  imageUrl: string | null;
  style?: string;
  occasion?: string;
  items: LookItem[];
};

export type LooksViewMode = 'grid' | 'focus';
