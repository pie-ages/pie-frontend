import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { Colors, Spacing } from '@/constants/Theme';
import { useEditProfile } from '@/hooks/UseEditProfile';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

export default function EditProfileScreen() {
  const profile = useEditProfile();
  const [pickedPhotoUri, setPickedPhotoUri] = useState<string | null>(null);
  const photoUri = pickedPhotoUri ?? profile.user?.photoUrl ?? null;

  useSessionExpiredRedirect(profile.sessionExpired);

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(screens)/Profile');
    }
  }

  async function handleUpdatePhoto() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Você precisa permitir o acesso à galeria para mudar a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPickedPhotoUri(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color={Colors.brand.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.photoContainer}>
            <View style={styles.avatarWrapper}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarImage} />
              )}
              <TouchableOpacity
                style={styles.editPhotoButton}
                activeOpacity={0.8}
                onPress={handleUpdatePhoto}
              >
                <Feather name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={profile.setName}
              editable={!profile.isLoading && !profile.isSaving}
              placeholder="Seu nome"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>

          {profile.hasLoadError ? (
            <Text style={styles.errorText} accessibilityRole="alert">
              Não foi possível carregar seus dados.
            </Text>
          ) : null}
          {profile.error ? (
            <Text style={styles.errorText} accessibilityRole="alert">
              {profile.error}
            </Text>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <ProductActionButton
            title="Salvar Alterações"
            onPress={profile.hasLoadError ? profile.retry : profile.save}
            isLoading={profile.isSaving}
            disabled={!profile.hasLoadError && !profile.canSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSpacer: { width: 40 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.brand.tertiary,
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  formGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  input: {
    height: 52,
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: Colors.light.text,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.four,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});
