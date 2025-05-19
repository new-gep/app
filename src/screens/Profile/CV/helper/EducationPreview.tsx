import React from 'react';
import { View, Text } from 'react-native';

interface EducationPreviewProps {
  data: { degree: string; institution: string; period: string; dissertation: string }[];
}

const EducationPreview: React.FC<EducationPreviewProps> = ({ data }) => {
  return (
    <View className="bg-primary p-4 rounded-lg mb-4">
      <Text className="text-black font-bold text-lg">Escolaridade</Text>
      {data.map((edu, index) => (
        <View key={index} className="mt-2">
          <Text className="text-black">Curso: {edu.degree}</Text>
          <Text className="text-black">Instituição: {edu.institution}</Text>
          <Text className="text-black">Período: {edu.period}</Text>
          {edu.dissertation && <Text className="text-black">Dissertação: {edu.dissertation}</Text>}
        </View>
      ))}
    </View>
  );
};

export default EducationPreview;