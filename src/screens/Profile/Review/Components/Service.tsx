import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import useCollaborator from "~/src/function/fetchCollaborator";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Service() {
  const { collaborator } = useCollaborator();
  const [allService, setAllService] = useState<any>(null)

  const extractAllServices = (servicesObject: any): string[] => {
  const allServices: string[] = [];

  const deepExtract = (obj: any) => {
    for (const key in obj) {
      const value = obj[key];
      if (Array.isArray(value)) {
        allServices.push(...value); // adiciona os serviços
      } else if (typeof value === "object" && value !== null) {
        deepExtract(value); // desce mais um nível
      }
    }
  };

  deepExtract(servicesObject);
  return allServices;
  };

  useEffect(() => {
    if (collaborator) {
      const allServiceList = extractAllServices(collaborator.service);
      setAllService(allServiceList)
    }
  }, [collaborator]);

  const renderTagList = (items: string[]) => (
    <View>
      <View>
        <View className="flex-row flex-wrap">
          {items.length > 0 ? items.map((item, index) => (
            <Text
              key={index}
              style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
            >
              {item}
            </Text>
          )) : (
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>Não informado</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <Text
        className="mb-6"
        style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}
      >
        Serviços
      </Text>
      {allService ? renderTagList(allService) : <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>Não informado</Text>}
    </View>
  );
}

const Style = {
  container: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
};
