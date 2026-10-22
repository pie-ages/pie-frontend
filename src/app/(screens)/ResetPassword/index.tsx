import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { AuthPasswordInput } from '@/components/AuthPasswordInput';
import { Colors } from '@/constants/Theme';
import { useResetPasswordForm } from '@/hooks/UseResetPasswordForm';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const {
    control,
    errors,
    hasToken,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleReset,
  } = useResetPasswordForm();

  function handleRequestNewLink() {
    router.dismissTo('/ForgotPassword');
  }

  const description = hasToken
    ? 'Escolha uma nova senha para voltar a acessar sua conta.'
    : 'Este link é inválido ou já expirou. Solicite a recuperação novamente.';

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
              <Text style={styles.title}>Nova senha</Text>

              <Text style={styles.description}>{description}</Text>

              {hasToken && (
                <View style={styles.form}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AuthPasswordInput
                        label="Senha"
                        placeholder="**********"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isVisible={isPasswordVisible}
                        onToggleVisibility={togglePasswordVisibility}
                        editable={!isLoading}
                        error={errors.password?.message}
                      />
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AuthPasswordInput
                        label="Confirmar Senha"
                        placeholder="**********"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        isVisible={isConfirmPasswordVisible}
                        onToggleVisibility={toggleConfirmPasswordVisibility}
                        editable={!isLoading}
                        error={errors.confirmPassword?.message}
                      />
                    )}
                  />

                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
              )}
            </View>

            <View style={styles.actions}>
              {hasToken ? (
                <AuthButton title="Salvar senha" onPress={handleReset} isLoading={isLoading} />
              ) : (
                <AuthButton title="Solicitar novo link" onPress={handleRequestNewLink} />
              )}
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
    color: Colors.error,
  },

  actions: {
    marginTop: 32,
    gap: 12,
  },
});
