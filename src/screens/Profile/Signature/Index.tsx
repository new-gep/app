import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";
import List from "~/src/components/Menu/List";
import SignatureProfile from "../../Components/Signatures/signatureProfile";
import { useState } from "react";


export default function Signature() {
  const [visible,setVisible] = useState<boolean>(false);

  const saveSignature = async () => {
    
  }

  const ListMenu = [
    {
      icon: "pen_outline",
      title: "Assinar",
    //   variable: upload,
    //   setVariable: setUpload,
    },
    {
      icon: "eye_outline",
      title: "Visualizar assinatura",
    //   variable: preview,
    //   setVariable: setPreview,
    },
  ];

  return (
    <View className="h-full bg-white">
      <SignatureProfile
        visible={visible}
        onClose={() =>{setVisible(true)}}
        onSaveSignature={"setSignature"}
      />
      <Header title="Assinatura" leftIcon={"back"} />
      <ScrollView className="p-6">
        <List items={ListMenu} />
      </ScrollView>
    </View>
  );
}
