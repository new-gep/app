import React, { useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import CardPeople from "~/src/screens/Home/Helper/CardPeopleService";
import { ScrollView } from "react-native-gesture-handler";
export default function Candidate({ setModalStep, x }: any) {
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const renderItem = useCallback(
    (item: any) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  return (
    <View className="py-3 bg-white mt-5" style={styles.container}>
      <TouchableOpacity className="" onPress={() => setModalStep("menu")}>
        <ChevronLeft size={rf(25)} />
      </TouchableOpacity>
        <ScrollView>
            {data.map(renderItem)}
        </ScrollView>
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
