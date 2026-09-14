import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { WishlistProvider } from '@/hooks/UseWishlist';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <WishlistProvider>
      <StatusBar style="dark" />

      <AnimatedSplashOverlay />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="screens/ProductDetails" options={{ presentation: 'modal' }} />
        <Stack.Screen name="screens/Wishlist" options={{ presentation: 'modal' }} />
      </Stack>
    </WishlistProvider>
  );
}
