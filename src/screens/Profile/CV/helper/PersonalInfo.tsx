import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Mask from "~/src/function/mask";

type PersonalInfoType = {
  name: string;
  birth: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  district: string;
  city: string;
  uf: string;
  complement: string;
  cep: string;

};

type PersonalInfoProps = {
  personalInfo: PersonalInfoType;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType>>;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  setPersonalInfo,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const saveData = () => {
    setData({ ...personalInfo });
    setEditMode(false);
  };

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setPersonalInfo({
      name: "",
      birth: "",
      phone: "",
      email: "",
      street: "",
      number: "",
      district: "",
      city: "",
      uf: "",
      complement: "",
      cep: "",

    });
    setData(null);
    setEditMode(true);
  };

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text className="text-black font-bold text-lg">
          Informações Pessoais
        </Text>
        {/* <View className="flex-row justify-between items-center">
          <View className="flex-row">
            {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons name="content-save-all-outline" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons name="pencil-box-multiple-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={resetData}>
                <Ionicons name="trash" size={20} color="black" />
                </TouchableOpacity> 
          </View>
        </View> */}
      </View>
      <View
        className="p-4 bg-white rounded-xl mb-4 shadow-md"
        style={{
          elevation: 8, // Sombra para Android
          shadowColor: "#000", // Sombra para iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {editMode ? (
          <>
            <TextInput
              style={{
                elevation: 8, // Sombra para Android
                shadowColor: "#000", // Sombra para iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              className="bg-white p-2 rounded-lg mt-1 text-black"
              placeholder="Nome completo"
              value={personalInfo.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={{
                elevation: 8, // Sombra para Android
                shadowColor: "#000", // Sombra para iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              className="bg-white p-2 rounded-lg mt-2 text-black"
              placeholder="Data de nascimento"
              value={personalInfo.birth}
              onChangeText={(text) => handleChange("birth", text)}
            />
            <TextInput
              style={{
                elevation: 8, // Sombra para Android
                shadowColor: "#000", // Sombra para iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              className="bg-white p-2 rounded-lg mt-2 text-black"
              placeholder="Celular"
              value={personalInfo.phone}
              onChangeText={(text) => handleChange("contact", text)}
            />
          </>
        ) : (
          <View className="flex-col gap-1">
            <View className="flex-row gap-1">
              {/* <FontAwesome name="user-o" size={20} color="black" /> */}
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="black"
              />
              <Text className="text-black">
                {personalInfo && personalInfo.name && personalInfo.name} 
              </Text>
            </View>
            <View className="flex-row gap-1">
              <MaterialCommunityIcons
                name="cake-variant-outline"
                size={24}
                color="black"
              />
              <Text className="text-black">
                {(personalInfo && personalInfo.birth) && Mask('dateFormatBrazil',personalInfo.birth)}
              </Text>
            </View>
            <View className="flex-row gap-1">
              <MaterialCommunityIcons name="whatsapp" size={24} color="black" />
              <Text className="text-black">
                {(personalInfo && personalInfo.phone) && Mask('phone',personalInfo.phone)}
              </Text>
            </View>
            <View className="flex-row gap-1">
              <MaterialCommunityIcons
                name="email-outline"
                size={24}
                color="black"
              />
              <Text className="text-black">
                {(personalInfo && personalInfo.email) && personalInfo.email} 
              </Text>
            </View>
            <View className="flex-row gap-1">
              {/* <FontAwesome6 name="location-dot" size={22} color="black" /> */}
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={24}
                color="black"
              />
              <Text className="text-black">
                {(personalInfo.street && personalInfo.number && personalInfo.district && personalInfo.city && personalInfo.uf) && `${personalInfo.street} N° ${personalInfo.number}, ${personalInfo.district}, ${personalInfo.city} - ${personalInfo.uf}`}
              </Text>
            </View>
            {/* <Text className="text-black">Atuação: {(data && data.sector) && data.sector}</Text> */}
          </View>
        )}
      </View>
    </>
  );
};

export default PersonalInfo;
