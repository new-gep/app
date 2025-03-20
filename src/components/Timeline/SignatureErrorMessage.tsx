import React from 'react';
import { View, Text } from 'react-native';

const SignatureErrorMessage: React.FC = () => {
  return (
    <View className="px-4 mb-4">
      <Text className="text-red-500 text-center font-medium">
        Assinatura reprovada, por favor envie novamente.
      </Text>
    </View>
  );
};

export default SignatureErrorMessage; 