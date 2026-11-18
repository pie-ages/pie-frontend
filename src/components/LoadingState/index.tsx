import { ActivityIndicator, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type LoadingStateProps = {
  text?: string;
  size?: 'small' | 'large';
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadingState({ text, size = 'large', compact = false, style }: LoadingStateProps) {
  return (
    <View style={[compact ? styles.compactContainer : styles.container, style]}>
      <ActivityIndicator size={size} color={Colors.brand.primary} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}
