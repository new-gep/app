import React from 'react';
import { View, Text } from 'react-native';

interface SkillsPreviewProps {
  data: string[];
}

const SkillsPreview: React.FC<SkillsPreviewProps> = ({ data }) => {
  return (
    <View className="bg-primary p-4 rounded-lg">
      <Text className="text-black font-bold text-lg">Competências</Text>
      {data.map((skill, index) => (
        <Text key={index} className="text-black">{skill}</Text>
      ))}
    </View>
  );
};

export default SkillsPreview;