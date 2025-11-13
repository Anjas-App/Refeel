import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllWorkbookSections } from '../data/workbookQuestions';

const WorkbookHistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState({});

  const workbookSections = getAllWorkbookSections();

  const iconMap = {
    heart: 'heart',
    leaf: 'leaf',
    mirror: 'person',
    people: 'people'
  };

  const getSectionData = (sectionKey) => {
    return workbookSections.find(section => section.key === sectionKey);
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await AsyncStorage.getItem('workbookHistory');
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        // Sort by timestamp, newest first
        const sortedHistory = parsedHistory.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setHistory(sortedHistory);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading workbook history:', error);
      Alert.alert('Fehler', 'Die Workbook-Historie konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = (entryIndex) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryIndex]: !prev[entryIndex]
    }));
  };

  const deleteEntry = async (entryIndex) => {
    Alert.alert(
      'Eintrag löschen',
      'Möchtest du diesen Workbook-Eintrag wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedHistory = history.filter((_, index) => index !== entryIndex);
              await AsyncStorage.setItem('workbookHistory', JSON.stringify(updatedHistory));
              setHistory(updatedHistory);
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Fehler', 'Der Eintrag konnte nicht gelöscht werden.');
            }
          }
        }
      ]
    );
  };

  const renderHistoryEntry = ({ item, index }) => {
    const sectionData = getSectionData(item.section);
    const isExpanded = expandedEntries[index];
    
    if (!sectionData) return null;

    const answeredQuestions = Object.entries(item.responses || {})
      .filter(([_, answer]) => answer && answer.trim().length > 0);

    return (
      <View style={styles.entryCard}>
        <LinearGradient
          colors={[sectionData.color + '15', sectionData.color + '08']}
          style={styles.entryGradient}
        >
          <TouchableOpacity
            style={styles.entryHeader}
            onPress={() => toggleExpanded(index)}
            activeOpacity={0.7}
          >
            <View style={styles.entryHeaderLeft}>
              <View style={[styles.entryIcon, { backgroundColor: sectionData.color }]}>
                <Ionicons 
                  name={iconMap[sectionData.icon] || 'book'} 
                  size={20} 
                  color="white" 
                />
              </View>
              <View style={styles.entryInfo}>
                <Text style={styles.entryTitle}>{item.sectionTitle}</Text>
                <Text style={styles.entryDate}>{formatDate(item.timestamp)}</Text>
                <Text style={styles.entryStats}>
                  {answeredQuestions.length} von {sectionData.questions.length} Fragen beantwortet
                </Text>
              </View>
            </View>
            <View style={styles.entryActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteEntry(index)}
              >
                <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
              </TouchableOpacity>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.textLight} 
              />
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.entryContent}>
              {answeredQuestions.map(([questionId, answer]) => {
                const question = sectionData.questions.find(q => q.id === questionId);
                if (!question) return null;

                return (
                  <View key={questionId} style={styles.questionAnswer}>
                    <Text style={styles.questionText}>{question.question}</Text>
                    <Text style={styles.answerText}>{answer}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Gesamte Historie löschen',
      'Möchtest du wirklich alle Workbook-Einträge löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Alle löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('workbookHistory');
              setHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Fehler', 'Die Historie konnte nicht gelöscht werden.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Lade deine Workbook-Historie...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Workbook-Historie</Text>
            <Text style={styles.headerSubtitle}>
              {history.length} {history.length === 1 ? 'Eintrag' : 'Einträge'}
            </Text>
          </View>

          {history.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearAllHistory}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons 
                name="book-outline" 
                size={60} 
                color={theme.colors.textLight} 
              />
            </View>
            <Text style={styles.emptyTitle}>Noch keine Einträge</Text>
            <Text style={styles.emptyText}>
              Deine Workbook-Reflexionen werden hier gespeichert, sobald du deine erste Reflexion abschließt.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Workbook')}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Erste Reflexion starten</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryEntry}
            keyExtractor={(item, index) => `${item.section}-${item.timestamp}-${index}`}
            style={styles.historyList}
            contentContainerStyle={styles.historyContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    height: 56,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  startButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  startButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
    marginRight: theme.spacing.sm,
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  entryCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  entryGradient: {
    borderRadius: theme.borderRadius.lg,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  entryDate: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  entryStats: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  entryContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  questionAnswer: {
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  questionText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  answerText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default WorkbookHistoryScreen;
