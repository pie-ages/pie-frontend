import React from 'react';
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
import { useRegisterForm } from '@/features/auth/hooks/use-register-form';

export function SignUpScreen() {
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
                        android: isPasswordVisible ? 'visibility_off' : 'visibility',
                        web: isPasswordVisible ? 'visibility_off' : 'visibility',
                      }}
                      size={22}
                      tintColor="#777777"
                    />
                  </Pressable>
                }
              />

              <AuthInput
                label="Confirmar Senha"
                placeholder="**********"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                rightElement={
                  <Pressable
                    onPress={toggleConfirmPasswordVisibility}
                    style={styles.passwordVisibilityButton}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isConfirmPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    <SymbolView
                      name={{
                        ios: isConfirmPasswordVisible ? 'eye.slash' : 'eye',
                        android: isConfirmPasswordVisible ? 'visibility_off' : 'visibility',
                        web: isConfirmPasswordVisible ? 'visibility_off' : 'visibility',
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
                title="Criar conta"
                onPress={handleRegister}
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
  },
});