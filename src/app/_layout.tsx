import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserStyleProvider } from '@/contexts/UserStyleContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const handleAppReady = useCallback(() => setAppReady(true), []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <UserStyleProvider>
          <StatusBar style="dark" />

          <AnimatedSplashOverlay ready={appReady} />

          <RootNavigator onReady={handleAppReady} />
        </UserStyleProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

function RootNavigator({ onReady }: { onReady: () => void }) {
  const { isAuthenticated, isInitializing, pendingStyleQuiz } = useAuth();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    if (isAuthenticated && pendingStyleQuiz) {
      router.replace('/StyleQuiz');
    }
  }, [isAuthenticated, pendingStyleQuiz]);

  useEffect(() => {
    if (!isInitializing && fontsLoaded) {
      onReady();
    }
  }, [fontsLoaded, isInitializing, onReady]);

  if (isInitializing || !fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(screens)/Login/index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(screens)/Register/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="(screens)/ForgotPassword/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="(screens)/ResetPassword/index"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(screens)/Profile/index" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="(screens)/EditProfile/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="(screens)/EditStyles/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="(screens)/EditFavoriteColors/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="(screens)/MyStyle/index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(screens)/StyleQuiz/index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(screens)/StyleSelection/index" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="(screens)/ColorimetryResult/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="(screens)/CreateLook/index"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="(screens)/AddPiece/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(screens)/ProductDetails/index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(screens)/Wishlist/index" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}
