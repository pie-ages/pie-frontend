import { version } from 'expo/package.json';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { styles } from './styles';

export function WebBadge() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      <Image source={require('@/assets/images/expo-badge.png')} style={styles.badgeImage} />
    </ThemedView>
  );
}
