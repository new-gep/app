import Work from "../Work/Work";
import Documents from "../Documents/Documents";
import { useEffect, useState } from "react";
import FindCollaborator from "~/src/hooks/findOne/collaborator";
import FindOneJob from "~/src/hooks/get/job/findOne";
import useCollaborator from "~/src/function/fetchCollaborator";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import HomeWork from "../Work/Home";
import HomeNoWork from "../Work/HomeNoJob";
import { COLORS } from "~/src/constants/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const Default = () => {
  const [titleWork, setTitleWork] = useState<string>("");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [hasWork, setHaswork] = useState<boolean>(false);
  const [jobConected, setjobConected] = useState<any>();
  const [CPF, setCPF] = useState<any>();
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const cpfString = collaborator.CPF.toString().padStart(11, "0");
        // console.log(cpfString)
        const response = await FindCollaborator(cpfString);

        setHaswork(
          response.collaborator.id_work ? response.collaborator.id_work : false
        );
        // console.log("response", response.collaborator.id_work)
        setCPF(cpfString);
        if (response.status === 200) {
          const responseJob = await FindOneJob(collaborator.id_work);
          // console.log("hasWork", responseJob)
          if (responseJob.status === 200) {
            setjobConected(responseJob.job);
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);

  return (
    <>
      {hasWork === null ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : hasWork ? (
        <>
          <HomeWork
            setTitleWork={setTitleWork}
            navigation={navigation}
          jobConected={jobConected}
          CPF={CPF}
        />
        </>
      ) : (
        <HomeNoWork />
      )}
    </>
  );
};
export default Default;
