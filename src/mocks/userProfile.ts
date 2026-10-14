import type { ColorimetryPreferences } from '@/schemas/colorimetrySchema';
import type { UserProfile } from '@/types/UserProfile';

const MOCK_USER_PROFILE: UserProfile = {
  name: 'Anna',
  email: 'anna@pie.com.br',
  avatarUrl: null,
};

export const MOCK_PROFILE_PREFERENCES: ColorimetryPreferences = {
  highlightColors: ['#B18A69', '#790D16', '#D6B69F', '#644A35'],
  avoidColors: [],
  favoriteColors: ['#F4434B', '#6652E8', '#3DBB65', '#F99A32'],
};

export const MOCK_FAVORITE_STYLE_LABELS = ['Dramatico', 'Casual', 'Dramático'];

export function fetchUserProfile(): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USER_PROFILE), 300);
  });
}
