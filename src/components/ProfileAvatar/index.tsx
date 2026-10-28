import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BrandColors } from '@/constants/Theme';
import { getInitials } from '@/utils/get-initials';

import { styles } from './styles';

type ProfileAvatarProps = {
  name: string;
  photoUrl?: string | null;
};

export function ProfileAvatar({ name, photoUrl }: ProfileAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = photoUrl?.trim();

  if (url && failedUrl !== url) {
    return (
      <Image
        source={{ uri: url }}
        style={styles.avatar}
        contentFit="cover"
        accessibilityLabel="Foto de perfil"
        onError={() => setFailedUrl(url)}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <View style={[styles.avatar, styles.fallback]} accessibilityLabel="Avatar padrão">
      {initials ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Feather name="user" size={28} color={BrandColors.primary} />
      )}
    </View>
  );
}
