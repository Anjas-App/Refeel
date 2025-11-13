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
import { getAllWorkbookSections } from '../data/workbookQuestions';
import { useAuth } from '../contexts/AuthContext';

const WorkbookScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { hasFeatureAccess } = useAuth();
  const workbookSections = getAllWorkbookSections();

  const iconMap = {
    heart: 'heart',
    leaf: 'leaf',
    mirror: 'person',
    people: 'people'
  };

  const renderSectionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.sectionCard}
      onPress={() => navigation.navigate('WorkbookDetail', { section: item })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[item.color + '20', item.color + '10']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons 
              name={iconMap[item.icon] || 'book'} 
              size={30} 
              color="white" 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text style={styles.questionCount}>
              {item.questions.length} Reflexionsfragen
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workbook</Text>
          <Text style={styles.headerSubtitle}>
            Entdecke dich selbst durch gezielte Reflexion
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introContainer}>
            <View style={styles.introIconContainer}>
              <Ionicons 
                name="book" 
                size={40}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.introText}>
              Wähle einen Bereich aus, der dich heute besonders beschäftigt. 
              Jede Frage ist eine Einladung zu tieferer Selbsterkenntnis.
            </Text>
          </View>

          <FlatList
            data={workbookSections}
            renderItem={renderSectionCard}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sectionsContainer}
          />

          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <Ionicons 
                name="bulb" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={styles.tipTitle}>Tipp für deine Reflexion</Text>
            </View>
            <Text style={styles.tipText}>
              Nimm dir Zeit und sei ehrlich zu dir selbst. Es gibt keine richtigen oder falschen Antworten - nur deine persönliche Wahrheit.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.historyNavLink}
            onPress={() => navigation.navigate('WorkbookHistory')}
          > 
            <View style={styles.historyLinkContent}>
              <Ionicons 
                name="time-outline" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={styles.navLinkText}>Deine Workbook-Historie →</Text>
            </View>
          </TouchableOpacity>

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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  sectionsContainer: {
    paddingBottom: theme.spacing.lg,
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  questionCount: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
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
  historyNavLink: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  historyLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLinkText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default WorkbookScreen;
