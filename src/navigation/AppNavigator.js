import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import StartScreen from '../screens/StartScreen';
import MoodTrackerScreen from '../screens/MoodTrackerScreen';
import DailyImpulseScreen from '../screens/DailyImpulseScreen';
import WorkbookScreen from '../screens/WorkbookScreen';
import MeditationScreen from '../screens/MeditationScreen';
import HistoryScreen from '../screens/MoodHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AyaChatScreen from '../screens/AyaChatScreen';
import AuthScreen from '../screens/AuthScreen';
import WorkbookDetailScreen from '../screens/WorkbookDetailScreen';
import WorkbookHistoryScreen from '../screens/WorkbookHistoryScreen';
import MeditationDetailScreen from '../screens/MeditationDetailScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import { useAuth } from '../contexts/AuthContext';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MeditationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MeditationMain" component={MeditationScreen} />
    <Stack.Screen name="MeditationDetail" component={MeditationDetailScreen} />
  </Stack.Navigator>
);

const MoodHistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MoodHistoryMain" component={MoodTrackerScreen} />
    <Stack.Screen name="MoodHistoryDetail" component={MoodHistoryScreen} />
  </Stack.Navigator>
);

const WorkbookStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Workbook" component={WorkbookScreen} />
    <Stack.Screen name="WorkbookDetail" component={WorkbookDetailScreen} />
    <Stack.Screen name="WorkbookHistory" component={WorkbookHistoryScreen} />
  </Stack.Navigator>
);

const MainTabs = ({ navigation }) => {
  const { hasFeatureAccess } = useAuth();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MoodTracker') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'DailyImpulse') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Meditation') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Workbook') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Aya') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.medium,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: theme.fonts.semiBold,
          color: theme.colors.text,
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16, padding: 8 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen 
        name="MoodTracker" 
        component={MoodTrackerScreen}
        options={{ 
          tabBarLabel: 'Check-in',
          headerTitle: 'Mood Check-in'
        }}
      />
      <Tab.Screen 
        name="DailyImpulse" 
        component={DailyImpulseScreen}
        options={{ 
          tabBarLabel: 'Impuls',
          headerTitle: 'Täglicher Impuls'
        }}
      />
      <Tab.Screen 
        name="Meditation" 
        component={MeditationStack}
        options={{ 
          tabBarLabel: 'Meditation',
          headerTitle: 'Stille Momente',
          tabBarStyle: hasFeatureAccess('meditation') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="Workbook" 
        component={WorkbookScreen}
        options={{ 
          tabBarLabel: 'Workbook',
          headerTitle: 'Workbook',
          tabBarStyle: hasFeatureAccess('WorkbookDetailScreen') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="Aya" 
        component={AyaChatScreen}
        options={{ 
          tabBarLabel: 'Aya',
          headerTitle: 'Aya Chat',
          tabBarStyle: hasFeatureAccess('ayaChat') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
};

const TabNavigator = () => {
  const { hasFeatureAccess } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MoodTracker') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'DailyImpulse') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Meditation') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Workbook') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'AyaChat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.medium,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: theme.fonts.semiBold,
          color: theme.colors.text,
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16, padding: 8 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={StartScreen} options={{ tabBarLabel: 'Home', headerTitle: 'Refeel' }} />
      <Tab.Screen name="MoodTracker" 
      component={MoodTrackerScreen} 
      options={{ tabBarLabel: 'Check-in',
      headerTitle: 'Tägliches Check-in',
      tabBarStyle: hasFeatureAccess('MoodTrackerScreen') ? {
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.surface,
        paddingBottom: 8,
        paddingTop: 8,
        height: 70,
      } : { display: 'none' }
      }} />
      <Tab.Screen name="DailyImpulse" component={DailyImpulseScreen} options={{ tabBarLabel: 'Impulse', headerTitle: 'Täglicher Impuls' }} />
      <Tab.Screen name="History"
      component={MoodHistoryScreen}
      options={{ tabBarLabel: 'Verlauf', headerTitle: 'Mein Verlauf',
      tabBarStyle: hasFeatureAccess('MoodHistoryScreen, MoodTrackerScreen') ? {
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.surface,
        paddingBottom: 8,
        paddingTop: 8,
        height: 70,
      } : { display: 'none' }
      }} />
      <Tab.Screen 
        name="Meditation" 
        component={MeditationScreen} 
        options={{
          tabBarLabel: 'Meditation',
          headerTitle: 'Stille Momente',
          tabBarStyle: hasFeatureAccess('meditation') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="Workbook" 
        component={WorkbookStack} 
        options={{
          tabBarLabel: 'Workbook',
          headerTitle: 'Workbook',
          tabBarStyle: hasFeatureAccess('WorkbookDetailScreen, WorkbookHistoryScreen, WorkbookScreen') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="AyaChat" 
        component={AyaChatScreen} 
        options={{
          tabBarLabel: 'Aya',
          headerTitle: 'Aya Chat',
          tabBarStyle: hasFeatureAccess('ayaChat') ? {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surface,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          } : { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Workbook" component={WorkbookScreen} />
            <Stack.Screen name="WorkbookDetail" component={WorkbookDetailScreen} />
            <Stack.Screen name="WorkbookHistory" component={WorkbookHistoryScreen} />
            <Stack.Screen name="History" component={MoodHistoryScreen} />
            <Stack.Screen 
              name="Terms" 
              component={TermsScreen} 
              options={{ headerShown: true, headerTitle: 'Nutzungsbedingungen' }} 
            />
            <Stack.Screen 
              name="Privacy" 
              component={PrivacyScreen} 
              options={{ headerShown: true, headerTitle: 'Datenschutzerklärung' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen 
              name="Terms" 
              component={TermsScreen} 
              options={{ headerShown: true, headerTitle: 'Nutzungsbedingungen' }} 
            />
            <Stack.Screen 
              name="Privacy" 
              component={PrivacyScreen} 
              options={{ headerShown: true, headerTitle: 'Datenschutzerklärung' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
