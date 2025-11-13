import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PrivacyScreen = () => {
  const source = Platform.select({
    web: { uri: '/privacy.html' },
    default: require('../../privacy.html'),
  });

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={source}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
      />
    </View>
  );
};

export default PrivacyScreen;
