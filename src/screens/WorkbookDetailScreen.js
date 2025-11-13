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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkbookDetailScreen = ({ route, navigation }) => {
  const { section } = route.params;
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadExistingResponses();
  }, []);

  const loadExistingResponses = async () => {
    try {
      const existingResponses = await AsyncStorage.getItem(`workbook_${section.key}`);
      if (existingResponses) {
        setResponses(JSON.parse(existingResponses));
      }
    } catch (error) {
      console.error('Error loading existing responses:', error);
    }
  };

  const handleResponseChange = (questionId, text) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const saveResponses = async () => {
    const filledResponses = Object.values(responses).filter(response => response?.trim());
    
    if (filledResponses.length === 0) {
      Alert.alert('Keine Antworten', 'Möchtest du mindestens eine Frage beantworten?');
      return;
    }

    setIsSubmitting(true);

    try {
      const workbookEntry = {
        section: section.key,
        sectionTitle: section.title,
        responses: responses,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };

      // Save individual section responses
      await AsyncStorage.setItem(`workbook_${section.key}`, JSON.stringify(responses));

      // Save to history
      const existingHistory = await AsyncStorage.getItem('workbookHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(workbookEntry);
      await AsyncStorage.setItem('workbookHistory', JSON.stringify(history));

      Alert.alert(
        'Reflexion gespeichert',
        'Deine Gedanken wurden gespeichert. Du kannst jederzeit zurückkehren und deine Antworten erweitern.',
        [
          {
            text: 'Weitere Reflexion',
            onPress: () => navigation.navigate('Workbook')
          },
          {
            text: 'Fertig',
            onPress: () => navigation.navigate('WorkbookHistory')
          }
        ]
      );

    } catch (error) {
      console.error('Error saving workbook responses:', error);
      Alert.alert('Fehler', 'Deine Antworten konnten nicht gespeichert werden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconMap = {
    heart: 'heart',
    leaf: 'leaf',
    mirror: 'person',
    people: 'people'
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
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <View style={[styles.headerIcon, { backgroundColor: section.color }]}>
                <Ionicons 
                  name={iconMap[section.icon] || 'book'} 
                  size={24} 
                  color="white" 
                />
              </View>
              <Text style={styles.headerTitle}>{section.title}</Text>
            </View>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.introContainer}>
            <Text style={styles.introText}>
              Nimm dir Zeit für diese Fragen. Jede Antwort ist ein Schritt zu tieferem Selbstverständnis.
            </Text>
          </View>

          {section.questions.map((question, index) => (
            <View key={question.id} style={styles.questionContainer}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>{index + 1}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
              </View>
              
              <TextInput
                style={styles.answerInput}
                placeholder={question.placeholder}
                placeholderTextColor={theme.colors.textLight}
                value={responses[question.id] || ''}
                onChangeText={(text) => handleResponseChange(question.id, text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveResponses}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[section.color, section.color + 'CC']}
              style={styles.buttonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? 'Speichere...' : 'Reflexion speichern'}
              </Text>
              <Ionicons 
                name="heart" 
                size={20} 
                color="white" 
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.encouragementContainer}>
            <Text style={styles.encouragementText}>
              💝 Jede ehrliche Antwort bringt dich näher zu dir selbst
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  introContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  introText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  questionContainer: {
    marginBottom: theme.spacing.xl,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  questionNumber: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  questionText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  answerInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    minHeight: 100,
    ...theme.shadows.small,
  },
  saveButton: {
    height: 56,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  saveButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
  },
  buttonIcon: {
    marginLeft: theme.spacing.xs,
  },
  encouragementContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  encouragementText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WorkbookDetailScreen;
