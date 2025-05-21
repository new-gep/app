import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "~/src/constants/theme";
import CVGep from "./helper/GepCV";
import CVPDF from "./helper/PDFCV";
import { FontAwesome } from "@expo/vector-icons";
import FindBucketCollaborator from "~/src/hooks/bucket/collaborator";
const CVPreview = ({ visible, setVisible, collaborator }: any) => {
  const [GepView, setGepView] = useState<boolean>(false);
  const [PDFView, setPDFView] = useState<boolean>(false);
  const [path, setPath] = useState<any>(null);

  const fetchData = async () => {
    const response = await FindBucketCollaborator(collaborator.CPF, 'cv');
    if (response.status === 200) {
      setPath(response.path);
    }
    return response.path;
  }

  useEffect(() => {
    fetchData();
  })

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.8}
      useNativeDriver={true}
      onBackdropPress={() => {
        setVisible(false)
        setGepView(false)
        setPDFView(false)
      }}
      className={`justify-end p-0 m-0 `}
    >
      {/* Add your modal content here */}
      <View
        className={`bg-white flex-row justify-between p-4 ${!GepView && !PDFView && "rounded-t-2xl"} `}
      >
        <View>
          <Text className="text-lg" style={{...FONTS.fontBold}}>Currículo Preview</Text>
          { (!GepView && !PDFView) && 
            <Text className="text-sm text-gray-500" style={{...FONTS.fontRegular, fontSize: 14, lineHeight: 21}}>
              O preview é a visualização do seu currículo, você pode visualizar o seu upload ou seu CV gerado no app.
            </Text>
          }
        </View>
        
        { (GepView || PDFView) && 
          <TouchableOpacity
            onPress={()=>{
              setGepView(false)
              setPDFView(false)
          }}
          >
            {/* <AntDesign name="closecircleo" size={24} color="black" /> */}
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        }
      </View>

      {PDFView && (
          <View className="flex-1 bg-white">
            <CVPDF path={path}/>
          </View>
        )}

      {GepView && (
        <View className="flex-1 bg-white">
          <CVGep />
        </View>
      )}

      {!GepView && !PDFView && (
        <View className={`w-full bg-white items-center px-4 py-3`}>
          <TouchableOpacity
            className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg"
            onPress={() => {
              setGepView(true);
            }}
          >
            <Text
              className="text-dark text-center"
              style={{
                ...FONTS.fontMedium,
                fontSize: 14,
                lineHeight: 21,
              }}
            >
              CV Gep
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2.5 bg-primary rounded-lg w-1/2"
            onPress={() => {
              setPDFView(true);
            }}
          >
            <Text
              className="text-dark text-center"
              style={{
                ...FONTS.fontMedium,
                fontSize: 14,
                lineHeight: 21,
              }}
            >
              CV PDF
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

export default CVPreview;
