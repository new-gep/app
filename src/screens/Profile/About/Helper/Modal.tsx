import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "~/src/constants/theme";

export default function ModalDates({ visible, setVisible, dates }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item:any) => item !== option));
    } else {
      setSelected([...selected, option]);
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
      onBackdropPress={() => setVisible(false)}
      useNativeDriver={true}
      className={`justify-end p-0 m-0 `}
    >
      <View className={`bg-white justify-between p-4 rounded-t-2xl `}>
        <View className="items-center justify-center">
          <View className="border-b-2 border-2 rounded-lg border-gray-200 w-2/12 mb-4" >

          </View>
        </View>
        <View className="flex-row flex-wrap">
          {dates.map((date:any) => (
            <TouchableOpacity
              key={date}
              style={styles.select}
              className={`m-1 px-4 py-2 rounded-full ${
                selected.includes(date) ? "bg-primary" : "bg-white"
              }`}
              onPress={() => toggleOption(date)}
            >
              <Text
                className={
                  selected.includes(date) ? "text-dark" : "text-gray-400"
                }
                style={{ ...FONTS.fontRegular, fontSize: 14 }}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => {}}>
          {/* <AntDesign name="closecircleo" size={24} color="black" /> */}
          {/* <FontAwesome name="close" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = {
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  select: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
