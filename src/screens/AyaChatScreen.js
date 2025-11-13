import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenAI } from 'openai';

const client = new OpenAI();
const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [
    {role: 'system', content: 'Du bist Aya, eine empathische, vertrauensvolle und ruhige KI-Begleiterin für emotionale Unterstützung und Selbstreflexion.'},
    {role: 'user', content: 'Hallo, ich bin Aya 🌸 Ich bin hier, um dich auf deinem Weg der Selbstreflexion zu begleiten. Wie geht es dir heute?'}
  ],
  max_tokens: 300,
  temperature: 0.7,
});

console.log(response.choices[0].message.content);
  

// Note: You need to add your OpenAI API key in a secure way
const OPENAI_API_KEY = ''; // Replace with your actual API key

const AyaChatScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { hasFeatureAccess } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (!hasFeatureAccess('ayaChat')) {
      return;
    }
    
    loadChatHistory();
    // Add welcome message
    setMessages([{
      id: 1,
      text: "Hallo, ich bin Aya 🌸 Ich bin hier, um dich auf deinem Weg der Selbstreflexion zu begleiten. Wie geht es dir heute?",
      isAya: true,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('ayaChatHistory');
      if (history) {
        setMessages(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem('ayaChatHistory', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isAya: false,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const ayaResponse = await getAyaResponse(inputText.trim(), messages);
      
      const ayaMessage = {
        id: Date.now() + 1,
        text: ayaResponse,
        isAya: true,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, ayaMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      
    } catch (error) {
      console.error('Error getting Aya response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Entschuldige, ich kann gerade nicht antworten. Bitte versuche es später noch einmal. 💝",
        isAya: true,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const getAyaResponse = async (userInput, conversationHistory) => {
    // If no API key is set, return a fallback response
    if (OPENAI_API_KEY === '') {
      return getEmpathicFallbackResponse(userInput);
    }

    try {
      const systemPrompt = `Du bist Aya, eine empathische, vertrauensvolle und ruhige KI-Begleiterin für emotionale Unterstützung und Selbstreflexion. 

Deine Eigenschaften:
- Du bist warmherzig, verständnisvoll und nicht wertend
- Du gibst psychologisch fundierte, aber einfühlsame Antworten
- Du ermutigst zur Selbstreflexion, ohne zu drängen
- Du verwendest eine ruhige, liebevolle Sprache
- Du bietest praktische, sanfte Unterstützung
- Du erkennst Emotionen an und validierst sie
- Du gibst keine medizinischen Diagnosen oder Behandlungsempfehlungen
- Du empfiehlst bei ernsten Problemen professionelle Hilfe

Antworte auf Deutsch in einem warmen, unterstützenden Ton. Halte deine Antworten prägnant aber herzlich.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-10).map(msg => ({
              role: msg.isAya ? 'assistant' : 'user',
              content: msg.text
            })),
            { role: 'user', content: userInput }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid response from OpenAI');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return getEmpathicFallbackResponse(userInput);
    }
  };

  const getEmpathicFallbackResponse = (userInput) => {
    const responses = [
      "Ich höre dir zu. Deine Gefühle sind wichtig und berechtigt. 💝",
      "Es ist mutig von dir, deine Gedanken zu teilen. Wie fühlst du dich dabei?",
      "Manchmal hilft es, tief durchzuatmen. Du bist nicht allein mit dem, was du fühlst.",
      "Jeder Schritt auf dem Weg der Selbstreflexion ist wertvoll. Du machst das großartig.",
      "Deine Ehrlichkeit zu dir selbst ist ein Geschenk. Was brauchst du gerade am meisten?",
      "Es ist okay, sich so zu fühlen. Welche kleine Sache könnte dir heute Freude bereiten?",
      "Du verdienst Mitgefühl - besonders von dir selbst. Wie kannst du heute liebevoll zu dir sein?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isAya ? styles.ayaMessage : styles.userMessage
      ]}
    >
      {message.isAya && (
        <View style={styles.ayaAvatar}>
          <Text style={styles.ayaAvatarText}>🌸</Text>
        </View>
      )}
      
      <View
        style={[
          styles.messageBubble,
          message.isAya ? styles.ayaBubble : styles.userBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isAya ? styles.ayaText : styles.userText
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isAya ? styles.ayaTime : styles.userTime
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    </View>
  );

  if (!hasFeatureAccess('ayaChat')) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Aya Chat</Text>
            <Text style={styles.headerSubtitle}>
              Deine empathische KI-Begleiterin
            </Text>
          </View>

          <View style={styles.lockedContainer}>
            <View style={styles.lockedContent}>
              <Ionicons name="lock-closed" size={60} color={theme.colors.textLight} />
              <Text style={styles.lockedTitle}>Pro Feature</Text>
              <Text style={styles.lockedText}>
                Aya ist deine persönliche KI-Begleiterin für emotionale Unterstützung und Selbstreflexion. 
                Sie ist warmherzig, verständnisvoll und immer für dich da.
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
          <View style={styles.headerContent}>
            <View style={styles.ayaHeaderAvatar}>
              <Text style={styles.ayaHeaderAvatarText}>🌸</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Aya</Text>
              <Text style={styles.headerSubtitle}>Deine empathische Begleiterin</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert(
                'Chat löschen',
                'Möchtest du den gesamten Chat-Verlauf löschen?',
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  { 
                    text: 'Löschen', 
                    onPress: () => {
                      setMessages([]);
                      AsyncStorage.removeItem('ayaChatHistory');
                    },
                    style: 'destructive'
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(renderMessage)}
            
            {isLoading && (
              <View style={[styles.messageContainer, styles.ayaMessage]}>
                <View style={styles.ayaAvatar}>
                  <Text style={styles.ayaAvatarText}>🌸</Text>
                </View>
                <View style={[styles.messageBubble, styles.ayaBubble]}>
                  <Text style={styles.loadingText}>Aya schreibt...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Schreibe Aya eine Nachricht..."
              placeholderTextColor={theme.colors.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={(!inputText.trim() || isLoading) ? theme.colors.textLight : 'white'} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ayaHeaderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  ayaHeaderAvatarText: {
    fontSize: 24,
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
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  ayaMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  ayaAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  ayaAvatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  ayaBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  ayaText: {
    color: theme.colors.text,
  },
  userText: {
    color: 'white',
  },
  messageTime: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
  },
  ayaTime: {
    color: theme.colors.textLight,
  },
  userTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  lockedContent: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  lockedTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  lockedText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  upgradeButton: {
    width: 200,
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

export default AyaChatScreen;
