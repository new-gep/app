import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "~/src/constants/theme";
import Icon from "~/src/components/Icon/Icon";
const screenHeight = Dimensions.get("window").height;
export default function ModalDates({
  visible,
  setVisible,
  dates,
  onSelect,
}: any) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    let updatedSelected: string[];

    if (selected.includes(option)) {
      updatedSelected = selected.filter((item) => item !== option);
    } else {
      updatedSelected = [...selected, option];
    }

    setSelected(updatedSelected);
    
    if (onSelect) onSelect(updatedSelected); // chama callback
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
      <View
        style={{ maxHeight: screenHeight * 0.7 }}
        className={`bg-white justify-between rounded-t-2xl `}
      >
        <ScrollView
          className="bg-white p-3"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="items-center justify-center">
            <View className="border-b-2 border-2 rounded-lg border-gray-200 w-2/12 mb-4"></View>
          </View>
          <View className="flex-row flex-wrap">
            {dates.map((date: any) => (
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
                    selected.includes(date) ? "text-dark" : "text-gray-500"
                  }
                  style={{ ...FONTS.fontRegular, fontSize: 14 }}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
