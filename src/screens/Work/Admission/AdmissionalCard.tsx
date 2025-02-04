import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Buttons from "../../Components/Buttons";
import { COLORS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import DocumentVisible from "../../../components/Modal/DocumentVisible";

type CardProps = {
  title: any;
  status: any;
  path: any;
  typeDocument: string;
  setLockSignature:  (any) => void;
  lockSignature: any;
};

const AdmissionalCard = ({ title, status, path, typeDocument, setLockSignature, lockSignature }: CardProps) => {
  const [signature, setSignature] = useState<string | null>(null); // Estado para armazenar a assinatura em base64
  const [modalVisibleDoc, setModalVisibleDoc] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);
    setIsViewed(true);
    const test = {
      ...lockSignature,
      [title]: true,
    };
    setLockSignature(test);
  };

  const Mask = (type, value) => {
    switch (type) {
      case 'title':
        // Primeiro verifica se é um dos casos especiais
        switch (value) {
          case 'registration':
            return "Ficha de Registro";
          case 'experience':
            return "Contrato de Experiência";
          case 'extension':
            return "Acordo de Prorrogação de Horas";
          case 'compensation':
            return "Acordo de Compensação de Horas";
          case 'voucher':
            return "Solicitação de Vale Transporte";
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
      <View className="p-4 bg-white w-screen rounded-2xl shadow-md">
        <DocumentVisible
          path={path}
          typeDocument={typeDocument}
          twoPicture={false}
          visible={modalVisibleDoc}
          documentName={""}
          close={handleOpenModalDoc}
        />

        <Text className="text-lg font-bold text-gray-800 mb-2">{Mask('title',title)}</Text>
        {/* <Text className="text-gray-500 mb-4">{status ? "Yes" : "No"}</Text> */}

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
          title={"Visualizar"}
          style={{ marginRight: 8, marginBottom: 8 }}
          text={'#000000'}
          color={isViewed ? '#28a745' : '#007bff'}
          onPress={handleOpenModalDoc}
        />
      </View>
    </>
  );
};

export default AdmissionalCard;
