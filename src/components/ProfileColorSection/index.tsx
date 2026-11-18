import { StyleSheet, View } from 'react-native';

import { ColorSwatch } from '@/components/ColorSwatch';
import { ProfileSectionCard, type ProfileSectionAction } from '@/components/ProfileSectionCard';
import { ProfileSectionStatus } from '@/components/ProfileSectionStatus';
import { ThemedText } from '@/components/ThemedText';
import { Spacing } from '@/constants/Theme';
import { ProfileStatus } from '@/types/Profile';

type ProfileColorSectionProps = {
  title: string;
  caption?: string;
  status: ProfileStatus;
  colors: string[];
  action?: ProfileSectionAction;
  errorTitle: string;
  emptyTitle: string;
  onRetry: () => void;
};

export function ProfileColorSection({
  title,
  caption,
  status,
  colors,
  action,
  errorTitle,
  emptyTitle,
  onRetry,
}: ProfileColorSectionProps) {
  if (status === ProfileStatus.Success && colors.length > 0) {
    return (
      <ProfileSectionCard title={title} action={action}>
        <View style={styles.swatches}>
          {colors.map((color, index) => (
            <ColorSwatch key={`${color}-${index}`} color={color} size={40} outlined />
          ))}
        </View>
        {caption && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
            {caption}
          </ThemedText>
        )}
      </ProfileSectionCard>
    );
  }

  const sectionStatus = status === ProfileStatus.Success ? ProfileStatus.Empty : status;

  return (
    <ProfileSectionCard title={title} action={action}>
      <ProfileSectionStatus
        status={sectionStatus}
        errorTitle={errorTitle}
        emptyTitle={emptyTitle}
        onRetry={onRetry}
      />
    </ProfileSectionCard>
  );
}

const styles = StyleSheet.create({
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two + Spacing.one,
  },
  caption: {
    lineHeight: 20,
  },
});
