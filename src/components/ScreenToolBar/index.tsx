import { Feather, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProfileSheet } from '@/components/ProfileSheet';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';

import { styles } from './styles';

type IconSet = 'feather' | 'ionicons' | 'material-community';

export type ToolBarAction = {
  icon: string;
  iconSet?: IconSet;
  onPress?: () => void;
  accessibilityLabel: string;
};

type ScreenToolBarProps = {
  title: string;
  actions?: ToolBarAction[];
  showProfile?: boolean;
};

function ActionIcon({ set, name }: { set: IconSet; name: string }) {
  const color = Colors.light.text;
  const size = 20;

  if (set === 'ionicons') {
    return <Ionicons name={name as never} size={size} color={color} />;
  }
  if (set === 'material-community') {
    return <MaterialCommunityIcons name={name as never} size={size} color={color} />;
  }
  return <Feather name={name as never} size={size} color={color} />;
}

export function ScreenToolBar({ title, actions = [], showProfile = true }: ScreenToolBarProps) {
  const { signOut } = useAuth();
  const [isProfileSheetVisible, setProfileSheetVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable
            key={action.accessibilityLabel}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <ActionIcon set={action.iconSet ?? 'feather'} name={action.icon} />
          </Pressable>
        ))}

        {showProfile ? (
          <Pressable
            onPress={() => setProfileSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Perfil"
            style={({ pressed }) => [
              styles.iconButton,
              styles.profileButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Feather name="user" size={20} color={Colors.light.text} />
          </Pressable>
        ) : null}
      </View>

      {showProfile ? (
        <ProfileSheet
          visible={isProfileSheetVisible}
          onClose={() => setProfileSheetVisible(false)}
          onSignOut={() => {
            setProfileSheetVisible(false);
            signOut();
          }}
        />
      ) : null}
    </View>
  );
}
