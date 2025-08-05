import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { loginUser, loginUserQr } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';
import QRScanScreen from './QRScanScreen';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { isDarkMode } = useTheme();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(username, password);
      
      if (response.success && response.data) {
        const userData: User = {
          USERNAME: response.data.USERNAME || username,
          USERID: response.data.USERID || username,
          plant_code: response.data.plant_code,
          token: response.data.token,
        };
        
        await AsyncStorage.setItem('userDataLogin', JSON.stringify(userData));
        onLogin(userData);
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRLogin = async (qrData: string) => {
    setShowQRScanner(false);
    setLoading(true);
    
    try {
      const response = await loginUserQr(qrData);
      
      if (response.success && response.data) {
        const userData: User = {
          USERNAME: response.data.name || response.data.username,
          USERID: response.data.username,
          plant_code: response.data.plant_code,
          token: response.data.token,
        };
        
        await AsyncStorage.setItem('userDataLogin', JSON.stringify(userData));
        onLogin(userData);
      } else {
        Alert.alert('QR Login Failed', response.message || 'Invalid QR code');
      }
    } catch (error) {
      Alert.alert('Error', 'QR login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showQRScanner) {
    return (
      <QRScanScreen
        onScanResult={handleQRLogin}
        onClose={() => setShowQRScanner(false)}
        scanType="qr"
        title="Scan QR for Login"
      />
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-dark-900' : 'bg-primary-50'}`}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f0f9ff'}
      />
      
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>
            WH StockOut
          </Text>
          <Text className={`text-lg ${
            isDarkMode ? 'text-dark-400' : 'text-primary-600'
          }`}>
            Warehouse Management System
          </Text>
        </View>

        {/* Login Form */}
        <View className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white border border-primary-200'
        }`}>
          <Text className={`text-xl font-semibold mb-6 text-center ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>
            Sign In
          </Text>

          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              secureTextEntry
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`py-4 rounded-lg mb-4 ${
              loading 
                ? (isDarkMode ? 'bg-dark-600' : 'bg-primary-300')
                : (isDarkMode ? 'bg-primary-600' : 'bg-primary-600')
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* QR Login Button */}
          <TouchableOpacity
            onPress={() => setShowQRScanner(true)}
            disabled={loading}
            className={`py-4 rounded-lg mb-4 border ${
              isDarkMode 
                ? 'border-primary-600 bg-dark-800' 
                : 'border-primary-600 bg-primary-50'
            }`}
          >
            <View className="flex-row justify-center items-center">
              <Text className="text-2xl mr-2">📱</Text>
              <Text className={`text-lg font-semibold ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>
                Login with QR Code
              </Text>
            </View>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            onPress={onRegister}
            className="py-3"
          >
            <Text className={`text-center ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <View className="items-center mt-8">
          <ThemeToggle />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

