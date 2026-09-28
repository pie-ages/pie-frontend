import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type ImageStyle } from 'react-native';

import { Colors } from '@/constants/Theme';

type LookImageProps = {
  uri: string | null;
  style: ImageStyle;
  accessibilityLabel?: string;
};

export function LookImage({ uri, style, accessibilityLabel }: LookImageProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);

  if (!uri || failedUri === uri) {
    return (
      <View
        style={[style, styles.placeholder]}
        accessibilityLabel={accessibilityLabel ?? 'Imagem indisponível'}
      >
        <Feather name="image" size={24} color={Colors.iconMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit="cover"
      accessibilityLabel={accessibilityLabel}
      onError={() => setFailedUri(uri)}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundElement,
  },
});
