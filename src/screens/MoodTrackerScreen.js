import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoodTrackerScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme, getMoodColor } = useTheme();
  const styles = createStyles(theme);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodEmojis = {
    1: '😢', 2: '😞', 3: '😕', 4: '😐', 5: '😊',
    6: '😄', 7: '😁', 8: '🤗', 9: '😍', 10: '🥰'
  };

  const moodLabels = {
    1: 'Sehr schlecht', 2: 'Schlecht', 3: 'Nicht so gut', 4: 'Okay', 5: 'Neutral',
    6: 'Gut', 7: 'Sehr gut', 8: 'Großartig', 9: 'Fantastisch', 10: 'Perfekt'
  };

  const empathicResponses = [
    "Es ist okay, wie du dich fühlst.",
    "Atme einmal tief ein und aus.",
    "Ich bin bei dir.",
    "Deine Gefühle sind wichtig und richtig.",
    "Du bist nicht allein mit dem, was du fühlst.",
    "Jeder Tag ist ein neuer Anfang.",
    "Du machst das großartig.",
    "Sei liebevoll zu dir selbst.",
    "Es ist mutig, ehrlich zu sich selbst zu sein.",
    "Du verdienst Mitgefühl - besonders von dir selbst."
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const getRandomEmpathicResponse = () => {
    return empathicResponses[Math.floor(Math.random() * empathicResponses.length)];
  };

  const saveMoodEntry = async () => {
    if (!selectedMood) {
      Alert.alert('Stimmung wählen', 'Bitte wähle deine aktuelle Stimmung aus.');
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const moodEntry = {
        date: today,
        mood: selectedMood,
        note: moodNote,
        timestamp: new Date().toISOString(),
      };

      // Get existing mood entries
      const existingEntries = await AsyncStorage.getItem('moodEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      
      // Add new entry
      entries.push(moodEntry);
      
      // Save back to storage
      await AsyncStorage.setItem('moodEntries', JSON.stringify(entries));

      // Show empathic response
      const response = getRandomEmpathicResponse();
      Alert.alert(
        'Danke für dein Vertrauen',
        response,
        [
          {
            text: 'Weiter',
            onPress: () => navigation.navigate('DailyImpulse')
          }
        ]
      );

    } catch (error) {
      console.error('Error saving mood entry:', error);
      Alert.alert('Fehler', 'Dein Eintrag konnte nicht gespeichert werden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMoodScale = () => {
    return (
      <View style={styles.moodScale}>
        <Text style={styles.scaleLabel}>Wie fühlst du dich gerade?</Text>
        <View style={styles.scaleContainer}>
          {[...Array(10)].map((_, index) => {
            const moodValue = index + 1;
            const isSelected = selectedMood === moodValue;
            
            return (
              <TouchableOpacity
                key={moodValue}
                style={[
                  styles.moodButton,
                  { backgroundColor: getMoodColor(moodValue) },
                  isSelected && styles.selectedMoodButton
                ]}
                onPress={() => handleMoodSelect(moodValue)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{moodEmojis[moodValue]}</Text>
                <Text style={styles.moodNumber}>{moodValue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedMood && (
          <Text style={styles.selectedMoodLabel}>
            {moodLabels[selectedMood]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={styles.gradient}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tägliches Check-in</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.introContainer}>
              <Ionicons 
                name="heart" 
                size={40} 
                color={theme.colors.primary} 
                style={styles.heartIcon}
              />
              <Text style={styles.introText}>
                Nimm dir einen Moment Zeit für dich. Wie geht es dir heute wirklich?
              </Text>
            </View>

            {renderMoodScale()}

            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Was beschäftigt dich gerade?</Text>
              <Text style={styles.noteSubLabel}>(Optional)</Text>
              <TextInput
                style={styles.noteInput}
                borderColor={'#74b98f'}
                borderWidth={1}
                placeholder="Schreib es auf und lass es los.."
                placeholderTextColor={theme.colors.textLight}
                value={moodNote}
                onChangeText={setMoodNote}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedMood && styles.disabledButton
              ]}
              onPress={saveMoodEntry}
              disabled={!selectedMood || isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedMood 
                    ? [theme.colors.primary, theme.colors.accent]
                    : [theme.colors.textLight, theme.colors.textLight]
                }
                style={styles.buttonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Speichere...' : 'Eintrag speichern'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
            style={styles.moodNavLink}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.navLinkText}>Zu deinen Einträgen →</Text>
          </TouchableOpacity>
          </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
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
  introContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  heartIcon: {
    marginBottom: theme.spacing.md,
  },
  introText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  moodScale: {
    marginBottom: theme.spacing.xl,
  },
  scaleLabel: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  scaleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  moodButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.xs,
    ...theme.shadows.small,
  },
  selectedMoodButton: {
    transform: [{ scale: 1.1 }],
    ...theme.shadows.medium,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodNumber: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textDark,
    marginTop: 2,
  },
  selectedMoodLabel: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  noteContainer: {
    marginBottom: theme.spacing.xl,
    borderColor: theme.colors.textLight,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  moodNavLink: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  navLinkText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  noteLabel: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  noteSubLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  noteInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    minHeight: 100,
    ...theme.shadows.small,
  },
  submitButton: {
    height: 46,
    width: '80%',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  submitButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
  },
});

export default MoodTrackerScreen;
