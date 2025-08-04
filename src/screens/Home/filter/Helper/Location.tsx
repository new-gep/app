import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { FONTS } from "~/src/constants/theme";
import Icon from "~/src/components/Icon/Icon";
import Mask from "~/src/function/mask";
import FindCep from "~/src/hooks/findOne/cep";

const LocationFilter = ({locations, setLocations , distance, setDistance, showFarWork, setShowFarWork}:any) => {
  
  const [newLocation, setNewLocation] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [foundLocation, setFoundLocation] = useState<{
    label: string;
    cep: string;
  } | null>(null);

  const addLocation = () => {
    if (foundLocation) {
      setLocations((prev:any) => [...prev, foundLocation.label]);
      setNewLocation("");
      setShowInput(false);
      setFoundLocation(null);
    }
  };

  const removeLocation = (index: number) => {
    setLocations((prev:any) => prev.filter((_, i) => i !== index));
  };

  const findCep = async () => {
    const clearCep = Mask("remove", newLocation);
    if (clearCep.length !== 8) {
      setFoundLocation(null);
      return;
    }

    const response = await FindCep(clearCep);
    if (response?.erro) {
      Alert.alert("Erro", "CEP não encontrado, tente novamente!");
      setFoundLocation(null);
      return;
    }

    const label = `${response.localidade}, ${response.uf}`;
    setFoundLocation({ label, cep: clearCep });
  };

  useEffect(() => {
    if (newLocation.length === 9) findCep();
    else setFoundLocation(null);
  }, [newLocation]);

  return (
    <>
      <View className="mb-4">
        <View style={styles.card} className="bg-white rounded-lg p-4 mt-2">
          <Text
            className="text-dark mb-2"
            style={{ ...FONTS.fontRegular, fontSize: 14 }}
          >
            Localização
          </Text>

          {/* Local fixo */}
          <View className="flex-row items-center mb-2">
            <View className="h-5 w-5">
              <Icon name="location_outline" />
            </View>
            <Text
              className="text-dark ml-1"
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              São Paulo, Brasil
            </Text>
          </View>

          {/* Locais adicionais */}
          {locations.map((loc, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between mb-1"
            >
              <View className="flex-row items-center">
                <View className="h-5 w-5">
                  <Icon name="location_outline" />
                </View>
                <Text
                  className="text-dark ml-1"
                  style={{ ...FONTS.fontRegular, fontSize: 14 }}
                >
                  {loc}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeLocation(index)}>
                <View className="h-5 w-5">
                  <Icon name="delete_outline" />
                </View>
              </TouchableOpacity>
            </View>
          ))}

          {/* Adicionar novo local */}
          {showInput ? (
            <View className="mt-2">
              <TextInput
                maxLength={10}
                placeholder="Digite o CEP"
                style={styles.card}
                className="p-2 rounded-lg bg-white"
                value={Mask("cep", newLocation)}
                keyboardType="numeric"
                onChangeText={setNewLocation}
              />
              {foundLocation && (
                <View className="flex-row items-center py-1 px-3">
                  <View className="h-6 w-6">
                    <Icon name="subDirectory" color="gray" />
                  </View>
                  <Text className="ml-2 text-gray-600">
                    {foundLocation.label}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  className="mt-3"
                  onPress={() => {
                    setShowInput(false);
                    setNewLocation("");
                    setFoundLocation(null);
                  }}
                >
                  <Text className="text-sm text-gray-500">Voltar</Text>
                </TouchableOpacity>
                {foundLocation && (
                  <TouchableOpacity className="mt-3" onPress={addLocation}>
                    <Text className="text-sm text-green-500">Adicionar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="mt-3"
              onPress={() => setShowInput(true)}
            >
              <Text className="text-gray-500 text-sm">
                + Adicionar novo local
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Distância */}
      <View style={styles.card} className="bg-white rounded-lg p-4 mb-4">
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
          className="mb-4"
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
            value={showFarWork}
            onValueChange={setShowFarWork}
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};

export default LocationFilter;
