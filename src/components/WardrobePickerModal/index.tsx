import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { LookPieceCard } from '@/components/LookPieceCard';
import { Colors } from '@/constants/Theme';
import type { WardrobePiece } from '@/types/look';

import { styles } from './styles';

type WardrobeStatus = 'loading' | 'success' | 'error' | 'empty';

function categoryRank(category: string): number {
  const c = category.toLowerCase();
  if (c.includes('cima')) return 0;
  if (c.includes('casaco') || c.includes('jaqueta') || c.includes('blazer')) return 1;
  if (c.includes('vestido') || c.includes('macac')) return 2;
  if (
    c.includes('calçado') ||
    c.includes('calcado') ||
    c.includes('sapat') ||
    c.includes('tênis') ||
    c.includes('tenis') ||
    c.includes('sandal') ||
    c.includes('scarpin') ||
    c.includes('bota')
  ) {
    return 4;
  }
  if (
    c.includes('baixo') ||
    c.includes('calça') ||
    c.includes('calca') ||
    c.includes('saia') ||
    c.includes('short') ||
    c.includes('bermuda')
  ) {
    return 3;
  }
  return 5;
}

type WardrobePickerModalProps = {
  visible: boolean;
  pieces: WardrobePiece[];
  status: WardrobeStatus;
  selectedIds: string[];
  onToggle: (piece: WardrobePiece) => void;
  onRetry: () => void;
  onClose: () => void;
};

export function WardrobePickerModal({
  visible,
  pieces,
  status,
  selectedIds,
  onToggle,
  onRetry,
  onClose,
}: WardrobePickerModalProps) {
  const insets = useSafeAreaInsets();
  const categories = [...new Set(pieces.map((piece) => piece.category))].sort(
    (a, b) => categoryRank(a) - categoryRank(b) || a.localeCompare(b),
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
                            onPress={() => onToggle(piece)}
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
