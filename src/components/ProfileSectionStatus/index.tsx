import { View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ProfileEmptyState } from '@/components/ProfileEmptyState';
import type { ProfileStatus } from '@/types/Profile';

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
  if (status === 'empty') {
    return <ProfileEmptyState title={emptyTitle} />;
  }

  return (
    <View style={styles.container}>
      {status === 'loading' && <LoadingState />}
      {status === 'error' && (
        <ErrorState
          title={errorTitle}
          subtitle="Verifique sua conexão e tente novamente."
          onRetry={onRetry}
        />
      )}
    </View>
  );
}
