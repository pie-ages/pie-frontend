import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type SaveLookSheetProps = {
  visible: boolean;
  name: string;
  occasion: string;
  imageUri: string | null;
  error: string | null;
  saving: boolean;
  onChangeName: (value: string) => void;
  onChangeOccasion: (value: string) => void;
  onPickImage: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SaveLookSheet({
  visible,
  name,
  occasion,
  imageUri,
  error,
  saving,
  onChangeName,
  onChangeOccasion,
  onPickImage,
  onCancel,
  onConfirm,
}: SaveLookSheetProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeights, setPageHeights] = useState<[number, number]>([0, 0]);
  const [wasVisible, setWasVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isLastPage = page >= 1;

  const setPageHeight = (index: 0 | 1, height: number) =>
    setPageHeights((current) => {
      if (Math.abs(current[index] - height) < 1) return current;
      const next: [number, number] = [current[0], current[1]];
      next[index] = height;
      return next;
    });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const viewport = typeof window !== 'undefined' ? window.visualViewport : null;
      if (!viewport) return;
      const update = () => {
        const overlap = window.innerHeight - viewport.height - viewport.offsetTop;
        setKeyboardHeight(overlap > 60 ? overlap : 0);
      };
      viewport.addEventListener('resize', update);
      viewport.addEventListener('scroll', update);
      return () => {
        viewport.removeEventListener('resize', update);
        viewport.removeEventListener('scroll', update);
      };
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setPage(0);
  }

  useEffect(() => {
    if (visible) scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              marginBottom: keyboardHeight,
              paddingBottom: keyboardHeight > 0 ? 16 : insets.bottom + 16,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              hitSlop={8}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Feather name="x" size={20} color={Colors.light.text} />
            </Pressable>
            <Text style={styles.title}>Look</Text>
            <Pressable
              onPress={
                isLastPage
                  ? onConfirm
                  : () => scrollRef.current?.scrollTo({ x: pageWidth, animated: true })
              }
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel={isLastPage ? 'Salvar look' : 'Avançar para foto do look'}
              hitSlop={8}
              style={({ pressed }) => [styles.confirm, pressed && styles.pressed]}
            >
              <Feather name={isLastPage ? 'check' : 'arrow-right'} size={20} color={Colors.white} />
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={pageHeights[page] ? { height: pageHeights[page] } : undefined}
            contentContainerStyle={styles.pager}
            onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
            onScroll={(event) => {
              if (pageWidth) setPage(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
            }}
          >
            <View
              style={[styles.page, { width: pageWidth }]}
              onLayout={(event) => setPageHeight(0, event.nativeEvent.layout.height)}
            >
              <Text style={styles.label}>Nome do Look</Text>
              <TextInput
                value={name}
                onChangeText={onChangeName}
                editable={!saving}
                maxLength={60}
                placeholder="Ex.: Ir para faculdade"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                accessibilityLabel="Nome do look"
              />
              <Text style={styles.label}>Ocasião</Text>
              <TextInput
                value={occasion}
                onChangeText={onChangeOccasion}
                editable={!saving}
                maxLength={120}
                placeholder="Ex.: Trabalho, Casual, Festa"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                accessibilityLabel="Ocasião do look"
              />
            </View>

            <View
              style={[styles.page, { width: pageWidth }]}
              onLayout={(event) => setPageHeight(1, event.nativeEvent.layout.height)}
            >
              <Text style={styles.label}>Foto do Look</Text>
              <Text style={styles.hint}>
                Se você quiser, pode adicionar uma foto do look para ver na tela de looks.
              </Text>
              <Pressable
                onPress={onPickImage}
                accessibilityRole="button"
                accessibilityLabel="Adicionar foto do look"
                style={styles.photoPlaceholder}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.photo} contentFit="cover" />
                ) : (
                  <>
                    <View style={[styles.corner, styles.cornerTL]} />
                    <View style={[styles.corner, styles.cornerTR]} />
                    <View style={[styles.corner, styles.cornerBL]} />
                    <View style={[styles.corner, styles.cornerBR]} />
                    <View style={styles.cameraCircle}>
                      <Feather name="camera" size={30} color={Colors.white} />
                    </View>
                  </>
                )}
              </Pressable>
              <Text style={styles.hint}>
                {imageUri ? 'Toque para trocar a foto.' : 'Toque para escolher uma foto.'}
              </Text>
            </View>
          </ScrollView>

          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}

          <View style={styles.dots}>
            {[0, 1].map((index) => (
              <View key={index} style={[styles.dot, index === page && styles.dotActive]} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
