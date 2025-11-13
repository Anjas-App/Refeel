import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseTheme = {
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

const themeVariants = {
  lavender: {
    primary: '#B8A9D9',
    secondary: '#A8C09A',
    tertiary: '#F5F1E8',
    background: '#F2FADD',
    surface: '#F9F7F4',
    accent: '#E8D5E8',
  },
  sage: {
    primary: '#A8C09A',
    secondary: '#B8A9D9',
    tertiary: '#E8F5E8',
    background: '#F0F8E8',
    surface: '#F5F9F2',
    accent: '#D5E8D5',
  },
  beige: {
    primary: '#D4B896',
    secondary: '#C4A484',
    tertiary: '#F5F1E8',
    background: '#FAF7F0',
    surface: '#F9F6F1',
    accent: '#E8E0D5',
  }
};

const commonColors = {
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
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('lavender');
  const [theme, setTheme] = useState({
    ...baseTheme,
    colors: {
      ...themeVariants.lavender,
      ...commonColors
    }
  });

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (currentTheme) {
      updateTheme(currentTheme);
    }
  }, [currentTheme]);

  const loadTheme = async () => {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        const savedTheme = parsed.selectedTheme || 'lavender';
        setCurrentTheme(savedTheme);
      } else {
        setCurrentTheme('lavender');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setCurrentTheme('lavender');
    }
  };

  const updateTheme = (themeName) => {
    const themeColors = themeVariants[themeName] || themeVariants.lavender;
    
    const newTheme = {
      ...baseTheme,
      colors: {
        ...themeColors,
        ...commonColors
      }
    };

    setTheme(newTheme);
  };

  const changeTheme = async (themeName) => {
    try {
      setCurrentTheme(themeName);
      
      // Save to AsyncStorage
      const currentPreferences = await AsyncStorage.getItem('userPreferences');
      const preferences = currentPreferences ? JSON.parse(currentPreferences) : {};
      const updatedPreferences = { ...preferences, selectedTheme: themeName };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const getMoodColor = (moodValue) => {
    return theme?.colors?.moodColors?.[moodValue] || theme?.colors?.primary || '#B8A9D9';
  };


  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      changeTheme, 
      getMoodColor,
      themeOptions: [
        { key: 'lavender', name: 'Lavendel', color: themeVariants.lavender.primary },
        { key: 'sage', name: 'Salbei', color: themeVariants.sage.primary },
        { key: 'beige', name: 'Beige', color: themeVariants.beige.primary }
      ]
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Backward compatibility - export default theme for components that haven't been updated yet
export const theme = {
  ...baseTheme,
  colors: {
    ...themeVariants.lavender,
    ...commonColors
  }
};

export const getMoodColor = (moodValue) => {
  return theme.colors.moodColors[moodValue] || theme.colors.primary;
};
