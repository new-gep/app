import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FONTS } from "~/src/constants/theme";
import Header from "../../../layout/Header";
import CVPreview from "./Preview";
import CVUpload  from "./Upload";


export default function Home({ cv, setCv, collaborator }: any) {
  const [preview, setPreview] = React.useState<boolean>(false);
  const [upload, setUpload]   = React.useState<boolean>(false);


  return (
    <>
      <CVPreview visible={preview} setVisible={setPreview} collaborator={collaborator}/>
      <CVUpload  visible={upload}  setVisible={setUpload} collaborator={collaborator}/>

      <Header title="Currículo" leftIcon={"back"} iconSimple={"file"} />
      <ScrollView className="flex-1 bg-white px-4 py-6">
        <View className="mb-5">
          <Text
            style={{ ...FONTS.fontBold, fontSize: 32 }}
            className="text-black"
          >
            Pronto para dar o próximo passo?
          </Text>
          <Text
            style={{ ...FONTS.fontRegular, fontSize: 16 }}
            className="text-gray-700 mb-2"
          >
            Crie seu currículo, envie seu CV e seja encontrado pelas melhores
            oportunidades.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {/* Card 1 - Perfil */}
          <TouchableOpacity
            style={Style.container}
            className="w-[48%] aspect-square rounded-2xl justify-center items-center mb-4 bg-white"
            onPress={() => {
              setCv(true);
            }}
          >
            <MaterialIcons name="article" size={24} color="black" />
            <Text className="mt-2 text-center font-semibold">CV</Text>
          </TouchableOpacity>

          {/* Card 2 - Upload CV */}
          <TouchableOpacity
            style={Style.container}
            className="w-[48%] aspect-square bg-white rounded-2xl justify-center items-center mb-4"
            onPress={() => {
              setUpload(true);
            }}
          >
            <MaterialIcons name="cloud-upload" size={24} color="black" />
            <Text className=" mt-2 text-center font-semibold">Upload</Text>
          </TouchableOpacity>

          {/* Card 3 - Visualizar CV */}
          <TouchableOpacity
            style={Style.container}
            className="w-[48%] aspect-square bg-white rounded-2xl justify-center items-center mb-4"
            onPress={() => {
              setPreview(true);
            }}
          >
            <MaterialIcons name="remove-red-eye" size={24} color="black" />
            <Text className="mt-2 text-center font-semibold">Visualizar</Text>
          </TouchableOpacity>

          {/* Card 4 - IA */}
          <TouchableOpacity
            style={Style.container}
            className="w-[48%] aspect-square bg-white rounded-2xl justify-center items-center mb-4"
            onPress={() => {
              setPreview(true);
            }}
          >
            <MaterialIcons name="layers" size={24} color="black" />
            <Text className="mt-2 text-center font-semibold">IA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
