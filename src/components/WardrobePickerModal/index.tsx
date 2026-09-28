import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { LookPieceCard } from '@/components/LookPieceCard';
import { Colors } from '@/constants/Theme';
import type { WardrobePiece } from '@/types/look';

import { styles } from './styles';

const CATEGORIES: WardrobePiece['category'][] = ['Parte de cima', 'Parte de baixo', 'Calçados'];

type WardrobePickerModalProps = {
  visible: boolean;
  pieces: WardrobePiece[];
  selectedIds: string[];
  onToggle: (piece: WardrobePiece) => void;
  onClose: () => void;
};

export function WardrobePickerModal({
  visible,
  pieces,
  selectedIds,
  onToggle,
  onClose,
}: WardrobePickerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecionar peças</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar seleção"
            hitSlop={8}
            style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
          >
            <Feather name="x" size={20} color={Colors.light.text} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{selectedIds.length} peça(s) selecionada(s)</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((category) => {
            const categoryPieces = pieces.filter((piece) => piece.category === category);
            if (!categoryPieces.length) return null;

            return (
              <View key={category} style={styles.section}>
                <Text style={styles.category}>{category}</Text>
                <View style={styles.grid}>
                  {categoryPieces.map((piece) => (
                    <View key={piece.id} style={styles.cell}>
                      <LookPieceCard
                        piece={piece}
                        onPress={() => onToggle(piece)}
                        selected={selectedIds.includes(piece.id)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <AuthButton title="Concluir" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
