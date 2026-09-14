import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/hooks/UseWishlist';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <StatusBar style="dark" />

        <AnimatedSplashOverlay />

        <RootNavigator />
      </WishlistProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="screens/Login" />
        <Stack.Screen name="screens/Register" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/Storefront" />
        <Stack.Screen name="screens/Closet" />
        <Stack.Screen name="screens/Looks" />
      </Stack.Protected>

      <Stack.Screen name="screens/ProductDetails" options={{ presentation: 'modal' }} />
      <Stack.Screen name="screens/Wishlist" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
