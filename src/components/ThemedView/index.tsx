import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/Theme';
import { useTheme } from '@/hooks/UseTheme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
};

export function ThemedView({ style, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
