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
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({ visible, status }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const getMessage = () => {
    switch (status) {
      case 'approved':
        return 'Seus documentos foram aprovados. Agora você pode prosseguir com a assinatura do contrato.';
      case 'pending':
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
        currentStep={2}
        showProgress={true}
      />
      
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
          Aguardando análise
        </Text>
        
        <View className="w-full h-90% aspect-square mb-8">
          <Image 
            source={require('../../../assets/images/gif/Timemanagement.gif')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-gray-800 text-xl font-bold text-center">
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