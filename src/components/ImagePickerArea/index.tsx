import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { styles } from './styles';

interface ImagePickerAreaProps {
  imageUri: string | null;
  onSelectImage: () => void;
  disabled?: boolean;
}

export function ImagePickerArea({ imageUri, onSelectImage, disabled }: ImagePickerAreaProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={onSelectImage}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Selecionar foto da peça"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.lensCircle}>
              <Feather name="camera" size={32} color="#FFFFFF" />
            </View>
          </View>
        )}

        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </TouchableOpacity>

      <Text style={styles.instructionText}>Fotografe uma peça com boa iluminação.</Text>
    </View>
  );
}
