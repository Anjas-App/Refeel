# Refeel - Persönlicher Begleiter für Selbstreflexion

Eine React Native/Expo App für emotionale Balance und innere Entwicklung.

## 🌸 Features

### ✅ Implementiert
- **Startscreen** mit täglichen Affirmationen
- **Mood Tracker** mit 1-10 Skala und Notizen
- **Tägliche Impulse** für Selbstreflexion
- **Workbook** mit thematischen Reflexionsbereichen
- **Stille Momente** - Meditationen (Pro Feature)
- **Verlauf** mit Kalender-Visualisierung
- **Profil** mit Einstellungen und Abonnements
- **Aya AI Chat** - Empathische KI-Begleitung (Pro Feature)
- **Authentifizierung** (Email, Google, Apple)
- **Abonnement-System** (Free/Trial/Pro)

### 🎨 Design
- Sanfte Pastellfarben (Lavendel, Salbeigrün, Hellbeige)
- Montserrat Schriftart
- Runde Ecken und beruhigendes Design
- Responsive Layout

## 🚀 Installation

1. **Abhängigkeiten installieren:**
```bash
cd Refeel
npm install
```

2. **OpenAI API Key konfigurieren:**
   - Öffne `src/screens/AyaChatScreen.js`
   - Ersetze `YOUR_OPENAI_API_KEY_HERE` mit deinem echten API Key

3. **App starten:**
```bash
npm start
```

## 📱 Abonnement-Modell

### Free
- Mood Check-in
- Mood History
- Workbook
- Workbook History
- Daily Impulse

### Trial (7 Tage)
- Alle Features
- Automatischer Schutz vor Betrug

### Pro (8,99€/Monat)
- Alle Features
- Meditationen
- Aya AI Chat
- Erweiterte Statistiken

## 🔧 Technische Details

### Architektur
- **React Native** mit Expo
- **AsyncStorage** für lokale Datenspeicherung
- **SecureStore** für sensible Daten
- **OpenAI API** für Aya Chat
- **React Navigation** für Navigation

### Ordnerstruktur
```
src/
├── components/          # Wiederverwendbare Komponenten
├── contexts/           # React Contexts (Auth, etc.)
├── data/              # Statische Daten (Affirmationen, etc.)
├── navigation/        # Navigation Setup
├── screens/           # App Screens
├── services/          # API Services
├── styles/            # Theme und Styles
└── utils/             # Utility Funktionen
```

### Datenspeicherung
- **Mood Entries**: `AsyncStorage.moodEntries`
- **Impulse Responses**: `AsyncStorage.impulseEntries`
- **Workbook Answers**: `AsyncStorage.workbook_[section]`
- **Chat History**: `AsyncStorage.ayaChatHistory`
- **User Preferences**: `AsyncStorage.userPreferences`

## 🔐 Sicherheit & Datenschutz

- Lokale Datenspeicherung (keine Cloud-Synchronisation)
- Verschlüsselte Speicherung sensibler Daten
- Betrugsschutz für Trial-Accounts
- Keine Weitergabe persönlicher Daten

## 🎯 Verwendung

1. **Registrierung/Anmeldung** mit Email, Google oder Apple
2. **Tägliches Check-in** mit Mood Tracker
3. **Reflexion** durch Daily Impulse
4. **Vertiefung** im Workbook
5. **Entspannung** mit Meditationen (Pro)
6. **Unterstützung** durch Aya AI Chat (Pro)

## 🔮 Zukünftige Features

- Push-Benachrichtigungen für Erinnerungen
- Datenexport/Import
- Erweiterte Statistiken und Insights
- Community Features
- Weitere Meditationskategorien

## 🤝 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- E-Mail an support@refeel.app

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

**Refeel** - Dein Begleiter für innere Balance 🌸
