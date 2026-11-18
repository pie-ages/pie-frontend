import { ActivityIndicator, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { ProfileEmptyState } from '@/components/ProfileEmptyState';
import { Colors } from '@/constants/Theme';
import { ProfileStatus } from '@/types/Profile';

import { styles } from './styles';

type ProfileSectionStatusProps = {
  status: ProfileStatus;
  errorTitle: string;
  emptyTitle: string;
  onRetry: () => void;
};

export function ProfileSectionStatus({
  status,
  errorTitle,
  emptyTitle,
  onRetry,
}: ProfileSectionStatusProps) {
  if (status === ProfileStatus.Empty) {
    return <ProfileEmptyState title={emptyTitle} />;
  }

  return (
    <View style={styles.container}>
      {status === ProfileStatus.Loading && <ActivityIndicator color={Colors.brand.primary} />}
      {status === ProfileStatus.Error && (
        <ErrorState
          title={errorTitle}
          subtitle="Verifique sua conexão e tente novamente."
          onRetry={onRetry}
        />
      )}
    </View>
  );
}
