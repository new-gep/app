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
        {/* <AgeRangeFilter /> */}
        <InterestsFilter title="Contrato" options={['CLT', 'Contrato', 'PJ']} />
        <InterestsFilter title="Modalidade" options={['Presencial', 'Híbrido', 'Remoto']} />
        <InterestsFilter title="Horários" options={['Manhã', 'Tarde', 'Noite', 'Madrugada', 'Fins de semana', 'Horário flexível']} />
        <InterestsFilter title="Pagamento" options={['Por hora', 'Por dia', 'Por semana', 'Por projeto', 'Por mês', 'A combinar']} />
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={() => console.log('CONCLUÍDO pressed')}
      >
        <Text className="text-dark text-center" style={{ ...FONTS.fontBold, fontSize: 16 }}>
          CONCLUÍDO
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}