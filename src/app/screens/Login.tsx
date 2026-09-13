import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { AuthInput } from '@/components/AuthInput';
import { AuthPasswordInput } from '@/components/AuthPasswordInput';
import { Colors } from '@/constants/Theme';
import { useLoginForm } from '@/hooks/UseLoginForm';

export default function LoginScreen() {
  const router = useRouter();

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

  function handleCreateAccount() {
    router.push('/screens/Register');
  }

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
                  label="E-mail"
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

                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <View style={styles.actions}>
                <AuthButton title="Login" onPress={handleLogin} isLoading={isLoading} />

                <AuthButton title="Criar Conta" variant="secondary" onPress={handleCreateAccount} />
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
    backgroundColor: Colors.white,
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
    paddingTop: 32,
    paddingBottom: 20,
  },

  header: {
    alignItems: 'center',
  },

  brand: {
    fontSize: 25,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 20,
  },

  logo: {
    width: '71%',
    maxWidth: 280,
    aspectRatio: 1,
  },

  bottomContent: {
    marginTop: 24,
  },

  form: {
    gap: 14,
  },

  errorText: {
    fontSize: 14,
    color: Colors.error,
  },

  actions: {
    marginTop: 32,
    gap: 12,
  },
});
