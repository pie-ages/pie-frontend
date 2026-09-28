import { Feather, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

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
          <View style={[styles.iconButton, styles.profileButton]}>
            <Feather name="user" size={20} color={Colors.light.text} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
