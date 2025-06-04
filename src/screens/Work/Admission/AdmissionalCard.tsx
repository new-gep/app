import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import Buttons from "../../Components/Buttons";
import { COLORS, FONTS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { FontAwesome5 } from "@expo/vector-icons";
import { IMAGES } from "../../../constants/Images";
import { rf } from "~/src/hooks/utils/responsiveFont";
type CardProps = {
  lockKey: string;
  title: any;
  status: any;
  path: any;
  typeDocument: string;
  setLockSignature: (any) => void;
  lockSignature: any;
};

const AdmissionalCard = ({ 
  lockKey,
  title, 
  status, 
  path, 
  typeDocument, 
  setLockSignature, 
  lockSignature 
}: CardProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [modalVisibleDoc, setModalVisibleDoc] = useState(false);

  const handleOpenModalDoc = () => {
    setModalVisibleDoc(!modalVisibleDoc);
    
    // Atualiza o estado apenas se ainda não foi visualizado
    if (!lockSignature[lockKey]) {
      setLockSignature(prev => ({
        ...prev,
        [lockKey]: true
      }));
    }
  };

  const Mask = (type: string, value: string) => {
    const titleMappings: { [key: string]: string } = {
      registration: "Ficha de Registro",
      experience: "Contrato de Experiência",
      extension: "Acordo de Prorrogação de Horas",
      compensation: "Acordo de Compensação de Horas",
      voucher: "Solicitação de Vale Transporte"
    };

    return titleMappings[value] || value;
  };

  return (
    <>
      <View className="h-3/12 p-4">
        <View className={`h-4/6 w-${rf(80)} mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-200 shadow-gray-300 p-4 justify-around`}>
          <DocumentVisible
            path={path}
            typeDocument={typeDocument}
            twoPicture={false}
            visible={modalVisibleDoc}
            documentName={""}
            close={handleOpenModalDoc}
          />

          <View className="absolute -top-4 left-2.5 bottom-2.5">
            <Image
              source={lockSignature[lockKey] ? IMAGES.lockOpen : IMAGES.lockClose}
              style={{ width: Dimensions.get('window').width * 0.08, height: Dimensions.get('window').height * 0.04 }}
              tintColor={lockSignature[lockKey] ? COLORS.success : COLORS.danger}
              resizeMode="contain"
            />
          </View>

          <Text className=" mb-4 text-center" style={{ ...FONTS.fontBlack, fontSize: rf(18) }}>
            {Mask('title', title)}
          </Text>


            

          <View className="justify-center">
            <TouchableOpacity style={{height:rf(40)}} className={`bg-primary rounded-xl items-center justify-center`} onPress={handleOpenModalDoc}>
              <Text className="text-center font-bold">Visualizar</Text>
            </TouchableOpacity>
            {/* <Button
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
            /> */}
          </View>
        </View>
      </View>
    </>
  );
};

export default AdmissionalCard;