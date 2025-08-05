import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`px-4 py-2 rounded-lg ${
        isDarkMode 
          ? 'bg-dark-700 border border-dark-600' 
          : 'bg-primary-100 border border-primary-200'
      }`}
    >
      <Text className={`text-sm font-medium ${
        isDarkMode ? 'text-dark-100' : 'text-primary-800'
      }`}>
        {isDarkMode ? '🌙 Dark' : '☀️ Light'}
      </Text>
    </TouchableOpacity>
  );
};

export default ThemeToggle;

