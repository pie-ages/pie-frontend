import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddPiece/index" options={{ presentation: 'modal' }} />
      <Stack.Screen name="ProductDetails/index" options={{ presentation: 'modal' }} />
      <Stack.Screen name="Wishlist/index" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
