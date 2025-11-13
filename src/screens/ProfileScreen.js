import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const { 
    user, 
    logout, 
    subscriptionStatus, 
    upgradeToProSubscription, 
    getTrialDaysRemaining
  } = useAuth();
  
  const { theme, currentTheme, changeTheme, themeOptions } = useTheme();
  const styles = createStyles(theme);
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        setReminderEnabled(parsed.reminderEnabled || false);
        setReminderTime(parsed.reminderTime || '20:00');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveUserPreferences = async (newPreferences) => {
    try {
      const currentPreferences = await AsyncStorage.getItem('userPreferences');
      const preferences = currentPreferences ? JSON.parse(currentPreferences) : {};
      
      const updatedPreferences = { ...preferences, ...newPreferences };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleReminderToggle = (value) => {
    setReminderEnabled(value);
    saveUserPreferences({ reminderEnabled: value });
  };

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  const handleUpgradeToPro = () => {
    Alert.alert(
      'Upgrade zu Pro',
      'Möchtest du zu Refeel Pro für 8,99€/Monat upgraden? Du erhältst Zugang zu allen Features inkl. Meditationen und Aya AI Chat.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Upgraden', 
          onPress: async () => {
            try {
              await upgradeToProSubscription();
              Alert.alert('Willkommen bei Pro!', 'Du hast jetzt Zugang zu allen Features.');
            } catch (error) {
              Alert.alert('Fehler', 'Upgrade konnte nicht durchgeführt werden.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchtest du dich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Abmelden', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const getSubscriptionBadge = () => {
    switch (subscriptionStatus) {
      case 'trial':
        return {
          text: `Trial (${getTrialDaysRemaining()} Tage)`,
          color: theme.colors.warning,
          icon: 'time'
        };
      case 'pro':
        return {
          text: 'Pro Mitglied',
          color: theme.colors.success,
          icon: 'star'
        };
      default:
        return {
          text: 'Free',
          color: theme.colors.textLight,
          icon: 'person'
        };
    }
  };

  const subscriptionBadge = getSubscriptionBadge();


  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <Text style={styles.headerSubtitle}>
            Deine persönlichen Einstellungen
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Section */}
          <View style={styles.section}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={theme.colors.primary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'Liebe Seele'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'Nicht angemeldet'}</Text>
              </View>
              <View style={[styles.subscriptionBadge, { backgroundColor: subscriptionBadge.color }]}>
                <Ionicons name={subscriptionBadge.icon} size={16} color="white" />
                <Text style={styles.subscriptionText}>{subscriptionBadge.text}</Text>
              </View>
            </View>
          </View>

          {/* Subscription Section */}
          {subscriptionStatus !== 'pro' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Abonnement</Text>
              <TouchableOpacity
                style={styles.upgradeCard}
                onPress={handleUpgradeToPro}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                  style={styles.upgradeCardGradient}
                >
                  <View style={styles.upgradeContent}>
                    <Ionicons name="star" size={30} color={theme.colors.primary} />
                    <View style={styles.upgradeText}>
                      <Text style={styles.upgradeTitle}>Upgrade zu Pro</Text>
                      <Text style={styles.upgradeSubtitle}>
                        8,99€/Monat - Alle Features freischalten
                      </Text>
                      <Text style={styles.upgradeFeatures}>
                        ✓ Meditationen ✓ Aya AI Chat ✓ Erweiterte Statistiken
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App-Design</Text>
            <Text style={styles.sectionSubtitle}>Wähle deine Lieblingsfarbe</Text>
            
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.themeOption,
                    currentTheme === option.key && styles.selectedThemeOption
                  ]}
                  onPress={() => handleThemeChange(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.themeColor, { backgroundColor: option.color }]} />
                  <Text style={styles.themeName}>{option.name}</Text>
                  {currentTheme === option.key && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Erinnerungen</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Tägliche Erinnerung</Text>
                <Text style={styles.settingSubtitle}>
                  Erhalte eine sanfte Erinnerung für dein Check-in
                </Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ false: theme.colors.textLight, true: theme.colors.primary }}
                thumbColor="white"
              />
            </View>

            {reminderEnabled && (
              <TouchableOpacity style={styles.timeSelector} activeOpacity={0.7}>
                <Ionicons name="time" size={20} color={theme.colors.primary} />
                <Text style={styles.timeText}>Erinnerung um {reminderTime}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>Hilfe & FAQ</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Ionicons name="mail" size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>Kontakt</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Ionicons name="document-text" size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>Datenschutz</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          </View>

          {/* Logout Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out" size={24} color={theme.colors.error} />
              <Text style={styles.logoutText}>Abmelden</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userDetails: {
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
    lineBreakStrategyIOS: 'simple',
    includeFontPadding: false,
  },
  userName: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  subscriptionText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: 'white',
    marginLeft: theme.spacing.xs,
  },
  upgradeCard: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  upgradeCardGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  upgradeText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  upgradeTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  upgradeSubtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  upgradeFeatures: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
  },
  themeOptions: {
    gap: theme.spacing.sm,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  selectedThemeOption: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  themeColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.spacing.md,
  },
  themeName: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  timeText: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  menuItemText: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
  },
  logoutText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;
