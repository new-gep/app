import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { FONTS } from "~/src/constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

const LocationFilter = () => {
  const [distance, setDistance] = useState(2);
  const [showFarPeople, setShowFarPeople] = useState(false);

  return (
    <>
      <View className="mb-4">
        <View 
          style={styles.card}
          className=" rounded-lg p-4 mt-2"
        >
          <Text
            className="text-dark mb-2"
            style={{ ...FONTS.fontMedium, fontSize: 16 }}
          >
            Localização
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={16}  />
            <Text
              className="text-dark ml-2"
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              São Paulo, Brasil
            </Text>
          </View>
          <TouchableOpacity className="mb-2">
            <Text className="text-gray-500 text-sm">Adicionar novo local</Text>
          </TouchableOpacity>
        </View>
        <Text>Mude a localização aq</Text>
      </View>
      <View 
        style={styles.card}
        className="bg-[#252525] rounded-lg p-4 mb-4"
      >
        <Text
          className="text-dark mb-2"
          style={{ ...FONTS.fontRegular, fontSize: 14 }}
        >
          Distância máxima
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={distance}
          onValueChange={setDistance}
          minimumTrackTintColor="#fde047"
          maximumTrackTintColor="#666"
          thumbTintColor="#fde047"
          className="mb-4 "
          
        />
        <Text
          className="text-dark mb-2"
          style={{ ...FONTS.fontRegular, fontSize: 14 }}
        >
          {distance} km
        </Text>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-dark w-5/6"
            style={{ ...FONTS.fontRegular, fontSize: 14 }}
          >
            Mostrar vagas mais longe de mim se eu ficar sem vagas pra ver
          </Text>
          <Switch
            value={showFarPeople}
            onValueChange={setShowFarPeople}
            trackColor={{ true: "#fde047", false: "#666" }}
            thumbColor="#FFF"
          />
        </View>
      </View>
    </>
  );
};

const styles = {
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
};

export default LocationFilter;
