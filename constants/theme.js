import { Platform } from 'react-native';

export const colors = {
  bg: '#F5F5EF',
  surface: '#FFFFFF',
  surfaceMuted: '#ECECE4',
  ink: '#10120D',
  inkSoft: '#34382E',
  muted: '#757A6D',
  line: '#E2E3D9',
  lineStrong: '#D3D5C8',
  volt: '#D8FF4F',
  voltSoft: '#F2FFC9',
  heart: '#FF5A5F',
  star: '#F2B705',
  danger: '#D94A4A',
  success: '#2E7D4F',
  white: '#FFFFFF',
  darkCard: '#1A1D16',
  darkLine: '#2B2F24',
  overlay: 'rgba(16, 18, 13, 0.58)',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
  huge: 64,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 34,
  pill: 999,
};

export const fonts = {
  light: 'Nunito_300Light',
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

export const type = {
  display: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.5,
    color: colors.ink,
  },
  h1: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1,
    color: colors.ink,
  },
  h2: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  h3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  body: {
    fontSize: 15,
    fontFamily: fonts.regular,
    lineHeight: 24,
    color: colors.inkSoft,
  },
  small: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 19,
    color: colors.muted,
  },
  tiny: {
    fontSize: 11,
    fontFamily: fonts.regular,
    lineHeight: 15,
    color: colors.muted,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 1.35,
    textTransform: 'uppercase',
    color: colors.muted,
  },
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#10120D',
      shadowOpacity: 0.07,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 3 },
    default: {
      boxShadow: '0 10px 24px rgba(16, 18, 13, 0.07)',
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: '#10120D',
      shadowOpacity: 0.16,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 8 },
    default: {
      boxShadow: '0 14px 34px rgba(16, 18, 13, 0.18)',
    },
  }),
};

export const layout = {
  screenPadding: 20,
  maxWidth: 720,
  wideWidth: 1440,
  profileWidth: 1200,
  desktopBreakpoint: 1024,
  navHeight: 76,
  tabBarHeight: 64,
};
