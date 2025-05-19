import React from 'react';
import { View, Text } from 'react-native';

interface PersonalInfoPreviewProps {
  data: { name: string; title: string; contact: string; employed: string; dob: string; cpf: string; educationLevel: string; experienceYears: string; sector: string };
}

const PersonalInfoPreview: React.FC<PersonalInfoPreviewProps> = ({ data }) => {
  return (
    <View className="bg-primary p-4 rounded-lg mb-4">
      <Text className="text-black font-bold text-lg">Informações Pessoais</Text>
      <Text className="text-black">Nome: {data.name}</Text>
      <Text className="text-black">Título: {data.title}</Text>
      <Text className="text-black">Contato: {data.contact}</Text>
      <Text className="text-black">Empregado: {data.employed}</Text>
      <Text className="text-black">Nascimento: {data.dob}</Text>
      <Text className="text-black">CPF: {data.cpf}</Text>
      <Text className="text-black">Escolaridade: {data.educationLevel}</Text>
      <Text className="text-black">Experiência: {data.experienceYears}</Text>
      <Text className="text-black">Setor: {data.sector}</Text>
    </View>
  );
};

export default PersonalInfoPreview;