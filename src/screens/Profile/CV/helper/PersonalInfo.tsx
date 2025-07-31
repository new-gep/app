import Mask from "~/src/function/mask";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { rf } from "~/src/hooks/utils/responsiveFont";

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
  zip_code: string;

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
      zip_code: "",

    });
    setData(null);
    setEditMode(true);
  };

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text style={{fontSize:rf(18)}} className="text-dark font-bold text-lg">
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
        className="px-2 py-3 bg-white rounded-xl mb-4 shadow-md"
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
          <View className="flex-col ">
            <View className="flex-row ">
              {/* <FontAwesome name="user-o" size={20} color="black" /> */}
              <MaterialCommunityIcons
                name="account-outline"
                size={rf(24)}
                color="#4B4B4B"
              />
              <Text style={{fontSize:rf(16)}} className="text-black ml-1">
                {personalInfo && personalInfo.name && personalInfo.name} 
              </Text>
            </View>
            <View className="flex-row ">
              <MaterialCommunityIcons
                name="cake-variant-outline"
                size={rf(24)}
                color="#4B4B4B"
                
              />
              <Text style={{fontSize:rf(16)}} className="text-black ml-1">
                {(personalInfo && personalInfo.birth) && Mask('dateFormatBrazil',personalInfo.birth)}
              </Text>
            </View>
            <View className="flex-row ">
              <MaterialCommunityIcons name="whatsapp" size={rf(24)} color="#4B4B4B" />
              <Text style={{fontSize:rf(16)}} className="text-black ml-1">
                {(personalInfo && personalInfo.phone) && Mask('phone',personalInfo.phone)}
              </Text>
            </View>
            <View className="flex-row ">
              <MaterialCommunityIcons
                name="email-outline"
                size={rf(24)}
                color="#4B4B4B"
              />
              <Text style={{fontSize:rf(16)}} className="text-black ml-1">
                {(personalInfo && personalInfo.email) && personalInfo.email} 
              </Text>
            </View>
            <View className="flex-row ">
              {/* <FontAwesome6 name="location-dot" size={22} color="black" /> */}
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={rf(24)}
                color="#4B4B4B"
              />
              <Text style={{fontSize:rf(16)}} className="text-black ml-1 w-5/6">
                {(personalInfo.street && personalInfo.number && personalInfo.district && personalInfo.city && personalInfo.uf && personalInfo.zip_code ) && `${personalInfo.street} N° ${personalInfo.number}, ${personalInfo.district}, ${personalInfo.city} - ${personalInfo.uf}, ${Mask('cep',personalInfo.zip_code)}`}
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
