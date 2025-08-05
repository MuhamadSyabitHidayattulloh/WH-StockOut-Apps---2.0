import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface QRScanScreenProps {
  onScanResult: (data: string) => void;
  onClose: () => void;
  scanType: 'qr' | 'kanban';
  title?: string;
}

const QRScanScreen: React.FC<QRScanScreenProps> = ({ 
  onScanResult, 
  onClose, 
  scanType,
  title 
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const { isDarkMode } = useTheme();
  const { width, height } = Dimensions.get('window');

  const handleScanResult = (data: string) => {
    if (data) {
      setIsScanning(false);
      onScanResult(data);
    }
  };

  const simulateQRScan = () => {
    // Simulate different QR codes based on scan type
    let simulatedData = '';
    
    if (scanType === 'qr') {
      // Simulate login QR data
      simulatedData = 'LOGIN_QR_DATA_SIMULATION_12345';
    } else {
      // Simulate kanban QR data (30 characters as per original app)
      simulatedData = '1234567890ABCDEFGHIJ1234567890';
    }
    
    Alert.alert(
      'Simulated Scan',
      `Scanned: ${simulatedData}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use This', onPress: () => handleScanResult(simulatedData) }
      ]
    );
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      handleScanResult(manualInput.trim());
      setShowManualInput(false);
      setManualInput('');
    } else {
      Alert.alert('Error', 'Please enter QR data');
    }
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
          <Text className={`text-xl font-bold ${
            isDarkMode ? 'text-dark-100' : 'text-primary-900'
          }`}>
            {title || (scanType === 'qr' ? 'Scan QR for Login' : 'Scan Kanban QR')}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`px-3 py-2 rounded-lg ${
              isDarkMode ? 'bg-dark-700' : 'bg-primary-100'
            }`}
          >
            <Text className={`font-medium ${
              isDarkMode ? 'text-dark-200' : 'text-primary-800'
            }`}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera View Placeholder */}
      <View className="flex-1 relative">
        {/* Camera placeholder */}
        <View className={`flex-1 justify-center items-center ${
          isDarkMode ? 'bg-dark-800' : 'bg-gray-100'
        }`}>
          <View className={`w-64 h-64 border-2 border-dashed rounded-lg justify-center items-center ${
            isDarkMode ? 'border-dark-600' : 'border-primary-300'
          }`}>
            <Text className={`text-6xl mb-4 ${
              isDarkMode ? 'text-dark-400' : 'text-primary-400'
            }`}>
              📷
            </Text>
            <Text className={`text-center px-4 ${
              isDarkMode ? 'text-dark-400' : 'text-primary-600'
            }`}>
              Camera view will appear here
            </Text>
            <Text className={`text-center px-4 mt-2 text-sm ${
              isDarkMode ? 'text-dark-500' : 'text-primary-500'
            }`}>
              Position QR code within the frame
            </Text>
          </View>
        </View>

        {/* Scanning overlay */}
        {isScanning && (
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-64 h-64 border-2 border-primary-500 rounded-lg">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
            </View>
          </View>
        )}

        {/* Instructions */}
        <View className={`absolute bottom-0 left-0 right-0 p-6 ${
          isDarkMode ? 'bg-dark-900/90' : 'bg-white/90'
        }`}>
          <Text className={`text-center mb-4 ${
            isDarkMode ? 'text-dark-200' : 'text-primary-800'
          }`}>
            {scanType === 'qr' 
              ? 'Scan your login QR code to authenticate'
              : 'Scan the kanban QR code to add item to stockout list'
            }
          </Text>

          {/* Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={simulateQRScan}
              className="py-4 rounded-lg bg-primary-600"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Simulate Scan (For Testing)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowManualInput(true)}
              className={`py-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-dark-600 bg-dark-800' 
                  : 'border-primary-300 bg-primary-50'
              }`}
            >
              <Text className={`text-center font-medium ${
                isDarkMode ? 'text-dark-200' : 'text-primary-800'
              }`}>
                Enter Manually
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Manual Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showManualInput}
        onRequestClose={() => setShowManualInput(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`m-6 p-6 rounded-2xl w-80 ${
            isDarkMode ? 'bg-dark-800' : 'bg-white'
          }`}>
            <Text className={`text-xl font-bold mb-4 text-center ${
              isDarkMode ? 'text-dark-100' : 'text-primary-900'
            }`}>
              Enter QR Data Manually
            </Text>
            
            <TextInput
              value={manualInput}
              onChangeText={setManualInput}
              placeholder={`Enter ${scanType === 'qr' ? 'login QR' : 'kanban QR'} data`}
              placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
              multiline
              numberOfLines={3}
              className={`px-4 py-3 rounded-lg border mb-6 text-base ${
                isDarkMode 
                  ? 'bg-dark-700 border-dark-600 text-dark-100' 
                  : 'bg-primary-50 border-primary-300 text-primary-900'
              }`}
            />
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowManualInput(false);
                  setManualInput('');
                }}
                className="flex-1 py-3 rounded-lg bg-gray-500"
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleManualInput}
                className="flex-1 py-3 rounded-lg bg-primary-600"
              >
                <Text className="text-white text-center font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QRScanScreen;

