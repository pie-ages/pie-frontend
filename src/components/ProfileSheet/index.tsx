import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ProductActionButton } from '@/components/ProductActionButton';
import { ThemedText } from '@/components/ThemedText';
import { HIGHLIGHT_COLORS_CAPTION } from '@/constants/Colorimetry';
import { BrandColors, Colors } from '@/constants/Theme';
import { useProfile, type ProfileSection } from '@/hooks/UseProfile';
import type { CurrentUser } from '@/schemas/userSchema';
import { IDENTIFIED_STYLE_INFO, type IdentifiedStyle } from '@/types/IdentifiedStyle';

import { styles } from './styles';

const ERROR_SUBTITLE = 'Verifique sua conexão e tente novamente.';

type ProfileSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export function ProfileSheet({ visible, onClose, onSignOut }: ProfileSheetProps) {
  const profile = useProfile(visible);

  function handleClose() {
    profile.reset();
    onClose();
  }

  function handleSignOut() {
    profile.reset();
    onSignOut();
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Pressable
              onPress={handleClose}
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
            <UserSection section={profile.user} />

            <ColorSection
              title="Colorimetria"
              caption={HIGHLIGHT_COLORS_CAPTION}
              section={profile.colorimetry}
              errorTitle="Não foi possível carregar sua colorimetria"
              emptyTitle="Você ainda não fez sua colorimetria."
            />

            <ColorSection
              title="Cores Favoritas"
              section={profile.favoriteColors}
              errorTitle="Não foi possível carregar suas cores favoritas"
              emptyTitle="Nenhuma cor favorita cadastrada."
            />

            <StyleSection section={profile.styles} />

            <ProductActionButton title="Sair" onPress={handleSignOut} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold" style={styles.cardTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function SectionStatus({
  section,
  errorTitle,
  emptyTitle,
}: {
  section: ProfileSection<unknown>;
  errorTitle: string;
  emptyTitle?: string;
}) {
  if (section.status === 'empty') {
    return emptyTitle ? <CompactEmptyState title={emptyTitle} /> : null;
  }

  return (
    <View style={styles.stateBox}>
      {section.status === 'loading' && <LoadingState />}
      {section.status === 'error' && (
        <ErrorState title={errorTitle} subtitle={ERROR_SUBTITLE} onRetry={section.retry} />
      )}
    </View>
  );
}

// O EmptyState padrão ocupa a tela inteira; dentro dos cards do perfil basta o texto.
function CompactEmptyState({ title }: { title: string }) {
  return <Text style={styles.emptyText}>{title}</Text>;
}

function UserSection({ section }: { section: ProfileSection<CurrentUser> }) {
  if (section.status !== 'success' || !section.data) {
    return (
      <View style={[styles.card, styles.userCard]}>
        {section.status === 'error' ? (
          <ErrorState
            title="Não foi possível carregar seus dados"
            subtitle={ERROR_SUBTITLE}
            onRetry={section.retry}
          />
        ) : (
          <ActivityIndicator color={Colors.brand.accent} />
        )}
      </View>
    );
  }

  const { name, email, photoUrl } = section.data;

  return (
    <View style={[styles.card, styles.userCard]}>
      <View style={styles.userRow}>
        <Avatar name={name} photoUrl={photoUrl} />
        <View style={styles.userInfo}>
          <Text style={styles.userText} numberOfLines={1}>
            <Text style={styles.userLabel}>Nome: </Text>
            {name}
          </Text>
          <Text style={styles.userText} numberOfLines={1}>
            <Text style={styles.userLabel}>Email: </Text>
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = photoUrl?.trim();

  if (url && failedUrl !== url) {
    return (
      <Image
        source={{ uri: url }}
        style={styles.avatar}
        contentFit="cover"
        accessibilityLabel="Foto de perfil"
        onError={() => setFailedUrl(url)}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <View style={[styles.avatar, styles.avatarFallback]} accessibilityLabel="Avatar padrão">
      {initials ? (
        <Text style={styles.avatarInitials}>{initials}</Text>
      ) : (
        <Feather name="user" size={28} color={BrandColors.primary} />
      )}
    </View>
  );
}

function ColorSection({
  title,
  caption,
  section,
  errorTitle,
  emptyTitle,
}: {
  title: string;
  caption?: string;
  section: ProfileSection<string[]>;
  errorTitle: string;
  emptyTitle: string;
}) {
  if (section.status === 'success' && section.data) {
    return <ColorimetryColorRow compact title={title} colors={section.data} caption={caption} />;
  }

  return (
    <SectionCard title={title}>
      <SectionStatus section={section} errorTitle={errorTitle} emptyTitle={emptyTitle} />
    </SectionCard>
  );
}

function StyleSection({ section }: { section: ProfileSection<IdentifiedStyle[]> }) {
  if (section.status !== 'success' || !section.data) {
    return (
      <SectionCard title="Estilo">
        <SectionStatus
          section={section}
          errorTitle="Não foi possível carregar seus estilos"
          emptyTitle="Faça o quiz de estilo para descobrir seus estilos."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Estilo">
      <View style={styles.styleList}>
        {section.data.map((style) => (
          <Text key={style} style={styles.styleItem}>
            {IDENTIFIED_STYLE_INFO[style].label}
          </Text>
        ))}
      </View>
      <ThemedText type="small" style={styles.cardCaption}>
        Baseado nas respostas do seu quiz
      </ThemedText>
    </SectionCard>
  );
}
