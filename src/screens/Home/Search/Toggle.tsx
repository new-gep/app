import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";

type FilterToggleProps = {
  label: string;
  initial?: boolean;
  onToggle?: (selected: boolean) => void;
};

export default function FilterToggle({ label, initial = false, onToggle }: FilterToggleProps) {
  const [selected, setSelected] = useState(initial);

  const handlePress = () => {
    const newState = !selected;
    setSelected(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`px-4 py-2 rounded-xl mr-2 mb-2 ${
        selected ? "bg-blue-600" : "bg-zinc-200"
      }`}
    >
      <Text
        style={{
          fontSize: rf(18),
          ...FONTS.fontLight,
        }}
        className={selected ? "text-white" : "text-zinc-800"}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
