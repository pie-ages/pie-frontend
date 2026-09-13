import { Feather } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { styles } from './styles';

const PLACEHOLDER_COLOR = '#8C8C8C';
const ICON_COLOR = '#6B6B6B';

type StorefrontSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export function StorefrontSearchBar({ value, onChangeText, onClear }: StorefrontSearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={ICON_COLOR} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Procure por produtos ou lojas"
        placeholderTextColor={PLACEHOLDER_COLOR}
        returnKeyType="search"
        autoCorrect={false}
      />

      {value.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <Feather name="x" size={18} color={ICON_COLOR} />
        </Pressable>
      ) : (
        <Feather name="mic" size={18} color={ICON_COLOR} />
      )}
    </View>
  );
}
