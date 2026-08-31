import { Image } from 'expo-image'
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/features/auth/components/auth-button';
import { AuthInput } from '@/features/auth/components/auth-input';
import { AuthPasswordInput } from '@/features/auth/components/auth-password-input';
import { useRegisterForm } from '@/features/auth/hooks/use-register-form';

export function RegisterScreen() {
  const router = useRouter();

  const {
    name,
    email,
    password,
    confirmPassword,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRegister,
  } = useRegisterForm();

  async function handleCreateAccount() {
    const success = await handleRegister();

    if (success) {
      router.replace('/login');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require('@/assets/images/background-register.png')}
        style={styles.backgroundLogo}
        contentFit="contain"
      />
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
            <Text style={styles.title}>Cadastro</Text>

            <View style={styles.form}>
              <AuthInput
                label="Nome"
                placeholder="Anna"
                autoCorrect={false}
                value={name}
                onChangeText={setName}
              />

              <AuthInput
                label="Email"
                placeholder="anna@pie.com.br"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              <AuthPasswordInput
                label="Senha"
                placeholder="**********"
                value={password}
                onChangeText={setPassword}
                isVisible={isPasswordVisible}
                onToggleVisibility={togglePasswordVisibility}
              />

              <AuthPasswordInput
                label="Confirmar Senha"
                placeholder="**********"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isVisible={isConfirmPasswordVisible}
                onToggleVisibility={toggleConfirmPasswordVisibility}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <View style={styles.actions}>
              <AuthButton
                title="Criar conta"
                onPress={handleCreateAccount}
                isLoading={isLoading}
              />
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

  backgroundLogo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.08,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F1F1F',
    marginBottom: 24,
  },

  form: {
    gap: 18,
  },

  errorText: {
    fontSize: 14,
    color: '#B3261E',
  },

  actions: {
    marginTop: 32,
  },
});
