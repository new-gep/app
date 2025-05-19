import React from 'react';
import { View, Text } from 'react-native';

interface ExperiencePreviewProps {
  data: { role: string; company: string; period: string; responsibilities: string }[];
}

const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({ data }) => {
  return (
    <View className="bg-primary p-4 rounded-lg mb-4">
      <Text className="text-black font-bold text-lg">Experiência Profissional</Text>
      {data.map((exp, index) => (
        <View key={index} className="mt-2">
          <Text className="text-black">Cargo: {exp.role}</Text>
          <Text className="text-black">Empresa: {exp.company}</Text>
          <Text className="text-black">Período: {exp.period}</Text>
          <Text className="text-black">Responsabilidades: {exp.responsibilities}</Text>
        </View>
      ))}
    </View>
  );
};

export default ExperiencePreview;