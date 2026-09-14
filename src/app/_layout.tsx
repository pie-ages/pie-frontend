import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />

      <AnimatedSplashOverlay />

      <RootNavigator />
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
      {/* Fluxo de autenticação: Stack simples, sem Bottom Tab Bar */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="screens/Login" />
        <Stack.Screen name="screens/Register" />
      </Stack.Protected>

      {/* Fluxo principal: Bottom Tab Navigator, só acessível com sessão válida */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/Storefront" />
        <Stack.Screen name="screens/Closet" />
        <Stack.Screen name="screens/Looks" />
      </Stack.Protected>

      <Stack.Screen name="screens/ProductDetails" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
