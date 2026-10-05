import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProfileSheet } from '@/components/ProfileSheet';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';

import { styles } from './styles';

export function StorefrontToolBar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isProfileSheetVisible, setProfileSheetVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/Wishlist')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={18}
            color={Colors.light.text}
          />
        </Pressable>

        <Pressable
          onPress={() => setProfileSheetVisible(true)}
          style={({ pressed }) => [
            styles.iconButton,
            styles.profileButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <Feather name="user" size={18} color={Colors.light.text} />
        </Pressable>
      </View>

      <ProfileSheet
        visible={isProfileSheetVisible}
        onClose={() => setProfileSheetVisible(false)}
        onSignOut={() => {
          setProfileSheetVisible(false);
          signOut();
        }}
      />
    </View>
  );
}
