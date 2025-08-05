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
  Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

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
  title,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const { isDarkMode } = useTheme();
  const { width, height } = Dimensions.get('window');

  const handleScan = (e: { data: string }) => {
    if (e.data) {
      setIsScanning(false);
      onScanResult(e.data);
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      onScanResult(manualInput.trim());
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

      {/* Camera View */}
      <View className="flex-1 relative">
        <QRCodeScanner
          onRead={handleScan}
          flashMode={RNCamera.Constants.FlashMode.off}
          reactivate={true}
          reactivateTimeout={3000}
          showMarker={true}
          customMarker={
            <View className="w-64 h-64 border-2 border-primary-500 rounded-lg">
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
            </View>
          }
          cameraStyle={{ height: height * 0.7, width: width }}
          containerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          topContent={
            <Text className={`text-center mb-4 ${
              isDarkMode ? 'text-dark-200' : 'text-primary-800'
            }`}>
              {scanType === 'qr'
                ? 'Scan your login QR code to authenticate'
                : 'Scan the kanban QR code to add item to stockout list'}
            </Text>
          }
          bottomContent={
            <View className="space-y-3 w-full px-6">
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
          }
        />
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
