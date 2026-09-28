import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserStyleProvider } from '@/hooks/UseUserStyle';
import { WishlistProvider } from '@/hooks/UseWishlist';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <UserStyleProvider>
          <StatusBar style="dark" />

          <AnimatedSplashOverlay />

          <RootNavigator />
        </UserStyleProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isInitializing, pendingStyleQuiz } = useAuth();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    if (isAuthenticated && pendingStyleQuiz) {
      router.replace('/screens/StyleQuiz');
    }
  }, [isAuthenticated, pendingStyleQuiz]);

  if (isInitializing || !fontsLoaded) return null;

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
        <Stack.Screen name="screens/MyStyle" />
        <Stack.Screen name="screens/StyleQuiz" />
        <Stack.Screen name="screens/StyleSelection" />
        <Stack.Screen name="screens/CreateLook" />
      </Stack.Protected>

      <Stack.Screen name="screens/ProductDetails" options={{ presentation: 'modal' }} />
      <Stack.Screen name="screens/Wishlist" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
