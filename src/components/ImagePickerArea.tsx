import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface ImagePickerAreaProps {
  imageUri: string | null;
  onSelectImage: () => void;
}

export default function ImagePickerArea({ imageUri, onSelectImage }: ImagePickerAreaProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onSelectImage}>
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

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lensCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 0,
  },
  topLeft: {
    top: 16,
    left: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 16,
    right: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  instructionText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
});
