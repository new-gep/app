import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FONTS } from "~/src/constants/theme";
import Header from "../../../layout/Header";
import CVPreview from "./Preview";
import CVUpload from "./Upload";
import List from "~/src/components/Menu/List";

export default function Home({ cv, setCv, collaborator }: any) {
  const [preview, setPreview] = React.useState<boolean>(false);
  const [upload, setUpload] = React.useState<boolean>(false);
  const ListMenu = [
    {
      icon:'document_outline',
      title:'CV',
      variable: cv,
      setVariable: setCv
    },
     {
      icon:'upload_outline',
      title:'Upload',
      variable: upload,
      setVariable: setUpload
    },
     {
      icon:'robot_outline',
      title:'IA',
      // go:'Profile',
      // variable: ia,
      // setVariable: setIA
    },
    {
      icon:'eye_outline',
      title:'Visualizar',
      variable: preview,
      setVariable: setPreview
    },

  ]

  return (
    <>
      <CVPreview
        visible={preview}
        setVisible={setPreview}
        collaborator={collaborator}
      />
      <CVUpload
        visible={upload}
        setVisible={setUpload}
        collaborator={collaborator}
      />

      <Header title="Currículo" leftIcon={"back"} />
      <ScrollView className="flex-1 bg-white px-4 py-6">
        {/* <View className="mb-5">
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
        </View> */}



        <List items={ListMenu} />

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
