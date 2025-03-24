import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Buttons from "../../../../Components/Buttons";
import { COLORS } from "../../../../../constants/theme";
import Button from "../../../../../components/Button/Button";
import DocumentVisible from "../../../../../components/Modal/DocumentVisible";
import { FontAwesome5 } from "@expo/vector-icons";

type CardProps = {
  title: any;
  status: any;
  path: any;
  typeDocument: string;
  onDocumentViewed?: (title: string) => void;
};

const DismissalCard = ({ title, status, path, typeDocument, onDocumentViewed }: CardProps) => {
  const [signature, setSignature] = useState<string | null>(null); // Estado para armazenar a assinatura em base64
  const [modalVisibleDoc, setModalVisibleDoc] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);
    setIsViewed(true);
    if (onDocumentViewed) {
      onDocumentViewed(title);
    }
  };

  // Mascara de titúlos
  const Mask = (type, value) => {
    switch (type) {
      case "title":
        // Primeiro verifica se é um dos casos especiais
        switch (value) {
          case "registration":
            return "Ficha de Registro";
          default:
            // Se não for um caso especial, retorna o valor formatado
            return value;
        }
      default:
        return value;
    }
  };

  return (
    <>
      <View className="h-2/3 p-4">
        <View className="h-full w-80 mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-200 shadow-gray-300 p-4">
          <DocumentVisible
            path={path}
            typeDocument={typeDocument}
            twoPicture={false}
            visible={modalVisibleDoc}
            documentName={""}
            close={handleOpenModalDoc}
          />

          <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>

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
            <Text className="text-gray-500 mb-4">
              Nenhuma assinatura salva.
            </Text>
          )}

          <Button
            title={"Visualizar"}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              marginTop: 60,
            }}
            text={"#000000"}
            color={COLORS.primary}
            onPress={handleOpenModalDoc}
            icon={
              isViewed ? (
                <FontAwesome5 name="lock-open" size={24} color={COLORS.dark} />
              ) : (
                <FontAwesome5 name="lock" size={24} color={COLORS.dark} />
              )
            }
          />
        </View>
      </View>
    </>
  );
};

export default DismissalCard;
