import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ProductActionButton } from '@/components/ProductActionButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorimetryPreferences } from '@/hooks/UseColorimetryPreferences';
import { useUserProductStyles } from '@/hooks/UseUserProductStyles';
import { useUserProfile } from '@/hooks/UseUserProfile';
import { STYLE_LABELS } from '@/types/Style';

export default function ProfileScreen() {
  const { profile, status: profileStatus, retry: retryProfile } = useUserProfile();
  const {
    preferences,
    status: preferencesStatus,
    retry: retryPreferences,
  } = useColorimetryPreferences();
  const {
    styles: selectedStyles,
    status: stylesStatus,
    retry: retryStyles,
  } = useUserProductStyles();
  const { signOut } = useAuth();

  const isLoading =
    profileStatus === 'loading' || preferencesStatus === 'loading' || stylesStatus === 'loading';
  const hasError =
    profileStatus === 'error' || preferencesStatus === 'error' || stylesStatus === 'error';

  function handleClose() {
    if (router.canGoBack()) router.back();
  }

  function handleRetry() {
    if (profileStatus === 'error') retryProfile();
    if (preferencesStatus === 'error') retryPreferences();
    if (stylesStatus === 'error') retryStyles();
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/Login');
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
              {profile?.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={styles.avatarImage} />
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
            colors={preferences?.highlightColors ?? []}
            caption="Tons terrosos e quentes valorizam sua pele."
          />

          <ColorimetryColorRow title="Cores Favoritas" colors={preferences?.favoriteColors ?? []} />

          <View style={styles.styleCard}>
            <View style={styles.styleHeader}>
              <ThemedText type="smallBold" style={styles.styleTitle}>
                Estilo
              </ThemedText>
              <Pressable
                onPress={() => router.push('/StyleSelection')}
                style={styles.action}
                accessibilityRole="button"
                accessibilityLabel="Editar estilo"
              >
                <Feather name="edit-2" size={18} color={Colors.brand.primary} />
              </Pressable>
            </View>

            <View style={styles.styleItems}>
              {selectedStyles.map((style) => (
                <View key={style} style={styles.stylePill}>
                  <ThemedText style={styles.styleItem}>{STYLE_LABELS[style]}</ThemedText>
                </View>
              ))}
              {selectedStyles.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  Nenhum estilo selecionado.
                </ThemedText>
              )}
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.styleCaption}>
              Baseado nas escolhas do seu quiz
            </ThemedText>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <ProductActionButton title="Sair" onPress={handleSignOut} />
      </View>
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
    color: Colors.white,
  },
  styleItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  stylePill: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  styleCaption: {
    marginTop: Spacing.one,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: Colors.white,
  },
});
