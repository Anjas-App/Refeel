import React from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import { meditations, getMeditationsByCategory } from '../data/meditations';
import { useAuth } from '../contexts/AuthContext';

const MeditationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { hasFeatureAccess } = useAuth();

  const categories = [
    {
      key: 'beruhigung',
      title: 'Beruhigung',
      subtitle: 'Finde innere Ruhe',
      icon: 'leaf',
      color: theme.colors.secondary,
      gradient: [theme.colors.secondary + '30', theme.colors.secondary + '10']
    },
    {
      key: 'selbstmitgefuehl',
      title: 'Selbstmitgefühl',
      subtitle: 'Sei liebevoll zu dir',
      icon: 'heart',
      color: theme.colors.primary,
      gradient: [theme.colors.primary + '30', theme.colors.primary + '10']
    },
    {
      key: 'loslassen',
      title: 'Loslassen',
      subtitle: 'Lass Belastendes ziehen',
      icon: 'cloud',
      color: theme.colors.accent,
      gradient: [theme.colors.accent + '30', theme.colors.accent + '10']
    }
  ];

  const renderCategoryCard = ({ item }) => {
    const categoryMeditations = getMeditationsByCategory(item.key);
    
    if (!hasFeatureAccess('meditation')) {
      return (
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#CCCCCC30', '#CCCCCC10']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#CCCCCC' }]}>
                <Ionicons name="lock-closed" size={30} color="white" />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.categoryTitle, { color: theme.colors.textLight }]}>
                  {item.title}
                </Text>
                <Text style={styles.categorySubtitle}>Pro Feature</Text>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={theme.colors.textLight} 
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('MeditationDetail', { 
          category: item.key, 
          categoryTitle: item.title,
          categoryColor: item.color 
        })}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons 
                name={item.icon} 
                size={30} 
                color="white" 
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
              <Text style={styles.meditationCount}>
                {categoryMeditations.length} Meditationen
              </Text>
            </View>
            
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={theme.colors.textLight} 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Stille Momente</Text>
          <Text style={styles.headerSubtitle}>
            Kurze Meditationen für deine innere Balance
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introContainer}>
            <View style={styles.introIconContainer}>
              <Ionicons 
                name="leaf" 
                size={40} 
                color={theme.colors.secondary} 
              />
            </View>
            <Text style={styles.introText}>
              Gönn dir eine Pause vom Alltag. Schon wenige Minuten können einen großen Unterschied machen.
            </Text>
          </View>

          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <Ionicons 
                name="bulb" 
                size={20} 
                color={theme.colors.secondary} 
              />
              <Text style={styles.tipTitle}>Meditationstipp</Text>
            </View>
            <Text style={styles.tipText}>
              Suche dir einen ruhigen Ort, setze Kopfhörer auf und lass dich von den Worten leiten. Es gibt kein richtig oder falsch - nur deine Erfahrung.
            </Text>
          </View>

          {!hasFeatureAccess('meditation') && (
            <View style={styles.upgradeContainer}>
              <View style={styles.upgradeContent}>
                <Ionicons 
                  name="star" 
                  size={30} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.upgradeTitle}>Erweitere deine Praxis</Text>
                <Text style={styles.upgradeText}>
                  Erhalte Zugang zu allen Meditationen und begleite dich selbst liebevoll durch den Tag.
                </Text>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => navigation.navigate('Profile')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.accent]}
                    style={styles.upgradeButtonGradient}
                  >
                    <Text style={styles.upgradeButtonText}>Pro werden</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.regular,
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
  introContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  introIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  introText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingBottom: theme.spacing.lg,
  },
  categoryCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  cardGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  categorySubtitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  meditationCount: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
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
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  upgradeContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  upgradeContent: {
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  upgradeText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  upgradeButton: {
    width: '100%',
    height: 48,
    borderRadius: theme.borderRadius.md,
  },
  upgradeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  upgradeButtonText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
  },
});

export default MeditationScreen;
