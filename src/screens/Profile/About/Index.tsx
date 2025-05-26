import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FONTS } from '~/src/constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationFilter from './Helper/Location';
import AgeRangeFilter from './Helper/Range';
import InterestsFilter from './Helper/Interests';
import Header from '~/src/layout/Header';

export default function About() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header  title="Sobre mim" leftIcon={"back"}/>
      <ScrollView className="px-6 py-3 ">
        <View style={Style.container} className="bg-white rounded-lg p-4 mb-4">
            <InterestsFilter border={true} icon="chat_outline" title="Comunicação" options={['Fico no WhatsApp o dia todo', 'Fico o dia inteiro no Whats', 'Gosto de falar no telefone', 'Adoro chamada de vídeo', 'Demoro pra responder no WhatsApp', 'Odeio falar por mensagem', 'Melhor falar pessoalmente']} />
            <InterestsFilter border={true} icon="school_outline" title="Formação" options={['Superior completo', 'Fazendo faculdade', 'Cursando o Ensino Médio', 'Doutorado completo', 'Fazendo pós', 'Mestrado completo', 'Curso técnico']} />
            <InterestsFilter border={true} icon="smoke_outline" title="Você fuma" options={['Fumo socialmente', 'Fumo quando bebo', 'Não fumo', 'Fumante', 'Tentando parar']} />
            <InterestsFilter border={true} icon="wine_outline" title="Bebida" options={['Não curto', 'Parei de beber', 'Bebo com modereção', 'Em ocasiões especiais', 'Socialmente, aos fins de semana', 'Quase toda noite']} />
            <InterestsFilter border={true} icon="book_outline" title="Interesses" options={['CLT', 'Contrato', 'PJ']} />
            <InterestsFilter border={true} icon="heart_outline" title="Linguagem do amor" options={['Presencial', 'Híbrido', 'Remoto']} />
            <InterestsFilter border={true} icon="pet_outline" title="Pets" options={['Cachorro', 'Gato', 'Réptil', 'Anfíbio', 'Passarinho', 'Peixe', 'Não tenho, mas amo', 'Outro', 'Tartaruga', 'Hamster', 'Coelho', 'Não tenho pets', 'Gosto de todos', 'Quero um pet', 'Tenho alergia a pets']} />
            <InterestsFilter icon="pizza_outline" title="Alimentação" options={['Vegano(a)', 'Vegetariano(a)', 'Pescetariano(a)', 'Kosher', 'Halal', 'Carnívoro(a)', 'Onivoro(a)']} />
        </View>
        <View className='mb-7'></View>
      </ScrollView>
      {/* <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={() => console.log('CONCLUÍDO pressed')}
      >
        <Text className="text-dark text-center" style={{ ...FONTS.fontBold, fontSize: 16 }}>
          CONCLUÍDO
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};