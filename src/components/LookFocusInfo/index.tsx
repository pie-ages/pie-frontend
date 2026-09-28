import { Text, View } from 'react-native';

import type { Look } from '@/types/look';

import { styles } from './styles';

type LookFocusInfoProps = {
  look: Look;
};

export function LookFocusInfo({ look }: LookFocusInfoProps) {
  const subtitle = [look.style, look.occasion].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>
        {look.name}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
