import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Dimensions } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import ProposalCard from "./Card";
import findAllPropostalsByCPF from "~/src/hooks/get/announcement/findAllPropostalsByCPF";
import useCollaborator from "~/src/function/fetchCollaborator";
import { FONTS } from "~/src/constants/theme";
import AwaitFetch from "~/src/components/LoadScreen/Load";
import { IMAGES } from "~/src/constants/Images";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Proposal() {
  const [propostal, setPropostal] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { collaborator } = useCollaborator();
  const { width, height } = Dimensions.get("window");
  const fetchData = async () => {
    try {
      if (!collaborator) return;
      const response = await findAllPropostalsByCPF(collaborator.CPF);
      if (response.status == 200) {
        setPropostal(response.receivedPropostals);
        console.log(response.receivedPropostals);
      }
      setLoader(false);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, [collaborator]);

  const render = ({ item }: { item: any }) => {
    return <ProposalCard item={item} />;
  };

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Propostas" />
        <ScrollView className="px-4 pt-4">
          {loader ? (
            <AwaitFetch />
          ) : propostal.length > 0 ? (
            <FlatList
              data={propostal}
              renderItem={render}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View className="items-center justify-center h-full ">
              <Image
                source={IMAGES.unique28}
                style={{
                  height: height * 0.4,
                  width: width * 0.8,
                  resizeMode: "contain",
                  opacity: 0.8,
                }}
              />
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(13) }}
                className=""
              >
                Nenhuma proposta encontrada!
              </Text>
              <Text
                style={{ ...FONTS.fontLight, fontSize: rf(11) }}
                className="text-center"
              >
                Fique tranquilo, em breve alguém entrará em contato com você.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
