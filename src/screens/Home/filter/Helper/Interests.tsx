import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FONTS } from '~/src/constants/theme';

interface InterestsFilterProps {
  title: string;
  options: string[];
}

const InterestsFilter = ({ title, options }: InterestsFilterProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <View className="bg-[#252525] rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white" style={{ ...FONTS.fontMedium, fontSize: 16 }}>
          {title}
        </Text>
        <TouchableOpacity>
          <Text className="text-[#FF375F] text-sm">Selecionar</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            className={`m-1 px-4 py-2 rounded-full ${
              selected.includes(option) ? 'bg-[#FF375F]' : 'bg-[#333]'
            }`}
            onPress={() => toggleOption(option)}
          >
            <Text
              className={selected.includes(option) ? 'text-white' : 'text-gray-400'}
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default InterestsFilter;