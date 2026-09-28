import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLayoutScale } from '@/hooks/UseLayoutScale';
import type { StyleQuizAnswer } from '@/types/StyleQuiz';

import { createStyles } from './styles';

type StyleQuizFooterProps = {
  answer?: StyleQuizAnswer;
  onAnswer: (answer: StyleQuizAnswer) => void;
};

const ACTIONS = [
  { type: 'both', title: 'Usaria os dois!' },
  { type: 'none', title: 'Nenhum dos dois' },
] as const;

const BOTTOM_OFFSET = 44;
const MIN_BOTTOM_GAP = 8;

export function StyleQuizFooter({ answer, onAnswer }: StyleQuizFooterProps) {
  const insets = useSafeAreaInsets();
  const { s } = useLayoutScale();
  const styles = useMemo(() => createStyles(s), [s]);
  const paddingBottom = Math.max(s(BOTTOM_OFFSET), insets.bottom + MIN_BOTTOM_GAP);

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {ACTIONS.map((action) => {
        const isSelected = answer?.type === action.type;

        return (
          <Pressable
            key={action.type}
            onPress={() => onAnswer({ type: action.type })}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            style={({ pressed }) => [
              styles.button,
              isSelected && styles.buttonSelected,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[styles.text, isSelected && styles.textSelected]}
              numberOfLines={1}
              allowFontScaling={false}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {action.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
