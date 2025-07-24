import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import FindPropostal from "~/src/hooks/get/announcement/findPropostal";
import useCollaborator from "~/src/function/fetchCollaborator";
import { ChevronRight, Info, Mail, User, UserCheck } from "lucide-react-native";
import applyPropostal from "~/src/hooks/update/announcement/applyPropostal";

export default function ModalPropostal({ visible, setVisible, item }: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [refreshing, setRefreshing] = useState<number>(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const [propostal, setPropostal] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const { collaborator } = useCollaborator();



  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);
      if (index === -1) {
        setVisible(false);
      }
    },
    [setVisible]
  );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6} // você pode ajustar para 0.4 ou 0.8 se quiser mais claro ou mais escuro
      />
    ),
    []
  );

  const fetchData = async () => {
    try {
      if (!collaborator) return;
      setLoader(true);
      const response = await FindPropostal(
        item.collaborator.CPF,
        collaborator.CPF
      );
      if (response.status == 200) {
        setPropostal(response.propostal);
      }
    } finally {
      setLoader(false);
    }
  };

  const sendPropostal = async (data: any) => {
    if (data.alreadyCandidate) {
      Alert.alert(
        "Atenção",
        "Esta pessoa já se candidatou a esta vaga.",
        [{ text: "OK" }],
        { cancelable: true }
      );
      return;
    }

    Alert.alert(
      "Enviar proposta",
      "Deseja realmente enviar uma proposta para esta pessoa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await applyPropostal(
                data.id,
                item.collaborator.CPF
              );
              console.log(response);
              if (response.status == 200) {
                Alert.alert("Sucesso", "Proposta enviada com sucesso.");
                setRefreshing(refreshing + 1);
              } else {
                Alert.alert(
                  "Erro",
                  "Proposta não enviada, tente novamente mais tarde."
                );
              }
            } catch (error) {
              console.error("Erro ao enviar proposta:", error);
              Alert.alert("Erro", "Não foi possível enviar a proposta.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (currentSnapIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentSnapIndex]);

  useEffect(() => {
    fetchData();
  }, [collaborator, refreshing]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={["25%", "80%"]}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="flex-row items-center mb-8 px-5">
          <View
            style={{ height: rf(45), width: rf(45) }}
            className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-2"
          >
            <Mail size={rf(22)} />
          </View>
          <View>
            <Text
              style={{
                fontSize: rf(13),
                ...FONTS.fontSemiBold,
                textTransform: "capitalize",
              }}
              className="capitalize"
            ></Text>
            <Text
              className="text-gray-500"
              style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
            >
              Envie sua Proposta
            </Text>
            <Text
              className="text-gray-500"
              style={{ ...FONTS.fontLight, fontSize: rf(10) }}
            >
              Escolha um serviço e envie sua proposta
            </Text>
          </View>
        </View>
        {currentSnapIndex > 0 && (
          <BottomSheetScrollView
            contentContainerStyle={{
              flexGrow: 1, // Permite que o conteúdo cresça
              flex: 1,
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
              }}
              className="px-5 "
            >
              {!loader ? (
                propostal.length > 0 ? (
                  propostal.map((item: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        borderBottomWidth:
                          index !== propostal.length - 1 ? 1 : 0,
                        borderBottomColor: "#E0E0E0",
                        paddingBottom: rf(10),
                        marginBottom: rf(10),
                      }}
                    >
                      <TouchableOpacity
                        className="flex-row w-full justify-between items-center"
                        onPress={() => sendPropostal(item)}
                      >
                        <View className="flex-row items-center">
                          {item.alreadyCandidate ? (
                            <UserCheck size={rf(16)} className="mr-1" />
                          ) : (
                            <User size={rf(16)} className="mr-1" />
                          )}

                          <Text
                            style={{
                              ...FONTS.fontLight,
                              fontSize: rf(12),
                              marginRight: 6,
                            }}
                          >
                            {item.title || "Título não informado"}
                          </Text>

                          {/* ✅ Mensagem correta baseada na combinação das flags */}
                          {item.propostal ? (
                            <Text
                              style={{
                                ...FONTS.fontLight,
                                fontSize: rf(10),
                                marginLeft: 4,
                                color: "#4CAF50",
                              }}
                            >
                              (Proposta enviada)
                            </Text>
                          ) : item.alreadyCandidate ? (
                            <Text
                              style={{
                                ...FONTS.fontLight,
                                fontSize: rf(10),
                                marginLeft: 4,
                                color: "#4CAF50",
                              }}
                            >
                              (É candidato)
                            </Text>
                          ) : null}
                        </View>
                        <ChevronRight size={rf(16)} />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View className="items-center justify-center mt-4">
                    <Text
                      style={{
                        ...FONTS.fontLight,
                        fontSize: rf(10),
                      }}
                      className="text-gray-800"
                    >
                      Nenhum serviço criado até o momento.
                    </Text>
                  </View>
                )
              ) : (
                <View className="items-center justify-center">
                  <Text style={{ ...FONTS.fontBlack, fontSize: rf(10) }}>
                    Buscando Propostas
                  </Text>
                  <ActivityIndicator color="black" size={rf(15)} />
                </View>
              )}
            </Animated.View>
          </BottomSheetScrollView>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
