import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { AbstractPicture } from "../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../layout/Header";
import AccordionCardIformation from "../../components/Accordion/AccordionCardIformation";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS } from "../../constants/theme";
import Button from '../../components/Button/Button';
import useCollaborator from "../../function/fetchCollaborator";
import UpdateJobDefault from "../../hooks/update/job/default";
import Logo from "../../assets/picture/logo/logo_black.png";

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
}

type CardInformationProps = {
  route: {
    params: {
      cardData: {
        id: string;
        function: string;
        PCD: string;
        image: string;
        salary: string;
        contract_type: string;
        description: string;
        time: {
          journey: string;
        };
        company?: {
          company_name?: string;
          phone?: string;
          email?: string;
          street?: string;
          number?: string;
          district?: string;
          city?: string;
          uf?: string;
          zip_code?: string;
          logo?: string;
        };
        workload: string;
        benefics: string;
        obligations: string;
        details: string;
        candidates?: Array<{
          cpf: string;
          step: number;
          status: string | null;
          verify: string | null;
          observation: string | null;
        }>;
      };
    };
  };
};

const CardInformation = ({ route }: CardInformationProps) => {
  const { cardData } = route.params;
  const navigation = useNavigation();
  const { collaborator } = useCollaborator();
  const [isLoading, setIsLoading] = useState(false);
  const [isCandidateApplied, setIsCandidateApplied] = useState(false);

  useEffect(() => {
    const checkCandidateStatus = () => {
      return
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
        const parsedCandidates = typeof cardData.candidates === 'string' 
          ? JSON.parse(cardData.candidates) 
          : cardData.candidates;


        if (!Array.isArray(parsedCandidates)) {
          console.log('Candidates is not an array after parsing');
          return;
        }

        const isApplied = parsedCandidates.some(candidate => {
          const candidateCpf = String(candidate.cpf).replace(/\D/g, '');
          const collaboratorCpf = String(collaborator.CPF).replace(/\D/g, '');
          
          // console.log('Comparing CPFs:', {
          //   candidateCpf,
          //   collaboratorCpf,
          //   isEqual: candidateCpf === collaboratorCpf
          // });
          
          return candidateCpf === collaboratorCpf;
        });

        setIsCandidateApplied(isApplied);
        
      } catch (error) {
        console.error('Error checking candidate status:', error);
      }
    };

    checkCandidateStatus();
  }, [cardData, collaborator]);

  const handleRemoveApplication = async () => {
    try {
      setIsLoading(true);
      
      if (!cardData?.candidates) {
        throw new Error('Lista de candidatos inválida');
      }

      // Garante que candidates seja um array
      const currentCandidates = typeof cardData.candidates === 'string' 
        ? JSON.parse(cardData.candidates) 
        : cardData.candidates;

      if (!Array.isArray(currentCandidates)) {
        throw new Error('Lista de candidatos inválida após parse');
      }

      // Filtra o candidato atual da lista
      const updatedCandidates = currentCandidates.filter(candidate => {
        const candidateCpf = String(candidate.cpf).replace(/\D/g, '');
        const collaboratorCpf = String(collaborator?.CPF).replace(/\D/g, '');
        return candidateCpf !== collaboratorCpf;
      });

      // Atualiza a vaga removendo o candidato
      const response = await UpdateJobDefault(cardData.id, {
        candidates: JSON.stringify(updatedCandidates),
      });

      if (response.status === 200) {
        alert('Candidatura removida com sucesso!');
        // Primeiro volta para a tela anterior
        navigation.goBack();
        // Depois atualiza a Home
        // navigation.navigate('Home');
      } else {
        throw new Error('Erro ao remover candidatura');
      }
    } catch (error) {
      console.error('Erro ao remover candidatura:', error);
      alert('Erro ao remover candidatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToJob = async () => {
    try {
      setIsLoading(true);

      const newCandidate = {
        cpf: collaborator?.CPF,
        step: 0,
        status: null,
        verify: null,
        observation: null,
      };

      // Garante que candidates seja um array
      const currentCandidates = Array.isArray(cardData.candidates) ? cardData.candidates : [];
      const updatedCandidates = [...currentCandidates, newCandidate];

      const response = await UpdateJobDefault(cardData.id, {
        candidates: JSON.stringify(updatedCandidates),
      });

      if (response.status === 200) {
        alert('Candidatura realizada com sucesso!');
        navigation.goBack();
      } else {
        throw new Error('Erro ao realizar candidatura');
      }
    } catch (error) {
      console.error('Erro ao realizar candidatura:', error);
      alert('Erro ao realizar candidatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header com botão de voltar */}
      <Header title="Detalhes da Vaga" leftIcon="back" iconSimple="archive" />

      <ScrollView className="flex-1 p-4">
        {/* Cabeçalho do Card */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-dark">
            {cardData.function}
          </Text>
          <Text className="text-sm text-gray-600 mt-1 uppercase">
            {cardData.company?.company_name || "Empresa confidencial"}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {cardData.company?.city ? `${cardData.company.city}-${cardData.company.uf}` : "Localização não informada"}
          </Text>
          {cardData.PCD === "1" && (
            <View className="mt-2">
              <FontAwesome name="wheelchair-alt" size={24} color="black" />
            </View>
          )}
        </View>

        <View
          style={[
            GlobalStyleSheet.cardHeader,
            { borderBottomColor: COLORS.inputborder },
          ]}
        >
          {/* <Image
            // source={AbstractPicture[cardData.image]}
            source={Logo}
            resizeMode="contain"
            className="w-full h-[200px] mb-6"
          /> */}
        </View>

        <View style={[GlobalStyleSheet.card, { backgroundColor: COLORS.card }]} className="mt-3">           
          <AccordionCardIformation
            information={cardData}
            company={cardData.company as CompanyType}
            details={cardData.details}
          />
        </View>

        {/* Movendo o botão para dentro do ScrollView com margem adequada */}
        <View className="mt-8 mb-6 flex items-center">
          <Button
            title={isCandidateApplied ? "Remover Candidatura" : "Candidatar-se"}
            onPress={isCandidateApplied ? handleRemoveApplication : handleApplyToJob}
            color={isCandidateApplied ? COLORS.dark : COLORS.primary}
            text={isCandidateApplied ? COLORS.primary : COLORS.dark}
            className="rounded-lg w-4/5"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CardInformation;
