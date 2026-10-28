import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { LookPieceCard } from '@/components/LookPieceCard';
import { Colors } from '@/constants/Theme';
import type { WardrobePiece } from '@/types/Look';
import { lookPieceRank } from '@/utils/look-order';

import { styles } from './styles';

type WardrobeStatus = 'loading' | 'success' | 'error' | 'empty';

type WardrobePickerModalProps = {
  visible: boolean;
  pieces: WardrobePiece[];
  status: WardrobeStatus;
  selectedIds: string[];
  onSelect: (piece: WardrobePiece) => void;
  onRetry: () => void;
  onClose: () => void;
};

export function WardrobePickerModal({
  visible,
  pieces,
  status,
  selectedIds,
  onSelect,
  onRetry,
  onClose,
}: WardrobePickerModalProps) {
  const insets = useSafeAreaInsets();
  const categories = [...new Set(pieces.map((piece) => piece.category))].sort(
    (a, b) => lookPieceRank(a) - lookPieceRank(b) || a.localeCompare(b),
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
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

          {status === 'loading' ? (
            <View style={styles.state}>
              <ActivityIndicator size="large" color={Colors.brand.accent} />
              <Text style={styles.stateText}>Carregando peças...</Text>
            </View>
          ) : null}

          {status === 'error' ? (
            <View style={styles.state}>
              <Feather name="alert-circle" size={32} color={Colors.error} />
              <Text style={styles.stateText}>Não foi possível carregar suas peças.</Text>
              <AuthButton title="Tentar novamente" variant="secondary" onPress={onRetry} />
            </View>
          ) : null}

          {status === 'empty' ? (
            <View style={styles.state}>
              <Feather name="inbox" size={32} color={Colors.iconMuted} />
              <Text style={styles.stateText}>Você ainda não tem peças no guarda-roupa.</Text>
            </View>
          ) : null}

          {status === 'success' ? (
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {categories.map((category) => (
                <View key={category} style={styles.section}>
                  <Text style={styles.category}>{category}</Text>
                  <View style={styles.grid}>
                    {pieces
                      .filter((piece) => piece.category === category)
                      .map((piece) => (
                        <View key={piece.id} style={styles.cell}>
                          <LookPieceCard
                            piece={piece}
                            onPress={
                              selectedIds.includes(piece.id) ? undefined : () => onSelect(piece)
                            }
                            selected={selectedIds.includes(piece.id)}
                          />
                        </View>
                      ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : null}

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <AuthButton title="Concluir" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
