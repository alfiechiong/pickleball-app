import { StyleSheet } from 'react-native';
import theme from './theme';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  paddedContainer: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },

  // Row and column styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },

  // Text styles
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  body: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },

  // Card styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.medium,
  },

  // Button styles
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },

  // Input styles
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // List styles
  listItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  // Badge styles
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },

  // Common margin and padding styles
  mt1: { marginTop: SPACING.xs },
  mt2: { marginTop: SPACING.sm },
  mt3: { marginTop: SPACING.md },
  mt4: { marginTop: SPACING.lg },
  mb1: { marginBottom: SPACING.xs },
  mb2: { marginBottom: SPACING.sm },
  mb3: { marginBottom: SPACING.md },
  mb4: { marginBottom: SPACING.lg },
  ml1: { marginLeft: SPACING.xs },
  ml2: { marginLeft: SPACING.sm },
  ml3: { marginLeft: SPACING.md },
  ml4: { marginLeft: SPACING.lg },
  mr1: { marginRight: SPACING.xs },
  mr2: { marginRight: SPACING.sm },
  mr3: { marginRight: SPACING.md },
  mr4: { marginRight: SPACING.lg },
  p1: { padding: SPACING.xs },
  p2: { padding: SPACING.sm },
  p3: { padding: SPACING.md },
  p4: { padding: SPACING.lg },
});

export default globalStyles;
