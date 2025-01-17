import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import DrawingModal from "../../Components/signatureModal";

import Buttons from "../../Components/Buttons";
import { COLORS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import DocumentVisible from "../../../components/Modal/DocumentVisible";

type CardProps = {
  title: string;
  status: boolean;
};

const AdmissionalCard = ({ title, status }: CardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<string | null>(null); // Estado para armazenar a assinatura em base64
  const [modalVisibleDoc, setModalVisibleDoc] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  
  return (
    <View className="p-4 bg-white w-full rounded-2xl shadow-md mb-4">
        <DocumentVisible typeDocument={""} twoPicture={false} visible={modalVisibleDoc} documentName={""} close={handleOpenModalDoc}/>
        
      <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
      <Text className="text-gray-500 mb-4">{status ? "Yes" : "No"}</Text>

      {/* Exibir a assinatura como imagem se existir */}
      {signature ? (
        <Image
          source={{ uri: signature }} // Exibe a assinatura usando a URI base64
          style={{
            width: 200,
            height: 100,
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
          }}
          resizeMode="contain"
        />
      ) : (
        <Text className="text-gray-500 mb-4">Nenhuma assinatura salva.</Text>
      )}

      <Button
        title={"Assinar"}
        style={{ marginRight: 8, marginBottom: 8 }}
        text={COLORS.title}
        color={COLORS.primary}
        onPress={handleOpenModal}
      />

      <Button
        title={"Visualizar"}
        style={{ marginRight: 8, marginBottom: 8 }}
        text={COLORS.title}
        color={COLORS.primary}
        onPress={handleOpenModalDoc}
      />

      <DrawingModal
        visible={modalVisible}
        onClose={handleCloseModal}
        setSignature={setSignature} // Passa a função para atualizar a assinatura em base64
        signature={undefined}
      />
    </View>
  );
};

export default AdmissionalCard;
