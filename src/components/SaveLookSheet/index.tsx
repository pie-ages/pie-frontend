import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type SaveLookSheetProps = {
  visible: boolean;
  name: string;
  description: string;
  error: string | null;
  saving: boolean;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SaveLookSheet({
  visible,
  name,
  description,
  error,
  saving,
  onChangeName,
  onChangeDescription,
  onCancel,
  onConfirm,
}: SaveLookSheetProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [wasVisible, setWasVisible] = useState(false);
  const isLastPage = page >= 1;

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
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
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
            onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
            onScroll={(event) => {
              if (pageWidth) setPage(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
            }}
          >
            <View style={[styles.page, { width: pageWidth }]}>
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
              <Text style={styles.label}>Descrição do Look</Text>
              <TextInput
                value={description}
                onChangeText={onChangeDescription}
                editable={!saving}
                maxLength={120}
                placeholder="Ex.: Ir para faculdade"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                accessibilityLabel="Descrição do look"
              />
              {error ? (
                <Text accessibilityRole="alert" style={styles.error}>
                  {error}
                </Text>
              ) : null}
            </View>

            <View style={[styles.page, { width: pageWidth }]}>
              <Text style={styles.label}>Foto do Look</Text>
              <Text style={styles.hint}>
                Se você quiser, pode adicionar uma foto do look para ver na tela de looks.
              </Text>
              <View style={styles.photoPlaceholder}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <View style={styles.cameraCircle}>
                  <Feather name="camera" size={30} color={Colors.white} />
                </View>
              </View>
              <Text style={styles.hint}>Upload disponível em uma próxima versão.</Text>
            </View>
          </ScrollView>

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
