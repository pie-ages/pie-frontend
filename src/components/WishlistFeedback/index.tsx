import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useWishlist } from '@/contexts/WishlistContext';

export function WishlistFeedback() {
  const { error, retry } = useWishlist();
  if (!error) return null;

  return (
    <View style={styles.container}>
      <ThemedText type="small" accessibilityRole="alert">
        {error}
      </ThemedText>
      <Pressable
        onPress={retry}
        accessibilityRole="button"
        accessibilityLabel="Recarregar Wishlist"
      >
        <ThemedText type="linkPrimary">Tentar novamente</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.two,
    backgroundColor: Colors.brand.tertiary,
  },
});
