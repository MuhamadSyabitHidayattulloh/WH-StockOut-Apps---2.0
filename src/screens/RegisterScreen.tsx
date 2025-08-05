import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { 
  checkNpk, 
  getCompanies, 
  getPlants, 
  registerNewUser, 
  updateUserRole 
} from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';
import { Company, Plant, RegistrationData } from '../types';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ 
  onBackToLogin, 
  onRegistrationSuccess 
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    userID: '',
    password: '',
    name: '',
    company: '',
    plant: '',
    buCode: '',
    email: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [npkExists, setNpkExists] = useState<boolean | null>(null);
  const [checkingNpk, setCheckingNpk] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (formData.company) {
      loadPlants(formData.company);
    } else {
      setPlants([]);
      setFormData(prev => ({ ...prev, plant: '' }));
    }
  }, [formData.company]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await getCompanies();
      if (response.success && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadPlants = async (companyCode: string) => {
    setLoadingPlants(true);
    try {
      const response = await getPlants(companyCode);
      if (response.success && response.data) {
        setPlants(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load plants');
    } finally {
      setLoadingPlants(false);
    }
  };

  const handleCheckNpk = async () => {
    if (!formData.userID.trim()) {
      Alert.alert('Error', 'Please enter NPK/User ID');
      return;
    }

    setCheckingNpk(true);
    try {
      const response = await checkNpk(formData.userID);
      if (response.success) {
        if (response.data === 'userExisted') {
          setNpkExists(true);
          Alert.alert(
            'User Exists',
            'This NPK already exists. Would you like to update the role?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Update Role', onPress: handleUpdateRole },
            ]
          );
        } else {
          setNpkExists(false);
          Alert.alert('Success', 'NPK is available for registration');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check NPK');
    } finally {
      setCheckingNpk(false);
    }
  };

  const handleUpdateRole = async () => {
    setLoading(true);
    try {
      const response = await updateUserRole(formData.userID);
      if (response.success) {
        if (response.data === 'updated') {
          Alert.alert('Success', 'User role updated successfully');
          onRegistrationSuccess();
        } else {
          Alert.alert('Error', 'Failed to update user role');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.userID.trim()) {
      Alert.alert('Error', 'Please enter NPK/User ID');
      return;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter password');
      return;
    }
    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.company) {
      Alert.alert('Error', 'Please select a company');
      return;
    }
    if (!formData.plant) {
      Alert.alert('Error', 'Please select a plant');
      return;
    }
    if (!formData.buCode.trim()) {
      Alert.alert('Error', 'Please enter BU Code');
      return;
    }

    if (npkExists === null) {
      Alert.alert('Error', 'Please check NPK availability first');
      return;
    }

    if (npkExists === true) {
      Alert.alert('Error', 'NPK already exists. Use update role instead.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerNewUser(formData);
      if (response.success) {
        if (response.data === 'addedNewUser') {
          Alert.alert('Success', 'Registration successful!', [
            { text: 'OK', onPress: onRegistrationSuccess }
          ]);
        } else {
          Alert.alert('Error', 'Failed to register user');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'userID') {
      setNpkExists(null);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-dark-900' : 'bg-primary-50'}`}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f0f9ff'}
      />
      
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="items-center my-8">
          <Text className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>
            Register
          </Text>
          <Text className={`text-lg ${
            isDarkMode ? 'text-dark-400' : 'text-primary-600'
          }`}>
            Create your WH StockOut account
          </Text>
        </View>

        {/* Registration Form */}
        <View className={`p-6 rounded-2xl shadow-lg mb-6 ${
          isDarkMode ? 'bg-dark-800 border border-dark-700' : 'bg-white border border-primary-200'
        }`}>
          
          {/* NPK/User ID */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              NPK/User ID *
            </Text>
            <View className="flex-row">
              <TextInput
                value={formData.userID}
                onChangeText={(value) => updateFormData('userID', value)}
                placeholder="Enter your NPK/User ID"
                placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                className={`flex-1 px-4 py-3 rounded-lg border text-base mr-2 ${
                  isDarkMode 
                    ? 'bg-dark-700 border-dark-600 text-dark-100' 
                    : 'bg-primary-50 border-primary-300 text-primary-900'
                }`}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleCheckNpk}
                disabled={checkingNpk}
                className={`px-4 py-3 rounded-lg ${
                  checkingNpk ? 'bg-gray-400' : 'bg-primary-600'
                }`}
              >
                {checkingNpk ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-medium">Check</Text>
                )}
              </TouchableOpacity>
            </View>
            {npkExists !== null && (
              <Text className={`text-sm mt-1 ${
                npkExists ? 'text-accent-red' : 'text-accent-green'
              }`}>
                {npkExists ? 'NPK already exists' : 'NPK available'}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Password *
            </Text>
            <TextInput
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              placeholder="Enter password"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              secureTextEntry
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Confirm Password *
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              secureTextEntry
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Full Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter your full name"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Email (Optional)
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          {/* Company */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Company *
            </Text>
            {loadingCompanies ? (
              <View className="py-3">
                <ActivityIndicator color={isDarkMode ? '#64748b' : '#94a3b8'} />
              </View>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {companies.map((company) => (
                  <TouchableOpacity
                    key={company.company_code}
                    onPress={() => updateFormData('company', company.company_code)}
                    className={`px-4 py-2 rounded-lg mr-2 border ${
                      formData.company === company.company_code
                        ? (isDarkMode ? 'bg-primary-600 border-primary-600' : 'bg-primary-600 border-primary-600')
                        : (isDarkMode ? 'bg-dark-700 border-dark-600' : 'bg-primary-50 border-primary-300')
                    }`}
                  >
                    <Text className={`text-sm ${
                      formData.company === company.company_code
                        ? 'text-white'
                        : (isDarkMode ? 'text-dark-200' : 'text-primary-800')
                    }`}>
                      {company.company_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Plant */}
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              Plant *
            </Text>
            {loadingPlants ? (
              <View className="py-3">
                <ActivityIndicator color={isDarkMode ? '#64748b' : '#94a3b8'} />
              </View>
            ) : plants.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {plants.map((plant) => (
                  <TouchableOpacity
                    key={plant.plant_code}
                    onPress={() => updateFormData('plant', plant.plant_code)}
                    className={`px-4 py-2 rounded-lg mr-2 border ${
                      formData.plant === plant.plant_code
                        ? (isDarkMode ? 'bg-primary-600 border-primary-600' : 'bg-primary-600 border-primary-600')
                        : (isDarkMode ? 'bg-dark-700 border-dark-600' : 'bg-primary-50 border-primary-300')
                    }`}
                  >
                    <Text className={`text-sm ${
                      formData.plant === plant.plant_code
                        ? 'text-white'
                        : (isDarkMode ? 'text-dark-200' : 'text-primary-800')
                    }`}>
                      {plant.plant_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text className={`text-sm ${
                isDarkMode ? 'text-dark-400' : 'text-primary-600'
              }`}>
                {formData.company ? 'No plants available' : 'Select a company first'}
              </Text>
            )}
          </View>

          {/* BU Code */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              BU Code *
            </Text>
            <TextInput
              value={formData.buCode}
              onChangeText={(value) => updateFormData('buCode', value)}
              placeholder="Enter BU Code"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              className={`px-4 py-3 rounded-lg border text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className={`py-4 rounded-lg mb-4 ${
              loading 
                ? (isDarkMode ? 'bg-dark-600' : 'bg-primary-300')
                : (isDarkMode ? 'bg-primary-600' : 'bg-primary-600')
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={onBackToLogin}
            className="py-3"
          >
            <Text className={`text-center ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <View className="items-center mb-8">
          <ThemeToggle />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

