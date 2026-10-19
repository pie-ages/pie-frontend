import { ActivityIndicator, Text, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { ProfileSectionCard } from '@/components/ProfileSectionCard';
import { Colors } from '@/constants/Theme';
import type { CurrentUser } from '@/schemas/userSchema';
import { ProfileStatus } from '@/types/Profile';

import { styles } from './styles';

type ProfileUserSectionProps = {
  status: ProfileStatus;
  user: CurrentUser | null;
  onRetry: () => void;
};

export function ProfileUserSection({ status, user, onRetry }: ProfileUserSectionProps) {
  if (status === ProfileStatus.Success && user) {
    return (
      <ProfileSectionCard style={styles.card}>
        <View style={styles.row}>
          <ProfileAvatar name={user.name} photoUrl={user.photoUrl} />
          <View style={styles.info}>
            <Text style={styles.text} numberOfLines={1}>
              <Text style={styles.label}>Nome: </Text>
              {user.name}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              <Text style={styles.label}>Email: </Text>
              {user.email}
            </Text>
          </View>
        </View>
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard style={styles.card}>
      {status === ProfileStatus.Error ? (
        <ErrorState
          title="Não foi possível carregar seus dados"
          subtitle="Verifique sua conexão e tente novamente."
          onRetry={onRetry}
        />
      ) : (
        <ActivityIndicator color={Colors.brand.accent} />
      )}
    </ProfileSectionCard>
  );
}
