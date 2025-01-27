import React from 'react';
import { View, Text, Image } from 'react-native';

type WaitingIndicatorProps = {
  visible: boolean;
  status?: 'approved' | 'pending';
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({ visible, status }) => {


  const getMessage = () => {
    switch (status) {
      case 'approved':
        return 'Seus documentos foram aprovados';
      case 'pending':
        return 'Seus documentos estão em análise';
      default:
        return 'Aguardando retorno da documentação';
    }
  };

  return (
    <View className="">
      <View className="items-center">
        <Image 
          source={require('../../../assets/images/gif/Timemanagement.gif')}
          className="h-48 w-44"
          resizeMode="contain"
        />
        <Text className="text-gray-800 text-xl mt-6 font-bold text-center">
          {/* {getMessage()} */}
        </Text>
      </View>
    </View>
  );
};

export default WaitingIndicator;