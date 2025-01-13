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
};
type PicturesProps = {
  CNH: { status: string } | null;
  Voter_Registration: { status: string } | null;
  [key: string]: { status: string | null } | null;
};

const JobAdmissionScreen: React.FC<Props> = (jobConected) => {
  useEffect(() => {
    console.log(jobConected);
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
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
            >
              <View className={`px-5`}>
                <CheckCadasterCollaboratorDocument />
              </View>
              <View className={`p-3`}>
                <View className={""}>
                  <Timeline />
                </View>
              </View>

              <View style={{ marginTop: 50 }}>
                <View style={{ marginBottom: 30 }}>
                  <Cardstyle4
                    documentName={"mediacalExamination"}
                    sendDocument={true}
                    typeDocument={null}
                    statusDocument={null}
                    twoPicture={false}
                    path={null}
                  />
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
