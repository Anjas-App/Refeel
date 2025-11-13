export const theme = {
  colors: {
    primary: '#B8A9D9', // Lavendel
    secondary: '#A8C09A', // Salbeigrün
    tertiary: '#F5F1E8', // Hellbeige
    background: '#F2FADD',
    surface: '#F9F7F4',
    accent: '#E8D5E8',
    text: '#4A4A4A',
    textLight: '#7A7A7A',
    textDark: '#2A2A2A',
    success: '#A8C09A',
    warning: '#F4D03F',
    error: '#E8A5A5',
    moodColors: {
      1: '#E8A5A5', // Sehr schlecht - Rot
      2: '#F0B7A4', // Schlecht - Orange-Rot
      3: '#F4D03F', // Nicht so gut - Gelb
      4: '#E8D5A3', // Okay - Hellgelb
      5: '#D4E8D4', // Neutral - Hellgrün
      6: '#C4E0C4', // Gut - Grün
      7: '#A8C09A', // Sehr gut - Salbeigrün
      8: '#9BB8E8', // Großartig - Hellblau
      9: '#B8A9D9', // Fantastisch - Lavendel
      10: '#D9A9D9' // Perfekt - Pink-Lavendel
    }
  },
  fonts: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semiBold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
    script: 'AlexBrush_400Regular'
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 10,
    }
  }
};

export const getMoodColor = (moodValue) => {
  return theme.colors.moodColors[moodValue] || theme.colors.primary;
};
