import { Image } from 'expo-image';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { AuthInput } from '@/components/AuthInput';
import { AuthPasswordInput } from '@/components/AuthPasswordInput';
import { Colors } from '@/constants/Theme';
import { useRegisterForm } from '@/hooks/UseRegisterForm';

export default function RegisterScreen() {
  const {
    control,
    errors,
    isPasswordVisible,
    isConfirmPasswordVisible,
    isLoading,
    error,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleRegister,
  } = useRegisterForm();

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
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AuthInput
                    label="Nome"
                    placeholder="Anna"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AuthInput
                    label="Email"
                    placeholder="anna@pie.com.br"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

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
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <View style={styles.actions}>
              <AuthButton title="Criar conta" onPress={handleRegister} isLoading={isLoading} />
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
  },
});
