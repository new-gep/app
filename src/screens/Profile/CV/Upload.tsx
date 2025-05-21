import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "~/src/constants/theme";
import useCollaborator from "~/src/function/fetchCollaborator";
import GetPathPicture from "~/src/function/getPathPicture";
import UploadFile from "~/src/hooks/upload/picture";



const CVUpload = ({ visible, setVisible, collaborator }: any) => {

    const saveCV = async () => {
        let path:any
        path = await GetPathPicture("file");
        //@ts-ignore
        if (!path || path.error) {
            Alert.alert("Erro", "Arquivo inválido ou muito grande");
            return;
        };
        const response = await UploadFile(path, 'cv', 'complet', collaborator.CPF);
        if(response.status === 200){
            Alert.alert("Sucesso", "Currículo enviado com sucesso");
            setVisible(false);
        }else{
            Alert.alert("Erro", "Erro ao enviar currículo");
        }
    };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.8}
      useNativeDriver={true}
      onBackdropPress={() => {setVisible(false)}}
      className={`justify-end p-0 m-0 `}
    >
      {/* Add your modal content here */}
      <View className={`bg-white justify-between p-4 rounded-t-2xl`}>
        <Text className="text-lg " style={{...FONTS.fontBold}}>Upload Currículo</Text>
        <Text className="text-sm text-gray-500" style={{...FONTS.fontRegular, fontSize: 14, lineHeight: 21}}>
            O upload do currículo é feito através de um arquivo PDF. O tamanho máximo do arquivo é de 1MB.
        </Text>
      </View>

      <View className={`w-full bg-white items-center px-4 py-3`}>
        <TouchableOpacity
          className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg"
          onPress={saveCV}
        >
          <Text
            className="text-dark text-center"
            style={{
              ...FONTS.fontMedium,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            Upload
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CVUpload;
