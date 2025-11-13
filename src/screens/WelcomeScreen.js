import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} // Make sure to add your logo to assets
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Dein persönlicher Begleiter für Selbstreflexion, emotionale Balance und innere Entwicklung.
        </Text>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Was dich erwartet:</Text>
          {[
            'Tägliches Stimmungs-Check-in',
            'Persönliche Reflexionsfragen',
            'Empathische Begleitung',
            'Stimmungsverlauf & Einsichten'
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.navLink}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.navLinkText}>Bereits registriert? → Anmelden</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('MoodTracker')}
      >
        <Text style={styles.buttonText}>Jetzt starten</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f2fadd',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#f2fadd',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 4,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  content: {
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555753',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderColor: '#74b98f',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#555753',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Using a green color similar to the original
    marginRight: 12,
  },
  featureText: {
    color: '#555753',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#74b98f', // Purple color from your gradient
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink:{
    marginTop: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  navLink: {
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  navLinkText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;