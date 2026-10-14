import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { AuthInput } from '@/components/AuthInput';
import { Colors } from '@/constants/Theme';
import { useForgotPasswordForm } from '@/hooks/UseForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { control, emailError, isLoading, error, sentTo, handleRecovery } = useForgotPasswordForm();

  function handleBackToLogin() {
    router.replace('/Login');
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
            <View>
              <Text style={styles.title}>Recuperar acesso</Text>

              <Text style={styles.description}>
                Informe o e-mail da sua conta e enviaremos as instruções para redefinir sua senha.
              </Text>

              <View style={styles.form}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthInput
                      label="E-mail"
                      placeholder="anna@pie.com.br"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      error={emailError}
                    />
                  )}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                {sentTo && (
                  <Text style={styles.successText}>Enviamos as instruções para {sentTo}.</Text>
                )}
              </View>
            </View>

            <View style={styles.actions}>
              <AuthButton
                title="Enviar instruções"
                onPress={handleRecovery}
                isLoading={isLoading}
              />

              <AuthButton
                title="Voltar para o login"
                variant="secondary"
                onPress={handleBackToLogin}
                disabled={isLoading}
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
    backgroundColor: Colors.white,
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
    color: Colors.light.text,
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.light.textSecondary,
    marginBottom: 24,
  },

  form: {
    gap: 18,
  },

  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.error,
  },

  successText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },

  actions: {
    marginTop: 32,
    gap: 12,
  },
});
