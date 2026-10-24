import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { mockUserProfile } from '@/mocks/profileMocks';
import { STYLE_LABELS } from '@/types/Style';

export default function ProfileScreen() {
  /* Hooks comentados para teste com dados mockados
  const { profile, status: profileStatus, retry: retryProfile } = useUserProfile();
  const { preferences, status: preferencesStatus, retry: retryPreferences } = useColorimetryPreferences();
  const { styles: selectedStyles, status: stylesStatus, retry: retryStyles } = useUserProductStyles();
  */

  // Dados mockados
  const profile = {
    name: mockUserProfile.name,
    email: mockUserProfile.email,
    photoUrl: mockUserProfile.avatarUrl,
  };

  const preferences = {
    highlightColors: mockUserProfile.colorimetry.colors,
    favoriteColors: mockUserProfile.favoriteColors,
  };

  const selectedStyles = ['dramatico', 'casual', 'romantico'] as any[];

  const isLoading = false;
  const hasError = false;

  function handleClose() {
    if (router.canGoBack()) router.back();
  }

  function handleRetry() {
    // if (profileStatus === 'error') retryProfile();
    // if (preferencesStatus === 'error') retryPreferences();
    // if (stylesStatus === 'error') retryStyles();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Fechar perfil"
        >
          <Feather name="x" size={24} color={Colors.brand.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <LoadingState text="Carregando seu perfil..." />
      ) : hasError ? (
        <ErrorState title="Não foi possível carregar seu perfil." onRetry={handleRetry} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              {profile?.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={36} color={Colors.icon} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.name}</Text>
              <Text style={styles.profileEmail}>{profile?.email}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText type="smallBold" style={styles.cardTitle}>
                Colorimetria
              </ThemedText>
              <Pressable
                onPress={() => router.push('/')}
                style={styles.actionButton}
                accessibilityRole="button"
                accessibilityLabel="Refazer colorimetria"
              >
                <Feather name="refresh-cw" size={12} color={Colors.white} />
                <Text style={styles.actionButtonText}>Refazer</Text>
              </Pressable>
            </View>
            <View style={styles.colorsRow}>
              {preferences?.highlightColors?.map((color, index) => (
                <View key={index} style={[styles.colorCircle, { backgroundColor: color }]} />
              ))}
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.cardCaption}>
              Tons terrosos e quentes valorizam sua pele.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText type="smallBold" style={styles.cardTitle}>
                Cores Favoritas
              </ThemedText>
              <Pressable
                onPress={() => router.push('/')}
                style={styles.actionButton}
                accessibilityRole="button"
                accessibilityLabel="Editar cores favoritas"
              >
                <Feather name="edit-2" size={12} color={Colors.white} />
                <Text style={styles.actionButtonText}>Editar</Text>
              </Pressable>
            </View>
            <View style={styles.colorsRow}>
              {preferences?.favoriteColors?.map((color, index) => (
                <View key={index} style={[styles.colorCircle, { backgroundColor: color }]} />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText type="smallBold" style={styles.cardTitle}>
                Estilo
              </ThemedText>
              <Pressable
                onPress={() => router.push('/')}
                style={styles.actionButton}
                accessibilityRole="button"
                accessibilityLabel="Editar estilo"
              >
                <Feather name="edit-2" size={12} color={Colors.white} />
                <Text style={styles.actionButtonText}>Editar</Text>
              </Pressable>
            </View>

            <View style={styles.styleItems}>
              {selectedStyles.map((style) => (
                <View key={style} style={styles.stylePill}>
                  <Text style={styles.styleItem}>{STYLE_LABELS[style]}</Text>
                </View>
              ))}
              {selectedStyles.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Nenhum estilo selecionado.
                </ThemedText>
              )}
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.cardCaption}>
              Baseado nas escolhas do seu quiz.
            </ThemedText>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.four,
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardCaption: {
    marginTop: Spacing.two + 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  styleItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  stylePill: {
    backgroundColor: Colors.brand.tertiary,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  styleItem: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
});
