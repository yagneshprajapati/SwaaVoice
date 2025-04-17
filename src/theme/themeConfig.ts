/**
 * Core theme configuration file that defines all design tokens
 * including colors, spacing, typography, shadows, and other visual elements.
 */

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  primary: Record<string, string>;
  gray: Record<string, string>;
  success: Record<string, string>;
  error: Record<string, string>;
  warning: Record<string, string>;
  info: Record<string, string>;
};

export type ThemeConfig = {
  colors: ThemeColors;
  shadows: Record<string, string>;
  radii: Record<string, string>;
  spacing: Record<string, string>;
  typography: {
    fontFamilies: Record<string, string>;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
    lineHeights: Record<string, string | number>;
  };
  transitions: Record<string, string>;
  zIndices: Record<string, number>;
};

// Light theme colors
const lightColors: ThemeColors = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: {
    ...lightColors.primary,
    50: lightColors.primary[950],
    100: lightColors.primary[900],
    200: lightColors.primary[800],
    300: lightColors.primary[700],
    400: lightColors.primary[600],
    500: lightColors.primary[500],
    600: lightColors.primary[400],
    700: lightColors.primary[300],
    800: lightColors.primary[200],
    900: lightColors.primary[100],
    950: lightColors.primary[50],
  },
  gray: {
    ...lightColors.gray,
    50: lightColors.gray[950],
    100: lightColors.gray[900],
    200: lightColors.gray[800],
    300: lightColors.gray[700],
    400: lightColors.gray[600],
    500: lightColors.gray[500],
    600: lightColors.gray[400],
    700: lightColors.gray[300],
    800: lightColors.gray[200],
    900: lightColors.gray[100],
    950: lightColors.gray[50],
  },
  success: lightColors.success,
  error: lightColors.error,
  warning: lightColors.warning,
  info: lightColors.info,
};

// Common theme attributes
const common = {
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    neumorphic: '10px 10px 20px rgba(0, 0, 0, 0.05), -10px -10px 20px rgba(255, 255, 255, 0.1)',
    'neumorphic-inset': 'inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.1)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
    highlight: '0 0 8px rgba(139, 92, 246, 0.25)',
    popup: '0 4px 20px rgba(0, 0, 0, 0.15)',
    none: 'none',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  spacing: {
    px: '1px',
    '0': '0',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '2.5': '0.625rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
    '11': '2.75rem',
    '12': '3rem',
    '14': '3.5rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
    '32': '8rem',
    '36': '9rem',
    '40': '10rem',
    '44': '11rem',
    '48': '12rem',
    '52': '13rem',
    '56': '14rem',
    '60': '15rem',
    '64': '16rem',
    '72': '18rem',
    '80': '20rem',
    '96': '24rem',
  },
  typography: {
    fontFamilies: {
      sans: '"Plus Jakarta Sans", system-ui, sans-serif',
      heading: '"Outfit", sans-serif',
      display: '"Satoshi", sans-serif',
      mono: '"Söhne Mono", monospace',
      accent: '"General Sans", sans-serif',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
      '3': '.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
    },
  },
  transitions: {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },
  zIndices: {
    hide: -1,
    auto: 0,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Mood configurations
export const moodConfigs = {
  energetic: {
    primary: {
      main: 'primary.600',
      hover: 'primary.700',
      active: 'primary.800',
      background: 'primary.50',
      text: 'primary.800',
    },
    gradients: {
      primary: 'linear-gradient(135deg, var(--colors-primary-500) 0%, var(--colors-primary-600) 100%)',
      secondary: 'linear-gradient(135deg, var(--colors-secondary-500) 0%, var(--colors-secondary-600) 100%)',
      creative: 'linear-gradient(135deg, var(--colors-primary-500) 0%, var(--colors-secondary-500) 100%)',
    },
  },
  focused: {
    primary: {
      main: 'primary.700',
      hover: 'primary.800',
      active: 'primary.900',
      background: 'primary.50',
      text: 'primary.900',
    },
    gradients: {
      primary: 'linear-gradient(135deg, var(--colors-primary-600) 0%, var(--colors-primary-800) 100%)',
      secondary: 'linear-gradient(135deg, var(--colors-info-600) 0%, var(--colors-info-800) 100%)',
    },
  },
  creative: {
    primary: {
      main: 'secondary.500',
      hover: 'secondary.600',
      active: 'secondary.700',
      background: 'secondary.50',
      text: 'secondary.800',
    },
    gradients: {
      primary: 'linear-gradient(135deg, var(--colors-primary-500) 0%, var(--colors-secondary-500) 100%)',
      secondary: 'linear-gradient(135deg, var(--colors-secondary-400) 0%, var(--colors-secondary-600) 100%)',
    },
  },
  calm: {
    primary: {
      main: 'info.500',
      hover: 'info.600',
      active: 'info.700',
      background: 'info.50',
      text: 'info.800',
    },
    gradients: {
      primary: 'linear-gradient(135deg, var(--colors-info-400) 0%, var(--colors-info-600) 100%)',
      secondary: 'linear-gradient(135deg, var(--colors-primary-400) 0%, var(--colors-info-400) 100%)',
    },
  },
};

// Create theme configs
export const lightTheme: ThemeConfig = {
  colors: lightColors,
  ...common,
};

export const darkTheme: ThemeConfig = {
  colors: darkColors,
  ...common,
};

export const defaultTheme = lightTheme;
