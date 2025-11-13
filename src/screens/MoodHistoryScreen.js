import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoodHistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { getMoodColor } = useTheme();
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const entries = await AsyncStorage.getItem('moodEntries');
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        setMoodEntries(parsedEntries);
        generateCalendarData(parsedEntries);
      }
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const generateCalendarData = (entries) => {
    const calendarData = {};
    
    entries.forEach(entry => {
      const date = entry.date;
      const moodColor = getMoodColor(entry.mood);
      
      calendarData[date] = {
        customStyles: {
          container: {
            backgroundColor: moodColor,
            borderRadius: 15,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
        mood: entry.mood,
        note: entry.note,
      };
    });
    
    setCalendarData(calendarData);
  };

  const getEntriesForDate = (date) => {
    return moodEntries.filter(entry => entry.date === date);
  };

  const renderMoodEntry = ({ item }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(item.mood) }]}>
          <Text style={styles.moodValue}>{item.mood}</Text>
        </View>
        <View style={styles.entryInfo}>
          <Text style={styles.entryDate}>
            {new Date(item.timestamp).toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.entryTime}>
            {new Date(item.timestamp).toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
      
      {item.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>"{item.note}"</Text>
        </View>
      )}
    </View>
  );

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <Calendar
        markingType={'custom'}
        markedDates={calendarData}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: 'white',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.textLight,
          dotColor: theme.colors.primary,
          selectedDotColor: 'white',
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text,
          indicatorColor: theme.colors.primary,
          textDayFontFamily: theme.fonts.regular,
          textMonthFontFamily: theme.fonts.semiBold,
          textDayHeaderFontFamily: theme.fonts.medium,
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateTitle}>
            {new Date(selectedDate).toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          
          {getEntriesForDate(selectedDate).map((entry, index) => (
            <View key={index} style={styles.selectedEntry}>
              <View style={[styles.selectedMoodIndicator, { backgroundColor: getMoodColor(entry.mood) }]}>
                <Text style={styles.selectedMoodValue}>{entry.mood}</Text>
              </View>
              <View style={styles.selectedEntryContent}>
                <Text style={styles.selectedEntryTime}>
                  {new Date(entry.timestamp).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                {entry.note && (
                  <Text style={styles.selectedEntryNote}>"{entry.note}"</Text>
                )}
              </View>
            </View>
          ))}
          
          {getEntriesForDate(selectedDate).length === 0 && (
            <Text style={styles.noEntryText}>Keine Einträge für diesen Tag</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderListView = () => (
    <FlatList
      data={moodEntries.slice().reverse()}
      renderItem={renderMoodEntry}
      keyExtractor={(item, index) => `${item.date}-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );

  const getMoodStats = () => {
    if (moodEntries.length === 0) return null;
    
    const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = (totalMood / moodEntries.length).toFixed(1);
    const lastWeekEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });
    
    return {
      average: averageMood,
      total: moodEntries.length,
      lastWeek: lastWeekEntries.length
    };
  };

  const stats = getMoodStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Verlauf</Text>
          <Text style={styles.headerSubtitle}>
            Deine emotionale Reise im Überblick
          </Text>
        </View>

        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.average}</Text>
              <Text style={styles.statLabel}>Durchschnitt</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Einträge</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.lastWeek}</Text>
              <Text style={styles.statLabel}>Diese Woche</Text>
            </View>
          </View>
        )}

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
            onPress={() => setViewMode('calendar')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="calendar" 
              size={20} 
              color={viewMode === 'calendar' ? 'white' : theme.colors.textLight} 
            />
            <Text style={[
              styles.toggleText, 
              viewMode === 'calendar' && styles.activeToggleText
            ]}>
              Kalender
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? 'white' : theme.colors.textLight} 
            />
            <Text style={[
              styles.toggleText, 
              viewMode === 'list' && styles.activeToggleText
            ]}>
              Liste
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {moodEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="calendar-outline" 
                size={60} 
                color={theme.colors.textLight} 
              />
              <Text style={styles.emptyTitle}>Noch keine Einträge</Text>
              <Text style={styles.emptyText}>
                Beginne mit deinem ersten Mood-Check-in, um deine emotionale Reise zu verfolgen.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('MoodTracker')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.accent]}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Jetzt starten</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            viewMode === 'calendar' ? renderCalendarView() : renderListView()
          )}
        </View>
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  activeToggleText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  calendarContainer: {
    flex: 1,
  },
  calendar: {
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  selectedDateContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.small,
  },
  selectedDateTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  selectedEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  selectedMoodIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  selectedMoodValue: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.bold,
    color: 'white',
  },
  selectedEntryContent: {
    flex: 1,
  },
  selectedEntryTime: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  selectedEntryNote: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  noEntryText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  entryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  moodIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  moodValue: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: 'white',
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  entryTime: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  noteContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  noteText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
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
    width: 200,
    height: 48,
    borderRadius: theme.borderRadius.md,
  },
  startButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  startButtonText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
  },
});

export default MoodHistoryScreen;
