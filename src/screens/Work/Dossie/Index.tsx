import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "../../../layout/Header";
import { GlobalStyleSheet } from "~/src/constants/StyleSheet";
import { COLORS, FONTS } from "~/src/constants/theme";
import DossieCollaborator from "~/src/hooks/get/collaborator/Dossie";
import useCollaborator from "~/src/function/fetchCollaborator";
import Cardstyle4 from "~/src/components/Card/Cardstyle4";

export default function Dossie() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [allDocumentAdmission, setAllDocumentAdmission] = useState<any>(null);
  const [allDocumentDismission, setAllDocumentDismission] = useState<any>(null);
  const [allDocumentCollaborator, setAllDocumentCollaborator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para o spinner
  const { collaborator } = useCollaborator();

  // Função para traduzir os nomes dos documentos
  const translateDocumentName = (name: string) => {
    const translations: { [key: string]: string } = {
      address: "Endereço",
      military_certificate: "Certificado Militar",
      school_history: "Histórico Escolar",
      work_card: "Carteira de Trabalho",
      experience_contract: "Contrato de Experiência",
      hours_compesantion: "Compensação de Horas",
      registration_form: "Formulário de Registro",
      transport_voucher: "Vale Transporte",
      hours_compensation: "Compensação de Horas",
      hours_extension: "Prorrogação de Horas",
    };
    return translations[name] || formatDynamicName(name); // Retorna o nome traduzido ou o original se não houver tradução
  };

  // Função para formatar nomes dinâmicos
  const formatDynamicName = (name: string) => {
    return name.replace(/([a-z])([A-Z])/g, "$1 $2"); // Adiciona espaço antes de letras maiúsculas
  };

  const fetchData = async () => {
    setIsLoading(true); // Ativa o spinner
    const response = await DossieCollaborator(collaborator?.CPF);
    if (response.status !== 200) {
      console.log("Erro ao buscar os cards:", response.message);
      setIsLoading(false); // Desativa o spinner em caso de erro
      return;
    }
    setAllDocumentAdmission(response.admissionFiles);
    setAllDocumentDismission(response.dismissal);
    setAllDocumentCollaborator(response.document.files);
    setIsLoading(false); // Desativa o spinner após carregar os dados
  };

  useEffect(() => {
    if (collaborator) {
      fetchData();
    }
  }, [collaborator]);

  return (
    <View className="bg-white h-full">
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
            justifyContent: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <View style={GlobalStyleSheet.flex}>
          <TouchableOpacity
            onPress={() => setActiveFilter("all")}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor: activeFilter === "all" ? COLORS.primary : COLORS.title,
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
            onPress={() => setActiveFilter("ongoing")}
            activeOpacity={0.5}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor: activeFilter === "ongoing" ? COLORS.primary : COLORS.title,
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
            onPress={() => setActiveFilter("completed")}
            activeOpacity={0.5}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 47,
              width: "32%",
              backgroundColor: activeFilter === "completed" ? COLORS.primary : COLORS.title,
              borderRadius: 50,
            }}
          >
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 14,
                  color: activeFilter === "completed" ? COLORS.dark : COLORS.card,
                },
              ]}
            >
              Demissão
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView>
          <View className="flex-1">
            {activeFilter === "all" && (
              <View style={{ paddingBottom: "17%" }}>
                {allDocumentCollaborator &&
                  allDocumentCollaborator.length > 0 &&
                  allDocumentCollaborator.map((item: any) => (
                    <View key={item.document} className="p-4 border-b border-gray-200">
                      <Cardstyle4
                        documentName={translateDocumentName(item.document.toLowerCase())}
                        statusDocument={item.status}
                        sendDocument={false}
                        twoPicture={item.type}
                        path={item.base64}
                        typeDocument={item.contentType}
                      />
                    </View>
                  ))}
              </View>
            )}
            {activeFilter === "ongoing" && (
              <View style={{ paddingBottom: "17%" }}>
                {allDocumentAdmission &&
                  allDocumentAdmission.map((item: any) => (
                    <View key={item.document} className="p-4 border-b border-gray-200">
                      <Cardstyle4
                        documentName={translateDocumentName(item.document.toLowerCase())}
                        statusDocument={item.status}
                        sendDocument={false}
                        twoPicture={item.twoPicture}
                        path={item.base64}
                        typeDocument={item.contentType}
                      />
                    </View>
                  ))}
              </View>
            )}
            {activeFilter === "completed" && (
              <View style={{ paddingBottom: "17%" }}>
                {allDocumentDismission &&
                  allDocumentDismission.map((item: any) => (
                    <View key={item.document} className="p-4 border-b border-gray-200">
                      <Cardstyle4
                        documentName={formatDynamicName(item.document)}
                        statusDocument={item.status}
                        sendDocument={false}
                        twoPicture={item.twoPicture}
                        path={item.base64}
                        typeDocument={item.contentType}
                      />
                    </View>
                  ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
