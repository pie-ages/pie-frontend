import { StyleSheet } from 'react-native';

import { BrandColors, Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 13,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSpacer: {
    width: 44,
  },

  // Grid
  gridContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  columnWrapper: {
    gap: 12,
  },

  // Card
  card: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  cardPlaceholder: {
    flex: 1,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 0.9,
    backgroundColor: '#F0F0F0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonPressed: {
    opacity: 0.7,
  },
  cardBody: {
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 10,
    gap: 4,
    backgroundColor: '#F3F3F3',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  cardColor: {
    fontSize: 12,
    color: '#3C3C43',
    opacity: 0.6,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C3C43',
    opacity: 0.6,
  },
  storeButton: {
    marginTop: 2,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeButtonPressed: {
    opacity: 0.85,
  },
  storeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  unavailableLabel: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BrandColors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: Spacing.two,
    width: '100%',
    height: 52,
    borderRadius: 1000,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonPressed: {
    opacity: 0.85,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
