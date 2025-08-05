import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WOInstructionScreen from './src/screens/WOInstructionScreen';
import { User } from './src/types';
import './global.css';

type AppState = 'login' | 'register' | 'main';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userDataLogin');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setCurrentScreen('main');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('main');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDataLogin');
      setUser(null);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleRegistrationSuccess = () => {
    setCurrentScreen('login');
  };

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider>
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onRegister={handleRegister}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen 
          onBackToLogin={handleBackToLogin}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
      {currentScreen === 'main' && user && (
        <WOInstructionScreen 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </ThemeProvider>
  );
};

export default App;
