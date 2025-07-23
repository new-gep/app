import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import {
  Share2,
  Banknote,
  MapPin,
  Check,
  CircleCheck,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronLeft,
  Building2,
  FileText,
  BriefcaseBusiness,
  Accessibility,
  Shapes,
  Minus,
} from "lucide-react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import UnapplyJob from "~/src/hooks/update/job/unapplyJob";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import useCollaborator from "~/src/function/fetchCollaborator";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4; // Minimum height (40% of screen)
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.9; // Maximum height (90% of screen

const WorkInformation = ({
  visible,
  setVisible,
  jobData,
  refresh,
  setRefresh,
  handleSwipeRight,
}: any) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const lastModalHeight = useRef(MIN_MODAL_HEIGHT);
  const expandedThreshold = (MIN_MODAL_HEIGHT + MAX_MODAL_HEIGHT) / 2;
  const [showVerifiedText, setShowVerifiedText] = useState(false);
  const contentOpacity = modalHeight.interpolate({
    inputRange: [MIN_MODAL_HEIGHT, expandedThreshold, MAX_MODAL_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });
  const { collaborator } = useCollaborator();

  // Gesture handling for header drag
  const onGestureEvent = (event: any) => {
    const { translationY } = event.nativeEvent;

    // Aplique um fator de amortecimento (ex: 0.3)
    let newHeight = lastModalHeight.current - translationY * 0.8; // Reduz a velocidade visual

    newHeight = Math.max(
      MIN_MODAL_HEIGHT,
      Math.min(newHeight, MAX_MODAL_HEIGHT)
    );
    modalHeight.setValue(newHeight);
    setShowContent(newHeight > expandedThreshold);
    const expanded = newHeight >= (MIN_MODAL_HEIGHT + MAX_MODAL_HEIGHT) / 2;
    if (expanded !== isExpanded) {
      setIsExpanded(expanded);
    }
  };

  const onHandlerStateChange = (event: any) => {
    const { translationY, state } = event.nativeEvent;

    if (state === State.ACTIVE) {
      // setDragging(true);
      // const adjustedY = translationY * 0.8; // mesmo damping que no onGestureEvent
      // setDragDirection(adjustedY < 0 ? "up" : "down");
    } else if (state === State.END || state === State.CANCELLED) {
      // setDragging(false);
      const finalHeight = lastModalHeight.current - translationY;
      let targetHeight;

      // Snap to min or max height, or close modal
      if (finalHeight < MIN_MODAL_HEIGHT * 0.8) {
        // Close modal if dragged too far down
        Animated.timing(modalHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setVisible(false);
          lastModalHeight.current = MIN_MODAL_HEIGHT;
          modalHeight.setValue(MIN_MODAL_HEIGHT); // reset for next open
        });
        return;
      } else if (finalHeight > (MIN_MODAL_HEIGHT + MAX_MODAL_HEIGHT) / 2) {
        // Snap to max height
        targetHeight = MAX_MODAL_HEIGHT;
      } else {
        // Snap to min height
        targetHeight = MIN_MODAL_HEIGHT;
      }

      // Animate to target height
      Animated.spring(modalHeight, {
        toValue: targetHeight,
        speed: 12,
        bounciness: 4,
        useNativeDriver: false,
      }).start(() => {
        lastModalHeight.current = targetHeight;
      });

      // setDragDirection(null);
    }
  };

  const updateIsExpanded = (height: number) => {
    const expanded = height >= expandedThreshold;
    setIsExpanded(expanded);
    lastModalHeight.current = height;
  };

  // Action handlers
  const handleShare = () => {};

  const handleView = () => {
    const targetHeight = isExpanded ? MIN_MODAL_HEIGHT : MAX_MODAL_HEIGHT;

    Animated.timing(modalHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => updateIsExpanded(targetHeight));
  };

  const handleApply = async () => {
    if (!collaborator) return;

    handleSwipeRight();
  };

  const handleUnapply = async () => {
    if (!collaborator) return;

    Alert.alert(
      "Confirmar desistência",
      "Tem certeza que deseja desistir desta candidatura?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, desistir",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await UnapplyJob(
                jobData.job.id,
                collaborator.CPF
              );
              if (response.status === 200) {
                Alert.alert(
                  "Sucesso",
                  "Você desistiu da candidatura com sucesso."
                );
                setRefresh((prev: number) => prev + 1);
                setVisible(false);
              } else {
                Alert.alert(
                  "Erro",
                  "Não foi possível desistir da candidatura. Tente novamente."
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                "Ocorreu um erro ao tentar desistir da candidatura."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.8}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver={true}
      propagateSwipe={true}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              height: modalHeight,
            },
          ]}
        >
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <View style={styles.headerContainer}>
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragIndicator} />
              </View>
              {/* Header Content */}
              <View style={styles.headerContent}>
                <View style={{ marginRight: rf(12), position: "relative" }}>
                  {jobData.photoUri ? (
                    <Image
                      source={{ uri: jobData.photoUri }}
                      style={{
                        width: rf(43),
                        height: rf(43),
                        borderRadius: 999,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#f4f4f5",
                        padding: 12,
                        borderRadius: 999,
                        alignItems: "center",
                        justifyContent: "center",
                        width: rf(43),
                        height: rf(43),
                      }}
                    >
                      <Building2 size={rf(25)} />
                    </View>
                  )}
                  {jobData.isVerified && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        height: rf(13),
                        width: rf(13),
                        borderRadius: rf(999),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className={"bg-primary"}
                    >
                      <Check size={rf(10)} className="text-dark" />
                    </View>
                  )}
                </View>
                <View>
                  <Text
                    className="capitalize"
                    style={{ ...FONTS.fontSemiBold, fontSize: rf(16) }}
                  >
                    {jobData?.job?.function
                      ? jobData.job.function
                      : "Cargo não informado"}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(12),
                      color: "#6b7280",
                    }}
                    className="w-10/12"
                  >
                    {jobData?.job?.CNPJ_company?.company_name
                      ? jobData.job.CNPJ_company.company_name
                      : "Nome da empresa não informado"}
                  </Text>
                </View>
                {jobData && jobData.isVerified && (
                  <TouchableOpacity
                    onPress={() => setShowVerifiedText((prev) => !prev)}
                    activeOpacity={0.7}
                    style={{
                      marginLeft: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: showVerifiedText ? 8 : 4,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                    className="bg-primary"
                  >
                    {showVerifiedText && (
                      <Text
                        style={{
                          ...FONTS.fontSemiBold,
                          fontSize: rf(6),
                          marginRight: rf(4),
                          color: "#0f172a", // text-dark
                        }}
                      >
                        Verificado
                      </Text>
                    )}
                    <CircleCheck size={rf(10)} className="text-dark" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </PanGestureHandler>
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View className="p-2 px-5 mb-5 bg-gray-50 rounded-xl flex-row justify-between">
              <View className="gap-4">
                <View className="flex-row items-center">
                  <Banknote size={rf(16)} className="mr-1" />
                  <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                    {jobData?.job?.salary
                      ? Mask("amount", jobData.job.salary)
                      : "Salário não informado"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={rf(16)} className="mr-1" />
                  <Text
                    className=""
                    style={{ ...FONTS.fontBlack, fontSize: rf(11) }}
                  >
                    {jobData?.job?.locality
                      ? jobData.job.locality
                      : "Localidade não informada"}
                  </Text>
                </View>
                {jobData?.job?.DEI && (
                  <View className="flex-row  items-center">
                    <Shapes size={rf(16)} className="mr-1" />
                    <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                      Vaga Afirmativa
                    </Text>
                  </View>
                )}
              </View>
              <View className="gap-4">
                <View className="flex-row items-center">
                  <FileText size={rf(16)} className="mr-1" />
                  <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                    {jobData?.job?.contract
                      ? jobData.job.contract
                      : "Contrato não informado"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <BriefcaseBusiness size={rf(16)} className="mr-1" />
                  <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                    {jobData?.job?.model
                      ? jobData.job.model
                      : "Modelo não informado"}
                  </Text>
                </View>

                {jobData?.job?.PCD && (
                  <View className="flex-row items-center">
                    <Accessibility size={rf(16)} className="mr-1" />
                    <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                      Vaga PCD
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Animated.View
              style={[
                {
                  opacity: contentOpacity,
                  overflow: "hidden",
                },
                !showContent && { height: 0 },
              ]}
            >
              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Responsabilidades
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {jobData?.job?.responsibility
                    ? jobData.job.responsibility
                    : "Nenhuma informação disponível"}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Requisitos
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {jobData?.job?.requirements
                    ? jobData.job.requirements
                    : "Nenhuma informação disponível"}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Competências
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {(() => {
                    let skills = [];

                    try {
                      // Dá parse se for string
                      skills =
                        typeof jobData?.job?.skills === "string"
                          ? JSON.parse(jobData.job.skills)
                          : jobData.job.skills;
                    } catch (e) {
                      // Em caso de erro no parse, deixa vazio
                      skills = [];
                    }

                    return Array.isArray(skills) && skills.length > 0
                      ? skills.join(", ")
                      : "Nenhuma informação disponível";
                  })()}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Benefícios
                </Text>
                <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                  {(() => {
                    let benefits = [];

                    try {
                      benefits =
                        typeof jobData?.job?.benefits === "string"
                          ? JSON.parse(jobData.job.benefits)
                          : jobData.job.benefits;
                    } catch (e) {
                      benefits = [];
                    }

                    return Array.isArray(benefits) && benefits.length > 0
                      ? benefits.join(", ")
                      : "Nenhuma informação disponível";
                  })()}
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
          <View style={styles.footerContainer}>
            {/* <TouchableOpacity
              style={{ flex: 1, padding: 12, alignItems: "center" }}
              onPress={handleShare}
            >
              <Share2 size={rf(24)} color="#71717a" />
              <Text
                style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
              >
                Compartilhar
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{ flex: 1, padding: 12, alignItems: "center" }}
              onPress={handleView}
            >
              {isExpanded ? (
                <>
                  <ChevronDown size={rf(24)} color="#71717a" />
                  <Text
                    style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
                  >
                    Recolher
                  </Text>
                </>
              ) : (
                <>
                  <ChevronUp size={rf(24)} color="#71717a" />
                  <Text
                    style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
                  >
                    Visualizar
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {jobData.isCandidate ? (
              <TouchableOpacity
                style={{ flex: 1, padding: 12, alignItems: "center" }}
                onPress={handleUnapply}
              >
                <Minus size={rf(24)} color="#71717a" />
                <Text
                  style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
                >
                  Cancelar Candidatura
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flex: 1, padding: 12, alignItems: "center" }}
                onPress={handleApply}
              >
                <Plus size={rf(24)} color="#71717a" />
                <Text
                  style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
                >
                  Candidatar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: rf(24),
    borderTopRightRadius: rf(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: {
    paddingHorizontal: rf(20),
    paddingTop: rf(10),
    borderTopLeftRadius: rf(24),
    borderTopRightRadius: rf(24),
    backgroundColor: "white",
  },
  dragHandleContainer: {
    height: rf(30),
    alignItems: "center",
    justifyContent: "center",
  },
  dragIndicator: {
    width: rf(40),
    height: rf(4),
    backgroundColor: "#ccc",
    borderRadius: rf(2),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: rf(10),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: rf(20),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: rf(20),
    paddingVertical: rf(10),
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
});

export default WorkInformation;
