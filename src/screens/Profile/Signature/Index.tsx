import { View, Text, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import Header from "~/src/layout/Header";
import List from "~/src/components/Menu/List";
import SignatureProfile from "../../Components/Signatures/signatureProfile";
import signatureFile from "~/src/hooks/upload/signature";
import { useNavigation } from "@react-navigation/native";
import useCollaborator from "~/src/function/fetchCollaborator";
import FindCollaborator from "~/src/hooks/findOne/collaborator/collaborator";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import FindFile from "~/src/hooks/findOne/collaborator/file";
import Modal from "./Modal";

export default function Signature() {
  const [visibleSignature, setVisibleSignature] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [path, setPath] = useState<string | null>(null)
  const { collaborator } = useCollaborator();
  const navigation = useNavigation<any>();

  const findSignature = async () => {
    if (!collaborator) return;
    const response = await FindFile('signature', collaborator.CPF);
    if(response.status == 200){
      setPath(response.path)
    }
  };

  const saveSignature = async (signature: any) => {
    if (!collaborator) return;
    const response = await signatureFile({
      file: signature,
      name: "signature",
      cpf: collaborator.CPF,
    });
    if (response.status === 200) {
      Alert.alert(
        "Sucesso",
        "Assinatura salva com sucesso!",
        [
          {
            text: "OK",
            onPress: () => setVisibleSignature(false),
          },
        ],
        { cancelable: false }
      );
      setRefresh(!refresh)
    }
  };

  const ListMenu = [
    {
      icon: "pen_outline",
      title: "Assinar",
      variable: visibleSignature,
      setVariable: setVisibleSignature,
    },
    {
      icon: "eye_outline",
      title: "Visualizar assinatura",
      variable: visibleView,
      setVariable: setVisibleView,
    },
  ];

  useEffect(()=>{
    findSignature()
  },[collaborator, refresh])

  return (
    <View className="h-full bg-white">
      <Header title="Assinatura" leftIcon={"back"} />
      <BottomSheetModalProvider>
        <SignatureProfile
          visible={visibleSignature}
          onClose={() => {
            setVisibleSignature(false);
          }}
          onSaveSignature={saveSignature}
        />
        <Modal path={path} visible={visibleView} setVisible={setVisibleView} />
        <ScrollView className="h-full p-6">
          <List items={ListMenu} />
        </ScrollView>
      </BottomSheetModalProvider>
    </View>
  );
}
