import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { AbstractPicture } from "../../constants/abstract";

export default function CardHistory({ job }) {
  //     nome variavel    seta na variavel                 tipagem       inicia como null
  const [candidateStatus, setCandidateStatus] = useState<any | null>("start");
  useEffect(() => {
    const candidate = JSON.parse(job.candidates);
    setCandidateStatus(candidate[0]);

    // console.log("Conteúdo de job.candidates[0]:", job.candidates[0]); // Diagnóstico
  }, []);


const [stepStatus, setStepStatus] = useState<any | null>("start");
  useEffect(() => {
    const candidate = JSON.parse(job.candidates);
    setCandidateStatus(candidate[0]);

    // console.log("Conteúdo de job.candidates[0]:", job.candidates[0]); // Diagnóstico
  }, []);

  

  return (
    // <View>
    //   <ScrollView>
    //     <View className="p-4 justify-between flex-row border">
    //       <View className="w-1/2 h-full">
    //         <Image
    //           source={AbstractPicture[job.image]}
    //           resizeMode="contain"
    //           style={{ width: "100%", height: "100%", alignSelf: "center" }}
    //         />
    //       </View>

    //       <View className="w-1/2 items-center">
    //         <Text className="text-black text-lg font-semibold">
    //           {job && job.function}
    //         </Text>
    //         <Text className="text-black text-lg font-semibold">
    //           {job && job.salary}
    //         </Text>
    //         <Text className="text-black text-lg font-semibold">
    //           {candidateStatus.status === null
    //             ? "Em andamento"
    //             : candidateStatus.status === false
    //             ? "Reprovado":
    //             candidateStatus == "start"?'':
    //             "Aprovado"}
    //         </Text>
    //       </View>
    //     </View>
    //   </ScrollView>
    // </View>

    <View>
      <ScrollView>
        <View className="p-4 justify-between flex-row border">
          <View className="w-1/2 h-full">
            <Image
              source={AbstractPicture[job.image]}
              resizeMode="contain"
              style={{ width: "100%", height: "100%", alignSelf: "center" }}
            />
          </View>

          <View className="w-1/2 items-center">
            <Text className="text-black text-lg font-semibold">
              {job && job.function}
            </Text>
            <Text className="text-black text-lg font-semibold">
              {job && job.salary}
            </Text>
            <Text className="text-black text-lg font-semibold">
              {candidateStatus.status === null
                ? "Em andamento"
                : candidateStatus.status === false
                ? "Reprovado":
                candidateStatus == "start"?'':
                "Aprovado"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


