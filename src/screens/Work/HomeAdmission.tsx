import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { COLORS, FONTS } from "../../constants/theme";
import CheckCadasterCollaboratorDocument from "../utils/checkCadasterCollaboratorDocument";
import { IMAGES } from "../../constants/Images";
import Cardstyle4 from "../../components/Card/Cardstyle4";
import { isPending } from "@reduxjs/toolkit";
import Timeline from "./TimeLineAdmiss";
import FindPicture from "../../hooks/findOne/picture";

type Props = {
  jobConected: any;
  CPF: any;
};


const JobAdmissionScreen: React.FC<Props> = ({jobConected, CPF}) => {

  useEffect(() => {
    //console.log("CPF usuadhIFHS",CPF);
  }, []);
  

  const [error, setError] = useState<boolean>(false);

  return (
    <>
      {error ? (
        <View>
          <View className={`mt-10 items-center`}>
            <Text style={{ ...FONTS.fontMedium }} className={`text-danger`}>
              ERRO
            </Text>
            <Text style={{ ...FONTS.fontMedium }}>
              Algo deu errado, tente mais tarde
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
          <View className={'h-full'}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1}}
            >
              <View className={`px-5`}>
                <CheckCadasterCollaboratorDocument />
              </View>
              <View className={`p-3 h-full`}>
                <View className={"h-full"}>
                  <Timeline CPF={CPF} jobConected={jobConected} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

export default JobAdmissionScreen;
