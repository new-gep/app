import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import React from 'react';
import TimelineDemission from '~/src/components/Timeline/TimelineDemission';

type WaitingIndicatorProps = {
  visible: boolean;
  status?: 'approved' | 'pending';
  current : any
};

const WaitingIndicatorDismissal: React.FC<WaitingIndicatorProps> = ({ visible, status, current }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const getMessage = () => {
    switch (status) {
      case 'approved':
        return 'Seus documentos foram aprovados';
      case 'pending':
        return 'Seus documentos e sua assinatura estão em análise';
      default:
        return 'Aguardando retorno da documentação';
    }
  };

  return (
    <View className="flex-1 bg-white"
    
    >
      {current != 3 && <TimelineDemission currentStep={current} showProgress={true} />}
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
          Aguarde
        </Text>
        <Text className="text-gray-600 text-sm font-bold text-center">
          {getMessage()}
        </Text>
        <View className="w-full h-80%  aspect-square">
          <Image 
            source={require('../../../../assets/images/gif/Timemanagement.gif')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="mt-20"
        >
          <Text className="text-gray-900 underline text-sm">
            Enquanto aguarda, que tal ver novas vagas?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaitingIndicatorDismissal;