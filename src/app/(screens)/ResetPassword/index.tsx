import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { AuthInput } from '@/components/AuthInput';
import { AuthPasswordInput } from '@/components/AuthPasswordInput';
import { Colors } from '@/constants/Theme';
import { useRecoveryCodeForm } from '@/hooks/UseRecoveryCodeForm';
import { useResetPasswordForm } from '@/hooks/UseResetPasswordForm';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

  function handleRequestNewCode() {
    router.dismissTo('/ForgotPassword');
  }

  function renderStep() {
    if (recoveryToken) return <NewPasswordStep recoveryToken={recoveryToken} />;
    if (email) return <RecoveryCodeStep email={email} onVerified={setRecoveryToken} />;

    return (
      <>
        <View>
          <Text style={styles.title}>Recuperar acesso</Text>
          <Text style={styles.description}>
            Não encontramos o e-mail da recuperação. Solicite um novo código.
          </Text>
        </View>

        <View style={styles.actions}>
          <AuthButton title="Solicitar novo código" onPress={handleRequestNewCode} />
        </View>
      </>
    );
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
          <View style={styles.container}>{renderStep()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type RecoveryCodeStepProps = {
  email: string;
  onVerified: (recoveryToken: string) => void;
};

function RecoveryCodeStep({ email, onVerified }: RecoveryCodeStepProps) {
  const {
    control,
    codeError,
    isLoading,
    isResending,
    error,
    hasResent,
    handleVerify,
    handleResend,
  } = useRecoveryCodeForm(email, onVerified);

  return (
    <>
      <View>
        <Text style={styles.title}>Verificar código</Text>

        <Text style={styles.description}>
          Se houver uma conta com {email}, você receberá um código de 6 dígitos. Confira também a
          caixa de spam.
        </Text>

        <View style={styles.form}>
          <Controller
            name="code"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Código"
                placeholder="000000"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={6}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isLoading}
                error={codeError}
              />
            )}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          {hasResent && (
            <Text style={styles.successText}>Novo código solicitado. Confira seu e-mail.</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <AuthButton
          title="Verificar código"
          onPress={() => void handleVerify()}
          isLoading={isLoading}
          disabled={isResending}
        />

        <AuthButton
          title="Reenviar código"
          variant="secondary"
          onPress={handleResend}
          isLoading={isResending}
          disabled={isLoading}
        />
      </View>
    </>
  );
}

function NewPasswordStep({ recoveryToken }: { recoveryToken: string }) {
  const {
    control,
    errors,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleReset,
  } = useResetPasswordForm(recoveryToken);

  return (
    <>
      <View>
        <Text style={styles.title}>Nova senha</Text>

        <Text style={styles.description}>
          Escolha uma nova senha para voltar a acessar sua conta.
        </Text>

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
      </View>

      <View style={styles.actions}>
        <AuthButton title="Salvar senha" onPress={() => void handleReset()} isLoading={isLoading} />
      </View>
    </>
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
