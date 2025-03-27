import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Buttons from "../../Components/Buttons";
import { COLORS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { FontAwesome5 } from "@expo/vector-icons";

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
    if (!isViewed) {
      setIsViewed(true);
      const updatedLockSignature = {
        ...lockSignature,
        [title]: true,
      };
      setLockSignature(updatedLockSignature);
    }
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
            console.log("value", value);
            return value;
        }
      default:
        return value;
    }
  };


  return (
    <>
      <View className="h-4/5 p-4">
        <View className="h-full w-80 mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-200 shadow-gray-300 p-4">
          <DocumentVisible
            path={path}
            typeDocument={typeDocument}
            twoPicture={false}
            visible={modalVisibleDoc}
            documentName={""}
            close={handleOpenModalDoc}
          />

          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">{Mask('title',title)}</Text>

          {signature ? (
            <Image
              source={{ uri: signature }}
              style={{
                width: '100%',
                height: 120,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 16,
              }}
              resizeMode="contain"
            />
          ) : (
            <Text className="text-gray-500 mb-4 text-center">Nenhuma assinatura salva.</Text>
          )}

          <View className="flex-1 justify-end">
            <Button
              title={"Visualizar"}
              style={{
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center'
              }}
              text={'#000000'}
              color={COLORS.primary}
              onPress={handleOpenModalDoc}
              icon={
                isViewed ? 
                  <FontAwesome5 name="lock-open" size={24} color="#9ACD32" /> :
                  <FontAwesome5 name="lock" size={24} color="#FFB343" />
              }
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default AdmissionalCard;
