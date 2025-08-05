import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useTheme } from '../context/ThemeContext';
import { GenerateOneWayKanban } from '../utils/GenerateOneWayKanban';
import { submitStockOutData } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';
import { StockOutItem, User } from '../types';

interface WOInstructionScreenProps {
  user: User;
  onLogout: () => void;
}

const WOInstructionScreen: React.FC<WOInstructionScreenProps> = ({ user, onLogout }) => {
  const [data, setData] = useState<StockOutItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDuplicateKanban, setModalDuplicateKanban] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrongQR, setWrongQR] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const value = await AsyncStorage.getItem('stockOutData');
      if (value !== null) {
        setData(JSON.parse(value));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const generateSlipNumber = () => {
    const prefix = 'F';
    const date = new Date();
    const dateStr =
      date.getFullYear().toString().slice(-1) +
      date.getDate().toString().padStart(2, '0') +
      (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return prefix + dateStr + random;
  };

  const generateProcessId = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `ST${year}${month}${date}${hours}${minutes}${seconds}`;
  };

  const handleScanIntent = async (qrData: string) => {
    if (qrData.length === 30) {
      const oneWayKanbanQR = new GenerateOneWayKanban(qrData);
      const currentData = JSON.parse(await AsyncStorage.getItem('stockOutData') || '[]');

      if (currentData.some((item: StockOutItem) => item.imgData === qrData)) {
        showModalDuplicateKanban();
        return;
      }

      const newData: StockOutItem = {
        imgData: qrData,
        timeScan: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        NPK: user.USERID,
        partNumber: oneWayKanbanQR.getPartNumber(),
        qty: oneWayKanbanQR.getQtyPerKanban(),
        processId: generateProcessId(),
      };

      const updatedData = [newData, ...currentData];
      await AsyncStorage.setItem('stockOutData', JSON.stringify(updatedData));
      setData(updatedData);
    } else {
      showWrongQR();
    }
  };

  const handleSubmitData = async () => {
    if (data.length > 0) {
      setLoading(true);
      const slip = generateSlipNumber();
      
      try {
        const response = await submitStockOutData(data, slip);
        
        if (response.success) {
          await AsyncStorage.removeItem('stockOutData');
          setData([]);
          Alert.alert('Success', 'Data submitted successfully!');
        } else {
          Alert.alert('Error', response.message || 'Failed to submit data');
        }
      } catch (error) {
        Alert.alert('Error', 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Warning', 'No data to submit!');
    }
  };

  const showModalDuplicateKanban = () => {
    setModalDuplicateKanban(true);
    Vibration.vibrate(1000);
  };

  const showWrongQR = () => {
    Vibration.vibrate(1000);
    setWrongQR(true);
    setTimeout(() => {
      setWrongQR(false);
    }, 2000);
  };

  const resetData = async () => {
    if (password === '0000') {
      await AsyncStorage.removeItem('stockOutData');
      setData([]);
      setModalVisible(false);
      setPassword('');
      Alert.alert('Success', 'Data reset successfully!');
    } else {
      setModalVisible(false);
      setPassword('');
      Alert.alert('Error', 'Wrong password!');
    }
  };

  const simulateQRScan = () => {
    // Simulate QR scan for testing
    const testQR = '1234567890ABCDEFGHIJ1234567890';
    handleScanIntent(testQR);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-dark-900' : 'bg-primary-50'}`}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f0f9ff'}
      />

      {/* Header */}
      <View className={`px-6 py-4 border-b ${
        isDarkMode ? 'border-dark-700 bg-dark-800' : 'border-primary-200 bg-white'
      }`}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className={`text-xl font-bold ${
              isDarkMode ? 'text-dark-100' : 'text-primary-900'
            }`}>
              Scan Kanban untuk Stockout
            </Text>
            <Text className={`text-sm ${
              isDarkMode ? 'text-dark-400' : 'text-primary-600'
            }`}>
              Welcome, {user.USERNAME}
            </Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <ThemeToggle />
            <TouchableOpacity
              onPress={onLogout}
              className={`px-3 py-2 rounded-lg ${
                isDarkMode ? 'bg-accent-red' : 'bg-accent-red'
              }`}
            >
              <Text className="text-white text-sm font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center mt-3">
          <Text className={`text-lg font-semibold ${
            isDarkMode ? 'text-dark-200' : 'text-primary-800'
          }`}>
            Count: {data.length}
          </Text>
        </View>
      </View>

      {/* Table Header */}
      <View className={`mx-6 mt-4 rounded-t-lg overflow-hidden ${
        isDarkMode ? 'bg-dark-800' : 'bg-white'
      }`}>
        <View className={`flex-row py-3 px-4 ${
          isDarkMode ? 'bg-dark-700' : 'bg-primary-100'
        }`}>
          <Text className={`flex-1 text-center font-semibold ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>No</Text>
          <Text className={`flex-[3] text-center font-semibold ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>Part Number</Text>
          <Text className={`flex-1 text-center font-semibold ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>Qty</Text>
          <Text className={`flex-1 text-center font-semibold ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>User</Text>
        </View>
      </View>

      {/* Table Content */}
      <ScrollView className="flex-1 mx-6">
        <View className={`rounded-b-lg overflow-hidden ${
          isDarkMode ? 'bg-dark-800' : 'bg-white'
        }`}>
          {data.map((item, index) => (
            <View 
              key={index} 
              className={`flex-row py-3 px-4 border-b ${
                isDarkMode ? 'border-dark-700' : 'border-primary-100'
              }`}
            >
              <Text className={`flex-1 text-center ${
                isDarkMode ? 'text-dark-200' : 'text-primary-800'
              }`}>{index + 1}</Text>
              <Text className={`flex-[3] text-center ${
                isDarkMode ? 'text-dark-200' : 'text-primary-800'
              }`}>{item.partNumber}</Text>
              <Text className={`flex-1 text-center ${
                isDarkMode ? 'text-dark-200' : 'text-primary-800'
              }`}>{item.qty}</Text>
              <Text className={`flex-1 text-center ${
                isDarkMode ? 'text-dark-200' : 'text-primary-800'
              }`}>{item.NPK}</Text>
            </View>
          ))}
          
          {data.length === 0 && (
            <View className="py-8">
              <Text className={`text-center ${
                isDarkMode ? 'text-dark-400' : 'text-primary-600'
              }`}>
                No data available. Start scanning to add items.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 space-y-3">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={simulateQRScan}
            className="flex-1 py-4 rounded-lg bg-primary-600"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Scan by Camera
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmitData}
            disabled={loading}
            className={`flex-1 py-4 rounded-lg ${
              loading ? 'bg-accent-green/50' : 'bg-accent-green'
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? 'Submitting...' : 'Selesai Belanja'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="py-4 rounded-lg bg-accent-red"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Reset Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reset Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`m-6 p-6 rounded-2xl ${
            isDarkMode ? 'bg-dark-800' : 'bg-white'
          }`}>
            <Text className={`text-xl font-bold mb-4 text-center ${
              isDarkMode ? 'text-dark-100' : 'text-primary-900'
            }`}>
              Enter Password
            </Text>
            
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter reset password"
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              secureTextEntry
              className={`px-4 py-3 rounded-lg border mb-6 ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setPassword('');
                }}
                className="flex-1 py-3 rounded-lg bg-gray-500"
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={resetData}
                className="flex-1 py-3 rounded-lg bg-accent-red"
              >
                <Text className="text-white text-center font-semibold">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Duplicate Kanban Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDuplicateKanban}
        onRequestClose={() => setModalDuplicateKanban(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`m-6 p-6 rounded-2xl items-center ${
            isDarkMode ? 'bg-dark-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold mb-4 text-center ${
              isDarkMode ? 'text-dark-100' : 'text-primary-900'
            }`}>
              ⚠️ DUPLICATE KANBAN
            </Text>
            
            <Text className={`text-center mb-6 ${
              isDarkMode ? 'text-dark-300' : 'text-primary-700'
            }`}>
              This kanban has already been scanned!
            </Text>
            
            <TouchableOpacity
              onPress={() => setModalDuplicateKanban(false)}
              className="px-6 py-3 rounded-lg bg-primary-600"
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Wrong QR Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={wrongQR}
        onRequestClose={() => setWrongQR(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold mb-4">❌</Text>
            <Text className="text-white text-xl font-bold">QR Code Invalid</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WOInstructionScreen;

