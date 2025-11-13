import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free'); // 'free', 'trial', 'pro'
  const [trialStartDate, setTrialStartDate] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const subscription = await AsyncStorage.getItem('subscriptionStatus');
      const trialStart = await AsyncStorage.getItem('trialStartDate');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (subscription) {
        setSubscriptionStatus(subscription);
      }
      if (trialStart) {
        setTrialStartDate(new Date(trialStart));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Check if user has used trial before (fraud protection)
      const deviceId = await getDeviceId();
      const hasUsedTrial = await checkTrialUsage(deviceId);
      
      if (!hasUsedTrial) {
        // First time user - offer trial
        setSubscriptionStatus('trial');
        const trialStart = new Date();
        setTrialStartDate(trialStart);
        await AsyncStorage.setItem('subscriptionStatus', 'trial');
        await AsyncStorage.setItem('trialStartDate', trialStart.toISOString());
        await markTrialUsed(deviceId);
      } else {
        // Returning user - default to free
        setSubscriptionStatus('free');
        await AsyncStorage.setItem('subscriptionStatus', 'free');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setSubscriptionStatus('free');
      setTrialStartDate(null);
      await AsyncStorage.multiRemove(['user', 'subscriptionStatus', 'trialStartDate']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getDeviceId = async () => {
    try {
      let deviceId = await SecureStore.getItemAsync('deviceId');
      if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await SecureStore.setItemAsync('deviceId', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return 'fallback-device-id';
    }
  };

  const checkTrialUsage = async (deviceId) => {
    try {
      const usedTrial = await SecureStore.getItemAsync(`trial_used_${deviceId}`);
      return usedTrial === 'true';
    } catch (error) {
      console.error('Error checking trial usage:', error);
      return false;
    }
  };

  const markTrialUsed = async (deviceId) => {
    try {
      await SecureStore.setItemAsync(`trial_used_${deviceId}`, 'true');
    } catch (error) {
      console.error('Error marking trial as used:', error);
    }
  };

  const upgradeToProSubscription = async () => {
    try {
      setSubscriptionStatus('pro');
      await AsyncStorage.setItem('subscriptionStatus', 'pro');
    } catch (error) {
      console.error('Error upgrading to pro:', error);
      throw error;
    }
  };

  const checkTrialExpiry = () => {
    if (subscriptionStatus === 'trial' && trialStartDate) {
      const now = new Date();
      const trialEnd = new Date(trialStartDate);
      trialEnd.setDate(trialEnd.getDate() + 7); // 7 days trial
      
      if (now > trialEnd) {
        // Trial expired, downgrade to free
        setSubscriptionStatus('free');
        AsyncStorage.setItem('subscriptionStatus', 'free');
        return true;
      }
    }
    return false;
  };

  const getTrialDaysRemaining = () => {
    if (subscriptionStatus === 'trial' && trialStartDate) {
      const now = new Date();
      const trialEnd = new Date(trialStartDate);
      trialEnd.setDate(trialEnd.getDate() + 7);
      
      const diffTime = trialEnd - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return 0;
  };

  const hasFeatureAccess = (feature) => {
    if (subscriptionStatus === 'pro' || subscriptionStatus === 'trial') {
      return true;
    }
    
    // Free features
    const freeFeatures = ['moodCheckin', 'moodHistory', 'workbook', 'workbookHistory', 'dailyImpulse'];
    return freeFeatures.includes(feature);
  };

  const value = {
    user,
    isLoading,
    subscriptionStatus,
    trialStartDate,
    login,
    logout,
    upgradeToProSubscription,
    checkTrialExpiry,
    getTrialDaysRemaining,
    hasFeatureAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
