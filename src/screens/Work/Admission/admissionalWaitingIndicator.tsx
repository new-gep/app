import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Timeline from '../../../components/Timeline/TimelineFront';
import Header from '../../../layout/Header';
import TimelineFront from '../../../components/Timeline/TimelineFront';

type WaitingIndicatorProps = {
  visible: boolean;
  status?: 'approved' | 'pending';
  message?: string;
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({ visible, status, message }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const getMessage = () => {
    if (message) {
      return message;
    }

    switch (status) {
      case 'approved':
        return 'Seus documentos foram aprovados. Agora você pode prosseguir com a assinatura do contrato.';
      case 'pending':
        return 'Estamos analisando seus documentos. Em breve você poderá prosseguir com a próxima etapa.';
        return 'Seus documentos estão em análise. Em breve você poderá prosseguir com a próxima etapa.';
      default:
        return 'Aguardando retorno da documentação';
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Exame Admissional"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <TimelineFront 
        currentStep={3}
        showProgress={true}
        status={status}
      />
      
      <View className="flex-1 justify-start items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          Aguardando análise
        </Text>
        
        <View className="w-full h-60% aspect-square mb-4">
          <Image 
            source={require('../../../assets/images/gif/Timemanagement.gif')}
            style={{ width: '100%', height: '75%' }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-gray-500 text-base text-center">
          {getMessage()}
        </Text>

        {/* <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="mt-56"
        >
          <Text className="text-gray-800 underline text-lg">
            Enquanto aguarda, que tal ver novas vagas?
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default WaitingIndicator;