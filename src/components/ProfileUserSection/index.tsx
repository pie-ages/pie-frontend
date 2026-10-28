import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

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
  onEdit?: () => void;
};

export function ProfileUserSection({ status, user, onRetry, onEdit }: ProfileUserSectionProps) {
  if (status === ProfileStatus.Success && user) {
    return (
      <ProfileSectionCard style={styles.card}>
        <View style={styles.row}>
          <ProfileAvatar name={user.name} photoUrl={user.photoUrl} />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
          </View>

          {onEdit ? (
            <Pressable
              onPress={onEdit}
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
              style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
            >
              <Feather name="edit-2" size={18} color={Colors.brand.primary} />
            </Pressable>
          ) : null}
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
