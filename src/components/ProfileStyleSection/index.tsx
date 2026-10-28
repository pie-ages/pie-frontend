import { Text, View } from 'react-native';

import { ProfileSectionCard, type ProfileSectionAction } from '@/components/ProfileSectionCard';
import { ProfileSectionStatus } from '@/components/ProfileSectionStatus';
import { ThemedText } from '@/components/ThemedText';
import { IDENTIFIED_STYLE_INFO, type IdentifiedStyle } from '@/types/IdentifiedStyle';
import { ProfileStatus } from '@/types/Profile';

import { styles } from './styles';

type ProfileStyleSectionProps = {
  status: ProfileStatus;
  favoriteStyles: IdentifiedStyle[];
  action?: ProfileSectionAction;
  onRetry: () => void;
};

export function ProfileStyleSection({
  status,
  favoriteStyles,
  action,
  onRetry,
}: ProfileStyleSectionProps) {
  if (status !== ProfileStatus.Success) {
    return (
      <ProfileSectionCard title="Estilo" action={action}>
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
    <ProfileSectionCard title="Estilo" action={action}>
      <View style={styles.list}>
        {favoriteStyles.map((style) => (
          <View key={style} style={styles.pill}>
            <Text style={styles.item}>{IDENTIFIED_STYLE_INFO[style].label}</Text>
          </View>
        ))}
      </View>
      <ThemedText type="small" style={styles.caption}>
        Baseado nas escolhas do seu quiz.
      </ThemedText>
    </ProfileSectionCard>
  );
}
