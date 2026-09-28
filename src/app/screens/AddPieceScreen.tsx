import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
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

import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import ImagePickerArea from '@/components/ImagePickerArea';
import { mockCategories, mockStyles, mockColors } from '@/mocks/addPieceMocks';

export default function AddPieceScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('');

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
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
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSelectImageOptions = () => {
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

  // Simulação dos selects
  const handleSelectMock = (type: 'category' | 'style' | 'color') => {
    if (type === 'category') setCategory(mockCategories[0].label);
    if (type === 'style') setStyle(mockStyles[1].label);
    if (type === 'color') setColor(mockColors[0].label);
  };

  const isValid = imageUri !== null && name.trim() !== '' && category !== '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.dragIndicator} />
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.7}>
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
          <ImagePickerArea imageUri={imageUri} onSelectImage={handleSelectImageOptions} />

          <FormInput label="Nome" placeholder="Ex: Vestido" value={name} onChangeText={setName} />

          <FormSelect
            label="Peça"
            placeholder="Selecione..."
            value={category}
            onPress={() => handleSelectMock('category')}
          />

          <FormSelect
            label="Estilo"
            placeholder="Selecione..."
            value={style}
            onPress={() => handleSelectMock('style')}
          />

          <FormSelect
            label="Cor"
            placeholder="Selecione..."
            value={color}
            onPress={() => handleSelectMock('color')}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            activeOpacity={0.8}
            disabled={!isValid}
          >
            <Text style={styles.submitButtonText}>Salvar peça</Text>
          </TouchableOpacity>
        </View>
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
});
