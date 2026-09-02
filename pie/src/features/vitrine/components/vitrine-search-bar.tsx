import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const PLACEHOLDER_COLOR = '#8C8C8C';
const ICON_COLOR = '#6B6B6B';

export function VitrineSearchBar() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={ICON_COLOR} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Procure por produtos ou lojas"
        placeholderTextColor={PLACEHOLDER_COLOR}
        returnKeyType="search"
        autoCorrect={false}
      />

      <Feather name="mic" size={18} color={ICON_COLOR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F3',
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1F1F1F',
  },
});
