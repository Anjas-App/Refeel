import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getDailyImpulse } from '../data/dailyImpulses';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyImpulseScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [impulse, setImpulse] = useState('');
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setImpulse(getDailyImpulse());
  }, []);

  const saveImpulseResponse = async () => {
    if (!response.trim()) {
      Alert.alert('Antwort eingeben', 'Möchtest du deine Gedanken zu dieser Frage teilen?');
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const impulseEntry = {
        date: today,
        question: impulse,
        response: response,
        timestamp: new Date().toISOString(),
      };

      const existingEntries = await AsyncStorage.getItem('impulseEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      
      entries.push(impulseEntry);
      await AsyncStorage.setItem('impulseEntries', JSON.stringify(entries));

      Alert.alert(
        'Danke für deine Offenheit',
        'Deine Gedanken wurden gespeichert. Selbstreflexion ist ein wichtiger Schritt auf deinem Weg.',
        [
          {
            text: 'Zum Workbook',
            onPress: () => navigation.navigate('Workbook')
          },
          {
            text: 'Zurück zum Start',
            onPress: () => navigation.navigate('Start')
          }
        ]
      );

    } catch (error) {
      console.error('Error saving impulse response:', error);
      Alert.alert('Fehler', 'Deine Antwort konnte nicht gespeichert werden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipImpulse = () => {
    navigation.navigate('Start');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Impuls des Tages</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.impulseContainer}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="bulb" 
                  size={40} 
                  color={theme.colors.primary} 
                />
              </View>
              
              <Text style={styles.impulseLabel}>Deine heutige Reflexionsfrage:</Text>
              
              <View style={styles.impulseCard}>
                <Text style={styles.impulseText}>"{impulse}"</Text>
              </View>
            </View>

            <View style={styles.responseContainer}>
              <Text style={styles.responseLabel}>Deine Gedanken dazu:</Text>
              <Text style={styles.responseSubLabel}>
                Nimm dir bewusst etwas Zeit und lasse deinen Tag Revue passieren
              </Text>
              
              <TextInput
                style={styles.responseInput}W
                placeholder="Deine Gedanken..."
                placeholderTextColor={theme.colors.textLight}
                value={response}
                onChangeText={setResponse}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveImpulseResponse}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.accent]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isSubmitting ? 'Speichere...' : 'Gedanken speichern'}
                  </Text>
                  <Ionicons 
                    name="heart" 
                    size={20} 
                    color="white" 
                    style={styles.buttonIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipImpulse}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Später reflektieren</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.encouragementContainer}>
              <Text style={styles.encouragementText}>
                💝 Jede Reflexion bringt dich näher zu dir selbst
              </Text>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  impulseContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#f1fadd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  impulseLabel: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  impulseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    ...theme.shadows.small,
  },
  impulseText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  responseContainer: {
    marginBottom: theme.spacing.xl,
  },
  responseLabel: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  responseSubLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
    fontStyle: 'italic',
  },
  responseInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    minHeight: 150,
    ...theme.shadows.small,
    borderColor: '#74b98f',
    borderWidth: 1,
  },
  buttonContainer: {
    marginBottom: theme.spacing.lg,
  },
  saveButton: {
    height: 56,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  saveButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  buttonIcon: {
    marginLeft: theme.spacing.xs,
  },
  skipButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.textLight,
  },
  skipButtonText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  encouragementContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  encouragementText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DailyImpulseScreen;
