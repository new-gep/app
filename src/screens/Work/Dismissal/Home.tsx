import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { FONTS } from "../../../constants/theme";
import DismissalCard from "../../../components/Card/DismissalCard";
import { useNavigation } from "@react-navigation/native";
import Cardstyle4 from "../../../components/Card/Cardstyle4";
import { IMAGES } from "../../../constants/Images";
import DocumentCard from "../../../components/Card/DocumentCard";
import FindPicture from "../../../hooks/findOne/picture";
import useCollaborator from "../../../function/fetchCollaborator";
import FindBucketCollaborator from "../../../hooks/bucket/collaborator";
import FindCollaborator from "../../../hooks/findOne/collaborator";
import FindFile from "../../../hooks/get/job/findFile";
import GetColaboratorJob from "../../../hooks/get/job/findJobColaborator";
import DismissalSteps from "./Step/Medical";
import Company from "./Step/Solicitation/Company";
import Collaborator from "./Step/Solicitation/Collaborator";
import Medical from "./Step/Medical";
import Signature from "./Step/Signature";
import FindOneJob from "../../../hooks/get/job/findOne";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";

const DismissalHome = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [jobConected, setJobConected] = useState<any>(null);
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [idWork, setIdWork] = useState<number | null>(null);
  const [solicitationType, setSolicitationType] = useState<'company' | 'collaborator' | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setProcess(false);
      fetchCollaborator();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindCollaborator(collaborator.CPF);
        if (response.status == 200) {
          if (response.collaborator.id_work) {
            setIdWork(response.collaborator.id_work);
            const responseJob = await FindOneJob(response.collaborator.id_work)
            if (responseJob.status == 200){
              const response = JSON.parse(responseJob.job.demission);
              
              setCurrentStep(response.step);
              setSolicitationType(response.solicitation)
              setJobConected(response.job)
            }
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);



  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {error ? (
        <View className={`mt-10 items-center`}>
          <Text style={{ ...FONTS.fontMedium }} className={`text-danger`}>
            ERRO
          </Text>
          <Text style={{ ...FONTS.fontMedium }}>
            Algo deu errado, tente mais tarde
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
        >
          <View className="px-5 mt-14">
            <View className="flex-row items-center mb-5">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Text
                    style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
                    className="text-center"
                  >
                    ←
                  </Text>
                </View>
              </TouchableOpacity>

              <Text
                className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center -ml-10"
                style={FONTS.fontSemiBold}
              >
                {solicitationType === 'company' ? 'Demissão pela Empresa' : 'Solicitação de Demissão'}
              </Text>
            </View>

            {currentStep === 1 && (
                solicitationType == 'company'? 
                <Company/> 
                :
                solicitationType == 'collaborator'? 
                <Collaborator/> 
                :
                <Text>
                  Não identificamos o tipo da solicitação
                </Text>
            )}
            {currentStep === 2 && (
                <Medical/>
            )}
            {currentStep === 3 && collaborator && collaborator.CPF &&(
              <Signature 
                jobConected={jobConected} 
                CPF={collaborator.CPF} 
              />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DismissalHome;
