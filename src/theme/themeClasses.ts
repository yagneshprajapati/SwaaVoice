/**
 * Theme classes that can be used throughout the application
 * to maintain consistent styling based on the theme configuration.
 */

// Common class utilities that can be composed together
export const themeClasses = {
  // Layout classes
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  flexCenter: 'flex items-center justify-center',
  flexStart: 'flex items-center justify-start',
  flexBetween: 'flex items-center justify-between',
  flexColumn: 'flex flex-col',
  
  // Innovative Card variations
  card: {
    base: 'bg-white/80 dark:bg-gray-800/90 backdrop-filter backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-100 dark:border-gray-700/30',
    interactive: 'hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300',
    flat: 'bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 p-4',
    glass: 'bg-white/20 dark:bg-gray-900/30 backdrop-filter backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-xl shadow-lg',
    accent: 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800/30 rounded-xl shadow-lg'
  },
  
  // Modern Button variations
  button: {
    base: 'font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50',
    primary: 'px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium',
    secondary: 'px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium',
    danger: 'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white focus:ring-secondary-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
    link: 'bg-transparent underline text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    icon: 'p-2 rounded-full flex items-center justify-center',
    iconText: 'flex items-center gap-2',
    disabled: 'opacity-50 cursor-not-allowed',
    neumorphic: 'px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.05)]',
    glass: 'px-4 py-2 bg-white/20 dark:bg-gray-900/30 backdrop-filter backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-lg'
  },
  
  // Modern Input variations
  input: {
    base: 'bg-white/60 dark:bg-gray-800/50 backdrop-filter backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-primary-500 focus:border-primary-500 dark:placeholder-gray-400',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    },
    error: 'border-secondary-500 focus:ring-secondary-500 focus:border-secondary-500',
    disabled: 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed',
  },
  
  // Typography with better contrast
  text: {
    h1: 'font-heading text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight',
    h2: 'font-heading text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight',
    h3: 'font-heading text-xl font-semibold text-gray-900 dark:text-gray-100',
    h4: 'font-heading text-lg font-semibold text-gray-900 dark:text-gray-100',
    p: 'font-sans text-base text-gray-800 dark:text-gray-200',
    small: 'font-sans text-sm text-gray-700 dark:text-gray-300',
    gradient: 'font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500',
    accent: 'font-accent text-primary-600 dark:text-primary-400',
  },
  
  // Typography system
  typography: {
    // Font families
    fontFamily: {
      sans: 'font-sans',
      heading: 'font-heading',
      display: 'font-display',
      mono: 'font-mono',
      accent: 'font-accent',
    },
    // Font sizes
    fontSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
    // Font weights
    fontWeight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    // Letter spacing
    letterSpacing: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
    },
    // Line heights
    lineHeight: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  
  // Modern Badge/Tag variations
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
    info: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    glass: 'bg-white/20 dark:bg-gray-900/30 backdrop-filter backdrop-blur-md text-gray-800 dark:text-gray-200 border border-white/20 dark:border-gray-700/20',
  },
  
  // Avatar improvements
  avatar: {
    base: 'relative rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800',
    sizes: {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    },
    bordered: 'border-2 border-white dark:border-gray-800',
    ring: 'ring-2 ring-offset-2',
    status: {
      online: 'absolute bottom-0 right-0 rounded-full bg-green-500 p-1 border-2 border-white dark:border-gray-800',
      offline: 'absolute bottom-0 right-0 rounded-full bg-gray-500 p-1 border-2 border-white dark:border-gray-800',
      busy: 'absolute bottom-0 right-0 rounded-full bg-secondary-500 p-1 border-2 border-white dark:border-gray-800'
    }
  },
  
  // Mood-based class variations
  mood: {
    energetic: {
      gradient: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      bg: 'bg-secondary-500',
      text: 'text-secondary-500 dark:text-secondary-400',
      border: 'border-secondary-500',
    },
    focused: {
      gradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
      bg: 'bg-primary-500',
      text: 'text-primary-500 dark:text-primary-400',
      border: 'border-primary-500',
    },
    creative: {
      gradient: 'bg-gradient-to-br from-primary-400 to-secondary-400',
      bg: 'bg-primary-400',
      text: 'text-primary-400 dark:text-primary-300',
      border: 'border-primary-400',
    },
    calm: {
      gradient: 'bg-gradient-to-br from-primary-600 to-primary-700',
      bg: 'bg-primary-600',
      text: 'text-primary-600 dark:text-primary-500',
      border: 'border-primary-600',
    },
  },
  
  // Animation classes
  animations: {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
    fadeIn: 'animate-fadeIn',
    slideIn: 'animate-slideIn',
    slideInBottom: 'animate-slideInBottom',
  },
  
  // Content dividers
  divider: {
    horizontal: 'border-b border-gray-200 dark:border-gray-700',
    vertical: 'border-r border-gray-200 dark:border-gray-700',
    decorative: 'border-b border-dashed border-gray-300 dark:border-gray-600',
    gradient: 'h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'
  },

  // Scroll areas
  scroll: {
    thin: 'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent',
    hide: 'scrollbar-none',
    modern: 'scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent'
  },
  
  // Status indicators
  status: {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-secondary-500',
    away: 'bg-yellow-500',
  },
  
  // Innovative backgrounds
  backgrounds: {
    subtle: 'bg-gray-50 dark:bg-gray-900',
    muted: 'bg-gray-100 dark:bg-gray-800',
    highlight: 'bg-primary-50 dark:bg-primary-900/40',
    active: 'bg-gray-200 dark:bg-gray-700',
    gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
    noise: 'bg-noise-light dark:bg-noise-dark',
    glass: 'bg-white/10 dark:bg-gray-900/30 backdrop-filter backdrop-blur-md',
    mesh: 'bg-mesh-light dark:bg-mesh-dark',
  },

  // Layout sections
  layout: {
    sidebar: 'w-64 fixed top-0 left-0 h-screen z-30 transition-all duration-300',
    sidebarCollapsed: 'w-16 fixed top-0 left-0 h-screen z-30 transition-all duration-300',
    main: 'ml-64 transition-all duration-300',
    mainWithCollapsedSidebar: 'ml-16 transition-all duration-300',
    topNavFixed: 'fixed top-0 right-0 left-64 z-20 transition-all duration-300',
    topNavWithCollapsedSidebar: 'fixed top-0 right-0 left-16 z-20 transition-all duration-300',
    pageContent: 'pt-16 p-6',
  },

  // Shadows
  shadows: {
    light: 'shadow-md',
    dark: 'shadow-lg',
    hover: 'hover:shadow-lg',
    soft: 'shadow-[0_5px_15px_rgba(0,0,0,0.05)]',
    inner: 'shadow-inner',
    highlight: 'shadow-[0_0_15px_rgba(0,230,195,0.3)]'
  },
  
  // Universal Dropdown styling
  dropdown: {
    container: 'relative mx-5',
    trigger: 'flex items-center w-full px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
    menu: 'absolute z-20 w-full min-w-[180px] mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-filter backdrop-blur-sm',
    item: 'px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer transition-colors duration-150 flex items-center',
    itemActive: 'px-4 py-2.5 text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 cursor-pointer transition-colors duration-150 flex items-center',
    divider: 'my-1 border-t border-gray-100 dark:border-gray-700',
    icon: 'w-5 h-5 ml-auto',
    chevron: 'w-5 h-5 ml-2 text-gray-400 dark:text-gray-500 transition-transform duration-200',
    chevronOpen: 'transform rotate-180',
    labelWithIcon: 'flex items-center',
    itemIcon: 'w-4 h-4 mr-2 text-gray-400 dark:text-gray-500',
    itemText: 'truncate'
  }
};
