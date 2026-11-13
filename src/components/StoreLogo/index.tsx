import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';

import { BrandColors } from '@/constants/Theme';
import { getInitials } from '@/utils/get-initials';

import { styles } from './styles';

type StoreLogoProps = {
  companyName?: string | null;
  logoUrl?: string | null;
  style?: StyleProp<ViewStyle>;
};

export function StoreLogo({ companyName, logoUrl, style }: StoreLogoProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const name = companyName?.trim() ?? '';
  const url = logoUrl?.trim();
  const label = name ? `Logo da loja ${name}` : 'Logo da loja';
  const showImage = !!url && failedUrl !== url;
  const initials = getInitials(name);

  return (
    <View
      style={[styles.container, !showImage && styles.fallback, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      {showImage ? (
        <Image
          source={{ uri: url }}
          style={styles.image}
          contentFit="cover"
          transition={150}
          testID="store-logo-image"
          onError={() => setFailedUrl(url)}
        />
      ) : initials ? (
        <Text style={styles.initials} numberOfLines={1} allowFontScaling={false}>
          {initials}
        </Text>
      ) : (
        <Feather name="shopping-bag" size={14} color={BrandColors.primary} />
      )}
    </View>
  );
}
