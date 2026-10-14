import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ProfileColorSection } from '@/components/ProfileColorSection';
import { ProfileStyleSection } from '@/components/ProfileStyleSection';
import { ProfileUserSection } from '@/components/ProfileUserSection';
import { HIGHLIGHT_COLORS_CAPTION } from '@/constants/Colorimetry';
import { BrandColors } from '@/constants/Theme';
import { useCurrentUser } from '@/hooks/UseCurrentUser';
import { useFavoriteStyles } from '@/hooks/UseFavoriteStyles';
import { useProfilePreferences } from '@/hooks/UseProfilePreferences';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

import { styles } from './styles';

type ProfileSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export function ProfileSheet({ visible, onClose, onSignOut }: ProfileSheetProps) {
  const currentUser = useCurrentUser(visible);
  const preferences = useProfilePreferences(visible);
  const favoriteStyles = useFavoriteStyles(visible);

  useSessionExpiredRedirect(
    currentUser.sessionExpired || preferences.sessionExpired || favoriteStyles.sessionExpired,
  );

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Fechar perfil"
              style={styles.closeButton}
            >
              <Feather name="x" size={18} color={BrandColors.primary} />
            </Pressable>
            <Text style={styles.title}>Perfil</Text>
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
            />

            <ProfileColorSection
              title="Colorimetria"
              caption={HIGHLIGHT_COLORS_CAPTION}
              status={preferences.status}
              colors={preferences.highlightColors}
              errorTitle="Não foi possível carregar sua colorimetria"
              emptyTitle="Você ainda não fez sua colorimetria."
              onRetry={preferences.retry}
            />

            <ProfileColorSection
              title="Cores Favoritas"
              status={preferences.status}
              colors={preferences.favoriteColors}
              errorTitle="Não foi possível carregar suas cores favoritas"
              emptyTitle="Nenhuma cor favorita cadastrada."
              onRetry={preferences.retry}
            />

            <ProfileStyleSection
              status={favoriteStyles.status}
              favoriteStyles={favoriteStyles.favoriteStyles}
              onRetry={favoriteStyles.retry}
            />

            <ProductActionButton title="Sair" onPress={onSignOut} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
