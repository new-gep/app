import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type WaitingIndicatorProps = {
  visible: boolean;
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 absolute inset-0 z-50">
      <View className="bg-white p-8 rounded-lg shadow-lg items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-800 text-lg mt-4 font-semibold">
          Por favor, aguarde...
        </Text>
      </View>
    </View>
  );
};

export default WaitingIndicator;