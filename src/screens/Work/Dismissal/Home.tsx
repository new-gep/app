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
import { COLORS, FONTS } from "../../../constants/theme";
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
import Header from "../../../layout/Header";
import Button from '../../../components/Button/Button'

const { width, height } = Dimensions.get("window");

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
    console.log("currentStep", currentStep)
  }, [currentStep])
  
  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindCollaborator(collaborator.CPF);
        if (response.status == 200) {
          if (response.collaborator.id_work) {
            setIdWork(response.collaborator.id_work);
            const responseJob = await FindOneJob(response.collaborator.id_work)
            console.log("responseJob", responseJob.status)
            console.log("responseJob", collaborator.CPF)
            if (responseJob.status == 200){
              const response = JSON.parse(responseJob.job.demission);
              setCurrentStep(response.step);
              setSolicitationType(response.solicitation)
              setJobConected(responseJob.job)
            }
          }
        }

      }
    };
    fetchData();
  }, [collaborator]);



  return (
    <View className="flex-1 bg-white ">
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
          <Header
            title="Desligamento"
            leftIcon="back"
            leftAction={() => navigation.goBack()}
          />
          <View className="px-5 mt-14">


            {currentStep === 1 && (
                solicitationType == 'company'? 
                <Company jobConected={jobConected} CPF={collaborator.CPF}/> 
                :
                solicitationType == 'collaborator'? 
                <Collaborator /> 
                :
                <View className="h-full items-center justify-between">
                  <View className="w-full items-center justify-center mt-2">
                      <Text
                      className="text-center"
                      style={{
                        ...FONTS.fontSemiBold,
                        fontSize: 18,
                        color: COLORS.title,
                      }}
                    >
                      Nada por aqui!
                    </Text>
                    <Text className="text-center text-sm text-gray-400 font-normal">
                      Você não está em um processo de demissão
                    </Text>
                  </View>
                  
                  <View className="w-full h-1/2">
                    <Image 
                      source={IMAGES.unique18} 
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>

                  <View className="mb-5">
                  <Button 
                        title={"Solicitar Desligamento"}
                        onPress={() => setSolicitationType('collaborator')}
                        text ={COLORS.title}
                        color={COLORS.primary}
                        style={{borderRadius:52 , width: width * 0.7}}
                    />
                  </View>
                </View>
            )}
            {currentStep === 2 && collaborator && collaborator.CPF && (
              <Medical
                jobConected={jobConected}
                CPF={collaborator.CPF}
              />
            )}
            {currentStep === 3 && collaborator && collaborator.CPF &&(
              <Signature 
                jobConected={jobConected} 
                CPF={collaborator.CPF} 
              />
            )}
            {currentStep === 4 && collaborator && collaborator.CPF &&(
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
