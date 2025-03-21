export const COLORS = {
  // Primary colors
  primary: "#4CAF50", // Green
  primaryDark: "#388E3C",
  primaryLight: "#C8E6C9",

  // Secondary colors
  secondary: "#2196F3", // Blue
  secondaryDark: "#1976D2",
  secondaryLight: "#BBDEFB",

  // Accent colors
  accent: "#FF9800", // Orange
  accentDark: "#F57C00",
  accentLight: "#FFE0B2",

  // Text colors
  textPrimary: "#212121",
  textSecondary: "#757575",
  textLight: "#FFFFFF",

  // Background colors
  background: "#FFFFFF",
  backgroundLight: "#F5F5F5",
  backgroundDark: "#E0E0E0",

  // Status colors
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  info: "#2196F3",

  // Common colors
  white: "#FFFFFF",
  black: "#000000",
  gray: "#9E9E9E",
  lightGray: "#E0E0E0",
  transparent: "transparent",
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  title: 36,
};

export const FONT_WEIGHTS = {
  thin: "100",
  light: "300",
  regular: "400",
  medium: "500",
  bold: "700",
  black: "900",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const SHADOW = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

const theme = {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  SHADOW,
  BORDER_RADIUS,
};

export default theme;
