import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ProfileColorSection } from '@/components/ProfileColorSection';
import { ProfileStyleSection } from '@/components/ProfileStyleSection';
import { ProfileUserSection } from '@/components/ProfileUserSection';
import { Colors, Spacing } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/UseCurrentUser';
import { useFavoriteStyles } from '@/hooks/UseFavoriteStyles';
import { useProfilePreferences } from '@/hooks/UseProfilePreferences';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const currentUser = useCurrentUser(true);
  const preferences = useProfilePreferences(true);
  const favoriteStyles = useFavoriteStyles(true);

  const { retry: reloadUser } = currentUser;
  const { retry: reloadPreferences } = preferences;
  const { retry: reloadStyles } = favoriteStyles;
  const hasFocusedBefore = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedBefore.current) {
        reloadUser();
        reloadPreferences();
        reloadStyles();
      }
      hasFocusedBefore.current = true;
    }, [reloadUser, reloadPreferences, reloadStyles]),
  );

  useSessionExpiredRedirect(
    currentUser.sessionExpired || preferences.sessionExpired || favoriteStyles.sessionExpired,
  );

  function handleClose() {
    if (router.canGoBack()) router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.headerButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Fechar perfil"
        >
          <Feather name="x" size={24} color={Colors.brand.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileUserSection
          status={currentUser.status}
          user={currentUser.user}
          onRetry={currentUser.retry}
          onEdit={() => router.push('/(screens)/EditProfile')}
        />

        <ProfileColorSection
          title="Colorimetria"
          caption={preferences.highlightCaption}
          status={preferences.status}
          colors={preferences.highlightColors}
          action={{
            title: 'Refazer',
            label: 'Refazer colorimetria',
            icon: 'refresh-cw',
            onPress: () => router.push('/(screens)/ColorimetryResult'),
          }}
          errorTitle="Não foi possível carregar sua colorimetria"
          emptyTitle="Você ainda não fez sua colorimetria."
          onRetry={preferences.retry}
        />

        <ProfileColorSection
          title="Cores Favoritas"
          status={preferences.status}
          colors={preferences.favoriteColors}
          action={{
            title: 'Editar',
            label: 'Editar cores favoritas',
            icon: 'edit-2',
            onPress: () => router.push('/(screens)/EditFavoriteColors'),
          }}
          errorTitle="Não foi possível carregar suas cores favoritas"
          emptyTitle="Nenhuma cor favorita cadastrada."
          onRetry={preferences.retry}
        />

        <ProfileStyleSection
          status={favoriteStyles.status}
          favoriteStyles={favoriteStyles.favoriteStyles}
          action={{
            title: 'Editar',
            label: 'Editar estilos',
            icon: 'edit-2',
            onPress: () => router.push('/(screens)/EditStyles'),
          }}
          onRetry={favoriteStyles.retry}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + Spacing.two, Spacing.four) },
        ]}
      >
        <ProductActionButton title="Sair" onPress={signOut} />
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    backgroundColor: Colors.white,
  },
});
