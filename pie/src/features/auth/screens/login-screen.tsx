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

import { AuthInput } from '@/features/auth/components/auth-input';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';

export function LoginScreen() {
  const {
    email,
    password,
    isPasswordVisible,
    setEmail,
    setPassword,
    togglePasswordVisibility,
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
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.brand}>Piê</Text>

              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>Logo</Text>
              </View>
            </View>

            <View style={styles.form}>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brand: {
    fontSize: 26,
    fontWeight: '500',
    color: '#1F1F1F',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    color: '#A0A0A0',
  },
  form: {
    gap: 16,
  },
  passwordVisibilityButton: {
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});