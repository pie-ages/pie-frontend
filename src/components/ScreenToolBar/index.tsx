import { Feather, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProfileSheet } from '@/components/ProfileSheet';
import { Colors } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingTarget } from '@/hooks/UseOnboardingTarget';
import type { OnboardingTargetId } from '@/types/Onboarding';

import { styles } from './styles';

type IconSet = 'feather' | 'ionicons' | 'material-community';

export type ToolBarAction = {
  icon: string;
  iconSet?: IconSet;
  onPress?: () => void;
  accessibilityLabel: string;
  onboardingTargetId?: OnboardingTargetId;
};

type ScreenToolBarProps = {
  title: string;
  actions?: ToolBarAction[];
  showProfile?: boolean;
  profileOnboardingTargetId?: OnboardingTargetId;
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

type ToolBarIconButtonProps = {
  icon: string;
  iconSet: IconSet;
  isProfile?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
  onboardingTargetId?: OnboardingTargetId;
};

function ToolBarIconButton({
  icon,
  iconSet,
  isProfile = false,
  onPress,
  accessibilityLabel,
  onboardingTargetId,
}: ToolBarIconButtonProps) {
  const buttonStyle = [styles.iconButton, isProfile && styles.profileButton];
  const renderSpotlight = useCallback(
    () => (
      <View style={[styles.iconButton, isProfile && styles.profileButton]}>
        <ActionIcon set={iconSet} name={icon} />
      </View>
    ),
    [icon, iconSet, isProfile],
  );
  const { setTargetNode, onLayout } = useOnboardingTarget(onboardingTargetId, renderSpotlight);

  return (
    <Pressable
      ref={setTargetNode}
      onLayout={onLayout}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [buttonStyle, pressed && styles.iconButtonPressed]}
    >
      <ActionIcon set={iconSet} name={icon} />
    </Pressable>
  );
}

export function ScreenToolBar({
  title,
  actions = [],
  showProfile = true,
  profileOnboardingTargetId,
}: ScreenToolBarProps) {
  const { signOut } = useAuth();
  const [isProfileSheetVisible, setProfileSheetVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.actions}>
        {actions.map((action) => (
          <ToolBarIconButton
            key={action.accessibilityLabel}
            icon={action.icon}
            iconSet={action.iconSet ?? 'feather'}
            onPress={action.onPress}
            accessibilityLabel={action.accessibilityLabel}
            onboardingTargetId={action.onboardingTargetId}
          />
        ))}

        {showProfile ? (
          <ToolBarIconButton
            icon="user"
            iconSet="feather"
            isProfile
            onPress={() => setProfileSheetVisible(true)}
            accessibilityLabel="Perfil"
            onboardingTargetId={profileOnboardingTargetId}
          />
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
