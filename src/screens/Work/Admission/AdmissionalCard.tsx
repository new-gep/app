import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import Buttons from "../../Components/Buttons";
import { COLORS, FONTS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { FontAwesome5 } from "@expo/vector-icons";
import { IMAGES } from "../../../constants/Images";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Icon from "~/src/components/Icon/Icon";
type CardProps = {
  lockKey: string;
  title: any;
  status: any;
  path: any;
  typeDocument: string;
  setLockSignature: (any:any) => void;
  lockSignature: any;
};

const AdmissionalCard = ({
  lockKey,
  title,
  status,
  path,
  typeDocument,
  setLockSignature,
  lockSignature,
}: CardProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [modalVisibleDoc, setModalVisibleDoc] = useState(false);

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);

    // Atualiza o estado apenas se ainda não foi visualizado
    if (!lockSignature[lockKey]) {
      setLockSignature((prev:any) => ({
        ...prev,
        [lockKey]: true,
      }));
    }
  };

  const Mask = (type: string, value: string) => {
    const titleMappings: { [key: string]: string } = {
      registration: "Ficha de Registro",
      experience: "Contrato de Experiência",
      extension: "Acordo de Prorrogação de Horas",
      compensation: "Acordo de Compensação de Horas",
      voucher: "Solicitação de Vale Transporte",
    };

    return titleMappings[value] || value;
  };

  return (
    <>
      <View className="h-3/12 p-4">
        <TouchableOpacity
          style={Style.container}
          onPress={handleOpenModalDoc}
          className={`h-4/6 w-${rf(
            80
          )} mx-auto bg-white rounded-2xl shadow-lg  p-4 justify-around`}
        >
          <DocumentVisible
            path={path}
            typeDocument={typeDocument}
            twoPicture={false}
            visible={modalVisibleDoc}
            documentName={""}
            close={handleOpenModalDoc}
          />

          <View className="absolute -top-2 left-2.5 bottom-2.5">
            <Image
              source={
                lockSignature[lockKey] ? IMAGES.lockOpen : IMAGES.lockClose
              }
              style={{
                width: Dimensions.get("window").width * 0.08,
                height: Dimensions.get("window").height * 0.04,
              }}
              tintColor={
                lockSignature[lockKey] ? COLORS.success : COLORS.danger
              }
              resizeMode="contain"
            />
          </View>
          <View>
            <Text
              className=" mb-4 text-center"
              style={{ ...FONTS.fontBlack, fontSize: rf(18), margin:0 }}
            >
              {Mask("title", title)}
            </Text>
            <View className="flex-row items-end">
              <View className="h-5 w-5 flex-row">
                <Icon name={"touchApp_outline"} color="#6b7280" />
              </View>
              <Text className="text-gray-500" style={{ ...FONTS.fontBlack, fontSize: rf(12), marginLeft:3 }}>clique para abrir</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

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
    padding: 7,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};

export default AdmissionalCard;
