import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { AbstractPicture } from "../../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../../layout/Header";
import AccordionCardIformation from "../../../components/Accordion/AccordionCardIformation";
import { GlobalStyleSheet } from "../../../constants/StyleSheet";
import { COLORS, FONTS } from "../../../constants/theme";
import Button from "../../../components/Button/Button";
import useCollaborator from "../../../function/fetchCollaborator";
import UpdateJobDefault from "../../../hooks/update/job/default";
import UnapplyJob from "~/src/hooks/update/job/unapplyJob";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  Accessibility,
  HandCoins,
  MapPin,
  FileText,
  Banknote,
  Plus,
  Building2,
  UserRound,
} from "lucide-react-native";

type CompanyType = {
  company_name: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  district: string;
  city: string;
  uf: string;
  zip_code?: string;
  logo?: string;
};

type CardInformationProps = {
  route: {
    params: {
      cardData: any;
      onSwipeLeft: any;
    };
  };
};

const CardInformationPeople = ({ route }: CardInformationProps) => {
  const { cardData, onSwipeLeft } = route.params;
  const navigation = useNavigation();
  const { collaborator } = useCollaborator();
  const [isLoading, setIsLoading] = useState(false);
  const [isCandidateApplied, setIsCandidateApplied] = useState(false);

  useEffect(() => {
    const checkCandidateStatus = () => {
      // console.log('=== DEBUG CANDIDATE STATUS ===');
      // console.log('CardData:', cardData);
      // console.log('Candidates type:', typeof cardData?.candidates);
      // console.log('Candidates:', JSON.stringify(cardData?.candidates, null, 2));
      // console.log('Collaborator:', collaborator);
      // console.log('Collaborator CPF type:', typeof collaborator?.CPF);
      // console.log('Collaborator CPF:', collaborator?.CPF);

      if (!cardData?.candidates || !collaborator?.CPF) {
        // console.log('Missing data - candidates or CPF');
        return;
      }

      try {
        const parsedCandidates =
          typeof cardData.candidates === "string"
            ? JSON.parse(cardData.candidates)
            : cardData.candidates;

        if (!Array.isArray(parsedCandidates)) {
          console.log("Candidates is not an array after parsing");
          return;
        }

        const isApplied = parsedCandidates.some((candidate) => {
          const candidateCpf = String(candidate.cpf).replace(/\D/g, "");
          const collaboratorCpf = String(collaborator.CPF).replace(/\D/g, "");

          // console.log('Comparing CPFs:', {
          //   candidateCpf,
          //   collaboratorCpf,
          //   isEqual: candidateCpf === collaboratorCpf
          // });

          return candidateCpf === collaboratorCpf;
        });

        setIsCandidateApplied(isApplied);
      } catch (error) {
        console.error("Error checking candidate status:", error);
      }
    };

    checkCandidateStatus();
  }, [cardData, collaborator]);

  const handleRemoveApplication = async () => {
    try {
      setIsLoading(true);
      //@ts-ignore
      const response = await UnapplyJob(cardData.id, collaborator?.CPF);
      if (response.status === 200) {
        alert("Candidatura removida com sucesso!");
        // onSwipeLeft()
        navigation.goBack();
      } else {
        throw new Error("Erro ao remover candidatura");
      }
      return;
    } catch (error) {
      console.error("Erro ao remover candidatura:", error);
      alert("Erro ao remover candidatura. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToJob = async () => {
    // try {
    //   setIsLoading(true);
    //   //@ts-ignore
    //   const response = await ApplyJob(cardData.id, collaborator?.CPF);
    //   if (response.status === 200) {
    //     onSwipeLeft()
    //     alert("Candidatura realizada com sucesso!");
    //     navigation.goBack();
    //   }
    //   else if (response.status === 400) {
    //     onSwipeLeft()
    //     alert("Você já se candidatou a esta vaga.");
    //   }
    //   else {
    //     throw new Error("Erro ao realizar candidatura");
    //   }
    //   return;
    // } catch (error) {
    //   console.error("Erro ao realizar candidatura:", error);
    //   alert("Erro ao realizar candidatura. Tente novamente.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header com botão de voltar */}
      <Header title="Detalhes do Serviço" leftIcon="back" />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Cabeçalho do Card */}
        <View className="mb-5">
          <Text
            className="text-dark capitalize"
            style={{ ...FONTS.fontSemiBold, fontSize: rf(23) }}
          >
            {cardData.function}
          </Text>

          <View className="flex-row flex-1 mb-4 items-center">
            <View className="rounded-full bg-zinc-100 items-center justify-center p-2 mr-3">
              <UserRound size={rf(17)} />
            </View>
            <Text
              style={{ fontSize: rf(12) }}
              className=" text-gray-600 uppercase"
            >
              {cardData.name || "Empresa confidencial"}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center space-x-2 mb-1">
              {/* <FontAwesome name="check" size={24} color="black" /> */}
              <Text className="px-1" style={[FONTS.fontBold]}>
                Informações
              </Text>
            </View>
            <View className="rounded-lg px-3 gap-1">
              <View className="flex-row items-center gap-2">
                {/* <View className="bg-dark p-2 rounded-full">
                  <FontAwesome6
                    name="map-location-dot"
                    size={20}
                    color="#fde047"
                  />
                </View> */}
                <MapPin size={rf(20)} />
                <Text style={[FONTS.font, { color: COLORS.text }]}>
                  {cardData.locality && `${cardData.locality}`}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                {/* <View className="bg-dark p-2 rounded-full">
                  <FontAwesome6 name="money-bills" size={20} color="#fde047" />
                </View> */}
                <Banknote size={rf(20)} />
                <Text style={[FONTS.font, { color: COLORS.text }]}>
                  {cardData.salary && Mask("amount", cardData.salary)}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                {/* <View className="bg-dark p-2 rounded-full">
                  <FontAwesome6 name="laptop" size={20} color="#fde047" />
                </View> */}
                <HandCoins size={rf(20)} />
                <Text style={[FONTS.font, { color: COLORS.text }]}>
                  {cardData.model && `${cardData.model}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <Text className="px-1" style={[FONTS.fontBold]}>
            Galeria
          </Text>
          <View
            className="flex-1 flex-row justify-between"
            style={{ height: rf(150) }}
          >
            <View className="w-1/3 p-2 ">
              <TouchableOpacity className="w-full h-full rounded-xl bg-zinc-200 items-center justify-center">
                <Plus size={rf(20)} />
              </TouchableOpacity>
            </View>
            <View className="w-1/3 p-2">
              <TouchableOpacity className="w-full h-full rounded-xl bg-zinc-200 items-center justify-center">
                <Plus size={rf(20)} />
              </TouchableOpacity>
            </View>
            <View className="w-1/3 p-2">
              <TouchableOpacity className="w-full h-full rounded-xl bg-zinc-200 items-center justify-center">
                <Plus size={rf(20)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <Text className="px-1" style={[FONTS.fontBold]}>
            O que está incluído
          </Text>
          <View className="px-3">
            <Text className="text-justify" style={[FONTS.fontLight]}>
                {cardData.included}
            </Text>
          </View>
        </View>

        <View className="mt-5">
          <Text className="px-1" style={[FONTS.fontBold]}>
            O que não está incluído
          </Text>
          <View className="px-3">
            <Text className="text-justify" style={[FONTS.fontLight]}>
                {cardData.notIncluded}
            </Text>
          </View>
        </View>

        <View className="mt-5">
          <Text className="px-1" style={[FONTS.fontBold]}>
            Informações
          </Text>
          <View className="px-3">
            <Text className="text-justify" style={[FONTS.fontLight]}>
                {cardData.info}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute z-10 right-5 bottom-5">
        <TouchableOpacity
          onPress={
            isCandidateApplied ? handleRemoveApplication : handleApplyToJob
          }
          className={`w-[60px] h-[60px] rounded-full justify-center items-center ${
            isCandidateApplied ? "bg-red-600" : "bg-success"
          } opacity-80`}
          style={{
            height: rf(60),
            width: rf(60),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          {isCandidateApplied ? (
            <FontAwesome name="minus" size={rf(25)} color={COLORS.white} />
          ) : (
            <FontAwesome name="plus" size={rf(25)} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardInformationPeople;
