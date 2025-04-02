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
  currentStep?: number;
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({ visible, status, message, currentStep }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const getMessage = () => {
    if (message) {
      return message;
    }

    if (currentStep === 2) {
      return 'Seu exame foi aprovado! Em breve enviaremos os documentos para prosseguir com a admissão, por favor aguarde.';
    }

    switch (status) {
      case 'approved':
        return 'Seus documentos foram aprovados. Agora você pode prosseguir com a assinatura do contrato.';
      case 'pending':
        return 'Estamos analisando seus documentos. Em breve você poderá prosseguir com a próxima etapa.';
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
      <TimelineFront currentStep={currentStep || 1} showProgress={true} />
      
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