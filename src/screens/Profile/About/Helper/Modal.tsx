import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "~/src/constants/theme";

export default function ModalDates({ visible, setVisible, dates }: any) {
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.8}
      onBackdropPress={() => setVisible(false)}
      useNativeDriver={true}
      className={`justify-end p-0 m-0 `}
    >
      <View
              className={`bg-white flex-row justify-between p-4 rounded-t-2xl `}
            >
              <View>
                <Text className="text-lg" style={{...FONTS.fontBold}}>Currículo Preview</Text>
               
                  <Text className="text-sm text-gray-500" style={{...FONTS.fontRegular, fontSize: 14, lineHeight: 21}}>
                    O preview é a visualização do seu currículo, você pode visualizar o seu upload ou seu CV gerado no app.
                  </Text>
                
              </View>
              
                <TouchableOpacity
                  onPress={()=>{
                    
                }}
                >
                  {/* <AntDesign name="closecircleo" size={24} color="black" /> */}
                  {/* <FontAwesome name="close" size={24} color="black" /> */}
                </TouchableOpacity>
              
            </View>
    </Modal>
  );
}
