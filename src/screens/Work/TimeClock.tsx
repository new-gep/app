import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { useNavigation } from '@react-navigation/native';

const TimeClock = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Ponto"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <View className="flex-1 p-5">
        <Text className="text-lg">Registro de Ponto</Text>
      </View>
    </View>
  );
};

export default TimeClock;
