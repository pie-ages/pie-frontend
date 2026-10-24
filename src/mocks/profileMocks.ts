export interface UserProfileMock {
  name: string;
  email: string;
  avatarUrl: string;
  colorimetry: {
    colors: string[];
    description: string;
  };
  favoriteColors: string[];
  styles: string[];
  stylesDescription: string;
}

export const mockUserProfile: UserProfileMock = {
  name: 'Anna',
  email: 'anna@pie.com.br',
  avatarUrl: 'https://images.pexels.com/photos/28262529/pexels-photo-28262529.jpeg',
  colorimetry: {
    colors: ['#B88661', '#721C1C', '#D3B6A6', '#593D2C'],
    description: 'Tons terrosos e quentes valorizam sua pele.',
  },
  favoriteColors: ['#FF3B30', '#5E5CE6', '#34C759', '#FF9500'],
  styles: ['Dramático', 'Casual', 'Romântico'],
  stylesDescription: 'Baseado nas respostas do seu quiz',
};
