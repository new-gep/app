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

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);
    console.log('title', title);
    console.log('lockSignature', lockSignature);
    const test = {
      ...lockSignature, // Copia todas as propriedades do estado atual
      [title]: true, // Atualiza apenas a propriedade 'title'
    };
    setLockSignature(test)
  };

  const Mask = (type, value) => {
    switch (type) {
      case 'title':
        switch (value) {
          case 'registration':
          return "Ficha de Registro"
            break;
        case 'experience':
          return "Contrato de Experiência"
          break;
          case 'extension':
          return "Acordo de Prorrogação de Horas"
          break;
          case 'compensation':
          return "Acordo de Compensação de Horas"
          break;
          case 'voucher':
          return "Solicitação de Vale Transporte"
          break;
          default:
            break;
        }
        break;
    
      default:
        break;
    }
  };


  return (
    <>
      <View className="p-4 bg-white w-full rounded-2xl shadow-md mb-4">
        <DocumentVisible
          path={path}
          typeDocument={typeDocument}
          twoPicture={false}
          visible={modalVisibleDoc}
          documentName={""}
          close={handleOpenModalDoc}
        />

        <Text className="text-lg font-bold text-gray-800 mb-2">{Mask('title',title)}</Text>
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
          title={"Visualizar"}
          style={{ marginRight: 8, marginBottom: 8 }}
          text={COLORS.title}
          color={COLORS.primary}
          onPress={handleOpenModalDoc}
        />
      </View>
    </>
  );
};

export default AdmissionalCard;
