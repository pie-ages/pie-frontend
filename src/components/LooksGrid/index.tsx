import { FlatList, Platform, ScrollView, View } from 'react-native';

import { LookCard } from '@/components/LookCard';
import type { Look } from '@/types/look';

import { styles } from './styles';

type LooksGridProps = {
  looks: Look[];
  onLookPress: (id: string) => void;
  contentBottomInset: number;
};

export function LooksGrid({ looks, onLookPress, contentBottomInset }: LooksGridProps) {
  if (Platform.OS === 'web') {
    const rows: Look[][] = [];
    for (let i = 0; i < looks.length; i += 2) {
      rows.push(looks.slice(i, i + 2));
    }
    return (
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
        scrollEventThrottle={16}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { flexDirection: 'row' }]}>
            {row.map((look) => (
              <LookCard key={look.id} look={look} onPress={onLookPress} />
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>
    );
  }

  const data: (Look | null)[] = looks.length % 2 !== 0 ? [...looks, null] : looks;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?.id ?? `placeholder-${index}`}
      numColumns={2}
      style={styles.list}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) =>
        item ? <LookCard look={item} onPress={onLookPress} /> : <View style={{ flex: 1 }} />
      }
    />
  );
}
