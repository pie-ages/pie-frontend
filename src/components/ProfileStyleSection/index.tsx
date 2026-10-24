import { Text, View } from 'react-native';

import { ProfileSectionCard } from '@/components/ProfileSectionCard';
import { ProfileSectionStatus } from '@/components/ProfileSectionStatus';
import { ThemedText } from '@/components/ThemedText';
import { IDENTIFIED_STYLE_INFO, type IdentifiedStyle } from '@/types/IdentifiedStyle';
import { ProfileStatus } from '@/types/Profile';

import { styles } from './styles';

type ProfileStyleSectionProps = {
  status: ProfileStatus;
  favoriteStyles: IdentifiedStyle[];
  onRetry: () => void;
};

export function ProfileStyleSection({ status, favoriteStyles, onRetry }: ProfileStyleSectionProps) {
  if (status !== ProfileStatus.Success) {
    return (
      <ProfileSectionCard title="Estilo">
        <ProfileSectionStatus
          status={status}
          errorTitle="Não foi possível carregar seus estilos"
          emptyTitle="Faça o quiz de estilo para descobrir seus estilos."
          onRetry={onRetry}
        />
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Estilo">
      <View style={styles.list}>
        {favoriteStyles.map((style) => (
          <Text key={style} style={styles.item}>
            {IDENTIFIED_STYLE_INFO[style].label}
          </Text>
        ))}
      </View>
      <ThemedText type="small" style={styles.caption}>
        Baseado nas respostas do seu quiz
      </ThemedText>
    </ProfileSectionCard>
  );
}
