import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brand.accent} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}
