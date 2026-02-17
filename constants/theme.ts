export const Colors = {
  light: {
    primary: '#6C5CE7',
    primaryLight: '#A29BFE',
    primaryDark: '#5A4BD1',
    secondary: '#FD79A8',
    accent: '#00CEC9',

    background: '#F8F9FE',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    text: '#2D3436',
    textSecondary: '#636E72',
    textTertiary: '#B2BEC3',
    textInverse: '#FFFFFF',

    border: '#E8ECF4',
    borderLight: '#F0F3FA',
    divider: '#EEF1F8',

    danger: '#FF6B6B',
    success: '#00B894',
    warning: '#FDCB6E',
    info: '#74B9FF',

    tabBar: '#FFFFFF',
    tabBarBorder: '#E8ECF4',
    tabBarActive: '#6C5CE7',
    tabBarInactive: '#B2BEC3',

    shadow: 'rgba(108, 92, 231, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    pinDot: '#DFE6E9',
    pinDotFilled: '#6C5CE7',
    pinKey: '#F0F3FA',
    pinKeyPressed: '#E8ECF4',

    fab: '#6C5CE7',
    fabIcon: '#FFFFFF',

    skeleton: '#E8ECF4',
  },
  dark: {
    primary: '#A29BFE',
    primaryLight: '#6C5CE7',
    primaryDark: '#B8B3FF',
    secondary: '#FD79A8',
    accent: '#00CEC9',

    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#1C2333',
    card: '#161B22',

    text: '#F0F6FC',
    textSecondary: '#8B949E',
    textTertiary: '#484F58',
    textInverse: '#0D1117',

    border: '#21262D',
    borderLight: '#1C2333',
    divider: '#21262D',

    danger: '#FF6B6B',
    success: '#00B894',
    warning: '#FDCB6E',
    info: '#74B9FF',

    tabBar: '#161B22',
    tabBarBorder: '#21262D',
    tabBarActive: '#A29BFE',
    tabBarInactive: '#484F58',

    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',

    pinDot: '#21262D',
    pinDotFilled: '#A29BFE',
    pinKey: '#1C2333',
    pinKeyPressed: '#21262D',

    fab: '#A29BFE',
    fabIcon: '#0D1117',

    skeleton: '#21262D',
  },
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.37,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.36,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.38,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.32,
    lineHeight: 21,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.07,
    lineHeight: 13,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
