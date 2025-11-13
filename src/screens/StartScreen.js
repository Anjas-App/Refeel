import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getDailyAffirmation } from '../data/affirmations';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
  const { user, subscriptionStatus, getTrialDaysRemaining } = useAuth();
  const { theme } = useTheme();
  const [affirmation, setAffirmation] = useState('');
  const styles = createStyles(theme);

  useEffect(() => {
    setAffirmation(getDailyAffirmation());
  }, []);

  const handleStartPress = () => {
    navigation.navigate('MainTabs');
  };

  const renderSubscriptionBadge = () => {
    if (subscriptionStatus === 'trial') {
      const daysRemaining = getTrialDaysRemaining();
      return (
        <View style={styles.subscriptionBadge}>
          <Text style={styles.subscriptionText}>
            Trial: {daysRemaining} Tage verbleibend
          </Text>
        </View>
      );
    } else if (subscriptionStatus === 'pro') {
      return (
        <View style={[styles.subscriptionBadge, { backgroundColor: theme.colors.success }]}>
          <Text style={styles.subscriptionText}>Pro Mitglied</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        {renderSubscriptionBadge()}
        
        <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo.png')}
            />
          </View>
          <Text style={styles.tagline}>Dein Begleiter für innere Balance</Text>

        <View style={styles.affirmationContainer}>
          <Text style={styles.affirmationLabel}>Deine heutige Affirmation:</Text>
          <View style={styles.affirmationCard}>
            <Text style={styles.affirmationText}>"{affirmation}"</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.accent]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Jetzt starten</Text>
              <Ionicons 
                name="arrow-forward" 
                size={24} 
                color="white" 
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}
          >{user?.name || 'Liebe Seele'}! 
          </Text>
          <Text style={styles.subtitleText}>
            Wie fühlst du dich heute?
          </Text>
        </View>
      </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2fadd'
  },
  scrollView: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  subscriptionBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    zIndex: 1,
  },
  subscriptionText: {
    color: 'white',
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.medium,
  },
  logoContainer: {
    flex:1,
    marginTop: 60,
    alignItems:'center',
  },
  tagline: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,  
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  affirmationContainer: {
    marginBottom: height * 0.08,
  },
  affirmationLabel: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  affirmationCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  affirmationText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: height * 0.06,
  },
  startButton: {
    width: width * 0.7,
    height: 60,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
  },
  buttonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.regular,
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  buttonIcon: {
    marginLeft: theme.spacing.xs,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitleText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

export default StartScreen;
