import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { ImagePickerArea } from '@/components/ImagePickerArea';
import { useAddPieceForm } from '@/hooks/UseAddPieceForm';
import { fetchTaxonomy, type TaxonomyTerm } from '@/services/taxonomy';

export default function AddPieceScreen() {
  const form = useAddPieceForm();
  const [selection, setSelection] = useState<{
    title: string;
    options: TaxonomyTerm[];
    onSelect: (value: string) => void;
  } | null>(null);
  const [taxonomy, setTaxonomy] = useState<{
    categories: TaxonomyTerm[];
    styles: TaxonomyTerm[];
    colors: TaxonomyTerm[];
  } | null>(null);
  const [taxonomyError, setTaxonomyError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchTaxonomy()
      .then((result) => setTaxonomy(result))
      .catch(() => setTaxonomyError('Não foi possível carregar as opções. Tente novamente.'));
  }, []);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      void form.selectImage({
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      });
    }
  };

  const takePhotoWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à câmera para fotografar suas peças.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      void form.selectImage({
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      });
    }
  };

  const handleSelectImageOptions = () => {
    if (form.operation !== null) return;
    if (Platform.OS === 'web') {
      void pickImageFromGallery();
      return;
    }
    Alert.alert(
      'Adicionar Foto',
      'Como deseja adicionar a imagem da peça?',
      [
        { text: 'Tirar Foto', onPress: takePhotoWithCamera },
        { text: 'Escolher da Galeria', onPress: pickImageFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const handleSelect = (
    title: string,
    options: TaxonomyTerm[] | undefined,
    onSelect: (value: string) => void,
  ) => {
    if (form.operation !== null) return;
    if (!options?.length) {
      Alert.alert(
        'Opções indisponíveis',
        taxonomyError ?? 'Aguarde o carregamento e tente novamente.',
      );
      return;
    }
    setSelection({ title, options, onSelect });
  };

  const handleSubmit = async () => {
    const saved = await form.submit();
    if (saved) {
      Alert.alert('Peça salva!', 'A peça foi adicionada ao seu guarda-roupa.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.dragIndicator} />
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Feather name="x" size={20} color="#7F1D1D" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Adicionar Peça</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ImagePickerArea
            imageUri={form.image?.uri ?? null}
            onSelectImage={handleSelectImageOptions}
            disabled={form.operation !== null}
          />
          {form.errors.image ? (
            <Text style={styles.errorText}>{form.errors.image.message}</Text>
          ) : null}

          {form.operation === 'analyze' && (
            <View style={styles.analysisStatus}>
              <ActivityIndicator color="#661414" />
              <Text accessibilityLiveRegion="polite" style={styles.analysisText}>
                Identificando tipo, estilo e cor da peça...
              </Text>
            </View>
          )}
          {form.analysisError && (
            <View style={styles.analysisStatus}>
              <Text accessibilityRole="alert" style={styles.errorText}>
                {form.analysisError}
              </Text>
              <Text style={styles.analysisText}>
                Envie outra foto com boa iluminação ou preencha os campos manualmente.
              </Text>
              <AuthButton
                title="Enviar outra foto"
                variant="secondary"
                onPress={pickImageFromGallery}
                disabled={form.operation !== null}
                accessibilityRole="button"
              />
            </View>
          )}
          {form.isAnalyzed && (
            <Text style={styles.analysisText}>Confira os dados identificados antes de salvar.</Text>
          )}

          <Controller
            name="name"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Nome"
                placeholder="Ex: Vestido"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={form.operation === null}
                error={form.errors.name?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <FormSelect
                label="Peça"
                disabled={form.operation !== null}
                placeholder="Selecione..."
                value={taxonomy?.categories.find((option) => option.id === value)?.name}
                onPress={() => handleSelect('Peça', taxonomy?.categories, onChange)}
                error={form.errors.category?.message}
              />
            )}
          />

          <Controller
            name="style"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <FormSelect
                label="Estilo"
                disabled={form.operation !== null}
                placeholder="Selecione..."
                value={taxonomy?.styles.find((option) => option.id === value)?.name}
                onPress={() => handleSelect('Estilo', taxonomy?.styles, onChange)}
                error={form.errors.style?.message}
              />
            )}
          />

          <Controller
            name="color"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <FormSelect
                label="Cor"
                disabled={form.operation !== null}
                placeholder="Selecione..."
                value={taxonomy?.colors.find((option) => option.id === value)?.name}
                onPress={() => handleSelect('Cor', taxonomy?.colors, onChange)}
                error={form.errors.color?.message}
              />
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          {taxonomyError ? <Text style={styles.errorText}>{taxonomyError}</Text> : null}
          {form.error ? <Text style={styles.errorText}>{form.error}</Text> : null}
          <AuthButton
            title="Salvar peça"
            onPress={handleSubmit}
            isLoading={form.operation === 'submit'}
            disabled={form.operation !== null}
          />
        </View>

        <Modal
          visible={selection !== null}
          transparent
          animationType="none"
          onRequestClose={() => setSelection(null)}
        >
          <Pressable style={styles.selectionBackdrop} onPress={() => setSelection(null)}>
            <Pressable style={styles.selectionSheet} onPress={(event) => event.stopPropagation()}>
              <View style={styles.selectionHeader}>
                <Text style={styles.selectionTitle}>{selection?.title}</Text>
                <Pressable
                  onPress={() => setSelection(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar opções"
                  hitSlop={8}
                >
                  <Feather name="x" size={22} color="#111827" />
                </Pressable>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selection?.options.map((option) => (
                  <Pressable
                    key={option.id}
                    style={({ pressed }) => [styles.selectionOption, pressed && styles.pressed]}
                    onPress={() => {
                      selection.onSelect(option.id);
                      setSelection(null);
                    }}
                  >
                    <Text style={styles.selectionOptionText}>{option.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDEBE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#5A2A2A',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisStatus: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  analysisText: {
    fontSize: 13,
    color: '#60646C',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  selectionBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
  },
  selectionSheet: {
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  selectionOption: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectionOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  pressed: {
    opacity: 0.65,
  },
});
