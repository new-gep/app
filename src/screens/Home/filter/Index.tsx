import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FONTS } from '~/src/constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationFilter from './Helper/Location';
import AgeRangeFilter from './Helper/Range';
import InterestsFilter from './Helper/Interests';
import Header from '~/src/layout/Header';

export default function Filter() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header  title="Filtro" leftIcon={"back"}/>
      <ScrollView className="px-4">
        <LocationFilter />
        <AgeRangeFilter />
        <InterestsFilter title="Interesses" options={['Viagem', 'Música', 'Comida']} />
        <InterestsFilter title="Idiomas que eu falo" options={['Português', 'Inglês', 'Espanhol']} />
        <InterestsFilter title="Tipo de relacionamento" options={['Monogamia', 'Não-monogamia ética', 'Relacionamento aberto', 'Poliamor', 'Curto explorar']} />
        <InterestsFilter title="To procurando" options={['Relacionamento sério', 'Algo sério, mas vamos ver...', 'Nada sério, mas depende...', 'Algo casual', 'Novas amizades', 'Ainda não sei']} />
      </ScrollView>
      <TouchableOpacity
        className="bg-[#FF375F] py-4 rounded-t-[20px] mx-4 mb-4"
        onPress={() => console.log('CONCLUÍDO pressed')}
      >
        <Text className="text-white text-center" style={{ ...FONTS.fontBold, fontSize: 16 }}>
          CONCLUÍDO
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}