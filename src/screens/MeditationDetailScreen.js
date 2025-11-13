import React, { useState, useEffect } from 'react';
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
import { useAudioPlayer } from 'expo-audio';
import { useTheme } from '../contexts/ThemeContext';
import { getMeditationsByCategory, getMeditationById } from '../data/meditations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMeditationAudio } from '../data/meditations';

const MeditationDetailScreen = ({ route, navigation }) => {
  const { category, categoryTitle, categoryColor } = route.params;
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSource, setAudioSource] = useState(null);

  const { theme } = useTheme();
  const styles = createStyles(theme);
  const meditations = getMeditationsByCategory(category);
  const player = useAudioPlayer(audioSource);

  const handlePlayPause = () => {
    if (!selectedMeditation) {
      Alert.alert('Meditation wählen', 'Bitte wähle zuerst eine Meditation aus.');
      return;
    }

    if (!audioSource) {
      Alert.alert('Audio nicht verfügbar', 'Für diese Meditation ist keine Audiodatei verfügbar.');
      return;
    }

    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error('Fehler beim Abspielen der Audio:', error);
      Alert.alert('Fehler', 'Die Audiodatei konnte nicht abgespielt werden.');
    }
  };

  const renderMeditationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.meditationItem,
        selectedMeditation?.id === item.id && styles.selectedMeditationItem
      ]}
      onPress={() => handleMeditationSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.meditationContent}>
        <View style={[styles.meditationIcon, { backgroundColor: categoryColor }]}>
          <Ionicons 
            name={selectedMeditation?.id === item.id ? 'checkmark' : 'play'} 
            size={20} 
            color="white" 
          />
        </View>
        
        <View style={styles.meditationInfo}>
          <Text style={styles.meditationTitle}>{item.title}</Text>
          <Text style={styles.meditationDuration}>{item.duration} Minuten</Text>
        </View>
        
        {selectedMeditation?.id === item.id && (
          <Ionicons 
            name="radio-button-on" 
            size={24} 
            color={categoryColor} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleMeditationSelect = async (meditation) => {
    try {
      await AsyncStorage.setItem('selectedMeditation', JSON.stringify(meditation));
      setSelectedMeditation(meditation);
      
      // Set new audio source
      const audioFile = getMeditationAudio(meditation.title);
      setAudioSource(audioFile);
    } catch (error) {
      console.error('Fehler beim Speichern der Meditation:', error);
    }
  };

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
            <View style={[styles.headerIcon, { backgroundColor: categoryColor }]}>
              <Ionicons 
                name={category === 'beruhigung' ? 'leaf' : category === 'selbstmitgefuehl' ? 'heart' : 'cloud'} 
                size={24} 
                color="white" 
              />
            </View>
            <Text style={styles.headerTitle}>{categoryTitle}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introContainer}>
            <Text style={styles.introText}>
              Wähle eine Meditation aus und lass dich von den Worten in die Ruhe führen.
            </Text>
          </View>

          <FlatList
            data={meditations}
            renderItem={renderMeditationItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.meditationsContainer}
          />

          {selectedMeditation && (
            <View style={styles.playerContainer}>
              <View style={styles.playerHeader}>
                <Text style={styles.playerTitle}>{selectedMeditation.title}</Text>
                <Text style={styles.playerDuration}>
                  {selectedMeditation.duration} Minuten Meditation
                </Text>
              </View>

              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayPause}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[categoryColor, categoryColor + 'CC']}
                  style={styles.playButtonGradient}
                >
                  <Ionicons 
                    name={player.playing ? 'pause' : 'play'} 
                    size={30} 
                    color="white" 
                  />
                  <Text style={styles.playButtonText}>
                    {player.playing ? 'Pausieren' : 'Starten'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <ScrollView style={styles.textContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.meditationText}>
                  {selectedMeditation.text}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <Ionicons 
                name="bulb" 
                size={20} 
                color={categoryColor} 
              />
              <Text style={styles.tipTitle}>Meditationstipp</Text>
            </View>
            <Text style={styles.tipText}>
              Lies den Text mit oder schließe die Augen und lass die Worte auf dich wirken. 
              Atme ruhig und erlaube dir, ganz im Moment zu sein.
            </Text>
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
  headerIcon: {
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
    marginBottom: theme.spacing.lg,
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
  meditationsContainer: {
    paddingBottom: theme.spacing.lg,
  },
  meditationItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  selectedMeditationItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  meditationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  meditationDuration: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  playerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  playerHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  playerTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  playerDuration: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  playButton: {
    height: 60,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  playButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  playButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
    marginLeft: theme.spacing.sm,
  },
  textContainer: {
    maxHeight: 300,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  meditationText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tipContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tipTitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default MeditationDetailScreen;
