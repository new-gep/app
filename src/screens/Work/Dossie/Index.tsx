import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../../layout/Header";
import { GlobalStyleSheet } from "~/src/constants/StyleSheet";
import { COLORS, FONTS } from "~/src/constants/theme";
import DossieCollaborator from "~/src/hooks/get/collaborator/Dossie";
import useCollaborator from "~/src/function/fetchCollaborator";

export default function Dossie() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [allDocument , setAllDocument ] = useState(null);
  const { collaborator } = useCollaborator();

  const filterData = (val:any) => {
    setActiveFilter(val); // Update active filter when a filter is selected
    if(val === 'all'){
        // setOrderData(MyorderData);
    } else {
        // const newArry = MyorderData.filter(e:any => e.status === val);
        // setOrderData(newArry);
    }
  }

  const fetchData = async () => {
    const response = await DossieCollaborator(collaborator?.CPF)
    console.log('res ',response)
  }

  useEffect(()=>{
    if(collaborator){
      fetchData()
    }
  },[collaborator])



  return (
    <View className="bg-white  h-full">
      <Header title="Dossiê" leftIcon={"back"} iconSimple={"folder"} />
      <View
        style={[
          {
            width: "auto",
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 10,
            zIndex: 10,
            backgroundColor: COLORS.title,
            borderRadius: 60,
            height: 65,
            //alignItems:'center',
            justifyContent: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <View style={GlobalStyleSheet.flex}>
          <TouchableOpacity
            onPress={() => filterData("all")}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor:
                activeFilter === "all" ? COLORS.primary : COLORS.title,
              borderRadius: 50,
            }}
          >
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 14,
                  color: activeFilter === "all" ? COLORS.dark : COLORS.card,
                },
              ]}
            >
              Documentos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterData("ongoing")}
            activeOpacity={0.5}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor:
                activeFilter === "ongoing" ? COLORS.primary : COLORS.title,
              borderRadius: 50,
            }}
          >
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 14,
                  color: activeFilter === "ongoing" ? COLORS.dark : COLORS.card,
                },
              ]}
            >
              Admissão
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterData("completed")}
            activeOpacity={0.5}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor:
                activeFilter === "completed" ? COLORS.primary : COLORS.title,
              borderRadius: 50,
            }}
          >
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 14,
                  color:
                    activeFilter === "completed" ? COLORS.dark : COLORS.card,
                },
              ]}
            >
              Demissão
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>

      </ScrollView>
    </View>
  );
}
