import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { useNavigation } from '@react-navigation/native';

const PayStub = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const months = [
    {
      id: '1',
      month: 'Agosto',
      period: '01 jul 2023 - 31 jul 2023',
      status: 'approved'
    },
    {
      id: '2',
      month: 'Julho',
      period: '01 jun 2023 - 31 jun 2023',
      status: 'pending'
    },
    {
      id: '3',
      month: 'Junho',
      period: '01 Mai 2023 - 30 Mai 2023',
      status: 'pending'
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Holerite"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 px-4">
        {months.map((item) => (
          <TouchableOpacity 
            key={item.id}
            className="flex-row justify-between items-center py-4 border-b border-gray-200"
            onPress={() => {}}
          >
            <View>
              <Text className="text-lg font-medium text-gray-800">{item.month}</Text>
              <Text className="text-sm text-gray-500">{item.period}</Text>
            </View>
            <View className="flex-row items-center">
              {item.status === 'approved' ? (
                <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                  <Text className="text-green-600">✓</Text>
                </View>
              ) : (
                <Text className="text-orange-500">Não assinado</Text>
              )}
              <Text className="ml-2">›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PayStub;
