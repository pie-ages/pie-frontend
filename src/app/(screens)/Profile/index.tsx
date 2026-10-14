import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useUserProfile } from '@/hooks/UseUserProfile';
import { MOCK_FAVORITE_STYLE_LABELS, MOCK_PROFILE_PREFERENCES } from '@/mocks/userProfile';

export default function ProfileScreen() {
  const { profile, status: profileStatus, retry: retryProfile } = useUserProfile();

  const isLoading = profileStatus === 'loading';
  const hasError = profileStatus === 'error';

  function handleClose() {
    if (router.canGoBack()) router.back();
  }

  function handleRetry() {
    if (profileStatus === 'error') retryProfile();
  }

  function handleRedoColorimetry() {
    // Refazer a colorimetria é um fluxo próprio, fora do escopo de visualização do perfil.
  }

  function handleEditFavoriteColors() {
    // A edição das cores favoritas está fora do escopo de visualização do perfil.
  }

  function handleEditStyle() {
    // A edição de estilo está fora do escopo de visualização do perfil.
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
          <Feather name="x" size={22} color={Colors.brand.primary} />
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
              {profile?.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={28} color={Colors.icon} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="smallBold">Nome: {profile?.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Email: {profile?.email}
              </ThemedText>
            </View>
          </View>

          <ColorimetryColorRow
            title="Colorimetria"
            colors={MOCK_PROFILE_PREFERENCES.highlightColors}
            caption="Tons terrosos e quentes valorizam sua pele."
            action={{ label: 'Refazer', icon: 'refresh-cw', onPress: handleRedoColorimetry }}
          />

          <ColorimetryColorRow
            title="Cores Favoritas"
            colors={MOCK_PROFILE_PREFERENCES.favoriteColors}
            action={{ label: 'Editar', icon: 'edit-2', onPress: handleEditFavoriteColors }}
          />

          <View style={styles.styleCard}>
            <View style={styles.styleHeader}>
              <ThemedText type="smallBold" style={styles.styleTitle}>
                Estilo
              </ThemedText>
              <Pressable
                onPress={handleEditStyle}
                style={styles.action}
                accessibilityRole="button"
                accessibilityLabel="Editar estilo"
              >
                <Feather name="edit-2" size={18} color={Colors.brand.primary} />
              </Pressable>
            </View>

            <View style={styles.styleItems}>
              {MOCK_FAVORITE_STYLE_LABELS.map((style) => (
                <ThemedText key={style} style={styles.styleItem}>
                  {style}
                </ThemedText>
              ))}
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.styleCaption}>
              Baseado nas respostas do seu quiz
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
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.five,
    gap: Spacing.five,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    gap: 2,
  },
  styleCard: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  styleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  styleTitle: {
    fontSize: 16,
  },
  action: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: 8 }, { translateY: -4 }],
  },
  styleItem: {
    fontSize: 15,
  },
  styleItems: {
    gap: Spacing.two,
  },
  styleCaption: {
    marginTop: Spacing.one,
  },
});
