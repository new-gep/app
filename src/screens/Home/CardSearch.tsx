import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Para os ícones de lupa e "X"

const CardSearch = () => {
  const [searchText, setSearchText] = useState(""); // Estado para controlar o texto do input

  return (
    <View className="absolute w-full py-3 px-4 z-50">
      <View
        className="w-full bg-white rounded-xl flex-row items-center shadow-md"
        style={{
          // Sombra para Android
          elevation: 8,
          // Sombra para iOS
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* Ícone de Lupa */}
        <Icon
          name="search"
          size={24}
          color="#9CA3AF" // Cinza claro, igual ao placeholder
          style={{ marginLeft: 12, marginRight: 8 }}
        />

        {/* TextInput */}
        <TextInput
          placeholder="Pesquisar"
          placeholderTextColor="#9CA3AF" // Cinza claro (text-gray-400)
          className="flex-1 py-3 text-base text-black"
          style={{
            fontFamily: "System", // Ou sua fonte personalizada
          }}
          value={searchText}
          onChangeText={(text) => setSearchText(text)} // Atualiza o estado com o texto digitado
        />

        {/* Ícone de "X" (limpar) */}
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText("")} // Limpa o texto
            style={{ marginRight: 12 }}
          >
            <Icon name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CardSearch;