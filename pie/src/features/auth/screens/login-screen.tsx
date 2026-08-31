import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/features/auth/components/auth-button';
import { AuthInput } from '@/features/auth/components/auth-input';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';

export function LoginScreen() {
  const {
    email,
    password,
    isPasswordVisible,
    isLoading,
    error,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
  } = useLoginForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.brand}>Piê</Text>

              <Image
                source={require('@/assets/images/pie-logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <View style={styles.bottomContent}>
              <View style={styles.form}>
                <AuthInput
                  label="Email"
                  placeholder="teste@pie.com.br"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />

                <AuthInput
                  label="Senha"
                  placeholder="**********"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  rightElement={
                    <Pressable
                      onPress={togglePasswordVisibility}
                      style={styles.passwordVisibilityButton}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                      }
                    >
                      <SymbolView
                        name={{
                          ios: isPasswordVisible ? 'eye.slash' : 'eye',
                          android: isPasswordVisible
                            ? 'visibility_off'
                            : 'visibility',
                          web: isPasswordVisible
                            ? 'visibility_off'
                            : 'visibility',
                        }}
                        size={22}
                        tintColor="#777777"
                      />
                    </Pressable>
                  }
                />

                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <View style={styles.actions}>
                <AuthButton
                  title="Login"
                  onPress={handleLogin}
                  isLoading={isLoading}
                />

                {/* Navegação para /register será habilitada após integração da tela de cadastro. */}
                <AuthButton
                  title="Criar Conta"
                  variant="secondary"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },

  header: {
    alignItems: 'center',
  },

  brand: {
    fontSize: 25,
    fontWeight: '500',
    color: '#1F1F1F',
    marginBottom: 20,
  },

  logo: {
    width: '55%',
    maxWidth: 210,
    aspectRatio: 1,
  },

  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 24,
  },

  form: {
    gap: 14,
  },

  passwordVisibilityButton: {
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#B3261E',
  },

  actions: {
    marginTop: 32,
    gap: 12,
  },
});