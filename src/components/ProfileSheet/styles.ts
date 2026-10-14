import { StyleSheet } from 'react-native';

import { BrandColors, Colors, Spacing } from '@/constants/Theme';

const AVATAR_SIZE = 64;
const CLOSE_BUTTON_SIZE = 32;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  panel: {
    maxHeight: '90%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpacer: {
    width: CLOSE_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
  closeButton: {
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: CLOSE_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    gap: Spacing.three,
  },
  // Mesmo visual de card do ColorimetryColorRow, para as seções ficarem uniformes.
  card: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  cardTitle: {
    color: '#292524',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: Spacing.four,
  },
  cardCaption: {
    color: '#000000',
    paddingHorizontal: Spacing.four,
  },
  stateBox: {
    minHeight: 120,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  // Altura mínima igual à do avatar para o card não mudar de tamanho quando os dados chegam.
  userCard: {
    minHeight: AVATAR_SIZE + Spacing.three * 2 + 2,
    justifyContent: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  userInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  userText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
  },
  userLabel: {
    fontWeight: '700',
  },
  styleList: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  styleItem: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
  },
});
