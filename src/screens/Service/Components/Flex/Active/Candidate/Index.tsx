import React, { useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import CardPeople from "~/src/screens/Home/Helper/CardPeopleService";
import { ScrollView } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
export default function Candidate({ setModalStep, item }: any) {


  return (
    <View className=" bg-white h-full w-full">
      <TouchableOpacity
        className="px-5 mb-5"
        onPress={() => setModalStep("menu")}
      >
        <ChevronLeft size={rf(25)} />
      </TouchableOpacity>
      {item.candidates ? (
        <ScrollView>
          <CardPeople id={item.id} data={item.candidates} />
        </ScrollView>
      ) : (
        <View className="items-center justify-center py-10">
          <Text
            style={{ ...FONTS.fontMedium, fontSize: rf(14) }}
            className="text-zinc-500"
          >
            Nenhum candidato encontrado.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
