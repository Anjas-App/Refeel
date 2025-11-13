import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Google Auth setup (IDs aus app.json -> expo.extra.google)
  const googleExtra = Constants.expoConfig?.extra?.google || {};
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: googleExtra.iosClientId,
    androidClientId: googleExtra.androidClientId,
    webClientId: googleExtra.webClientId,
    expoClientId: googleExtra.expoClientId,
    scopes: ['profile', 'email'],
  });

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Fehler', 'Bitte fülle alle Felder aus.');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Fehler', 'Bitte gib deinen Namen ein.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate authentication - in a real app, you'd call your backend
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: email.trim(),
        name: isLogin ? 'Willkommen zurück' : name.trim(),
        authMethod: 'email'
      };

      await login(userData);
    } catch (error) {
      Alert.alert('Fehler', 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      Alert.alert('Fehler', 'Google-Anmeldung fehlgeschlagen.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const completeLogin = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
          });
          const profile = await res.json();

          const userData = {
            id: profile.sub,
            email: profile.email,
            name: profile.name || profile.given_name || 'Google Nutzer',
            authMethod: 'google',
            picture: profile.picture,
          };
          await login(userData);
        } catch (e) {
          Alert.alert('Fehler', 'Google-Profil konnte nicht geladen werden.');
        } finally {
          setIsLoading(false);
        }
      } else if (response?.type === 'error' || response?.type === 'dismiss') {
        setIsLoading(false);
      }
    };

    completeLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleAppleAuth = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Nicht verfügbar', 'Apple-Anmeldung ist nur auf iOS verfügbar.');
      return;
    }
    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const nameParts = [];
      if (credential.fullName?.givenName) nameParts.push(credential.fullName.givenName);
      if (credential.fullName?.familyName) nameParts.push(credential.fullName.familyName);

      const userData = {
        id: credential.user,
        email: credential.email || 'unknown@appleid.com',
        name: nameParts.join(' ').trim() || 'Apple Nutzer',
        authMethod: 'apple',
      };

      await login(userData);
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') {
        // User canceled sign-in, just ignore
      } else {
        Alert.alert('Fehler', 'Apple-Anmeldung fehlgeschlagen.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons 
                name="heart" 
                size={60} 
                color={theme.colors.primary} 
              />
            </View>
            <Text style={styles.logoText}>Refeel</Text>
            <Text style={styles.tagline}>
              {isLogin ? 'Willkommen zurück' : 'Beginne deine Reise zu dir selbst'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggle]}
                onPress={() => setIsLogin(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                  Anmelden
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                onPress={() => setIsLogin(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                  Registrieren
                </Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color={theme.colors.textLight} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Dein Name"
                  placeholderTextColor={theme.colors.textLight}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={theme.colors.textLight} />
              <TextInput
                style={styles.textInput}
                placeholder="E-Mail"
                placeholderTextColor={theme.colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={theme.colors.textLight} />
              <TextInput
                style={styles.textInput}
                placeholder="Passwort"
                placeholderTextColor={theme.colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleEmailAuth}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                style={styles.buttonGradient}
              >
                <Text style={styles.authButtonText}>
                  {isLoading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Registrieren')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oder</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleAuth}
              disabled={isLoading || !request}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color={theme.colors.text} />
              <Text style={styles.socialButtonText}>Mit Google fortfahren</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleAuth}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
                <Text style={styles.socialButtonText}>Mit Apple fortfahren</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Mit der Anmeldung stimmst du unseren{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.linkText}>Nutzungsbedingungen</Text>
              </TouchableOpacity>{' '}und der{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                <Text style={styles.linkText}>Datenschutzerklärung</Text>
              </TouchableOpacity>
              zu.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  activeToggleText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  textInput: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  authButton: {
    height: 56,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  authButtonText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.textLight,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginHorizontal: theme.spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  socialButtonText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
