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
  CameraOff,
  Eye,
  MailCheck,
  Banknote,
  MapPin,
  HandCoins,
  Phone,
  Check,
  UserRound,
  CircleCheck,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronLeft,
  Minus,
  BriefcaseBusiness,
} from "lucide-react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import UpdateAnnouncement from "~/src/hooks/update/announcement/announcement";
import { useNavigation } from "@react-navigation/native";
import useCollaborator from "~/src/function/fetchCollaborator";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4; // Minimum height (40% of screen)
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.9; // Maximum height (90% of screen)
const ServiceInformation = ({
  handleSwipeRight,
  visible,
  setVisible,
  peopleData,
  autoView,
}: any) => {
  const navigation = useNavigation();
  const { collaborator } = useCollaborator();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [path, setPath] = useState<string | null>("");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showVerifiedText, setShowVerifiedText] = useState(false);
  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const lastModalHeight = useRef(MIN_MODAL_HEIGHT);
  const expandedThreshold = (MIN_MODAL_HEIGHT + MAX_MODAL_HEIGHT) / 2;
  const contentOpacity = modalHeight.interpolate({
    inputRange: [MIN_MODAL_HEIGHT, expandedThreshold, MAX_MODAL_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (peopleData?.CPF_Creator?.collaborator?.picture) {
      setPath(peopleData?.CPF_Creator?.collaborator?.picture);
    } else {
      setPath(null); // Garante que image seja null se não houver caminho válido
    }
  }, [visible]);

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

  const handleApply = () => {
    handleSwipeRight();
  };

  const openImage = (uri: string) => {
    setActiveImage(uri);
    setZoomVisible(true);
  };

  const closeImage = () => {
    setZoomVisible(false);
    setActiveImage(null);
  };

  const handleSave = async () => {
    if(!collaborator) return;

    const data = {
      CPF_responder: collaborator.CPF,
      isPropostal: peopleData.isPropostal
    };

    try {
      const response = await UpdateAnnouncement(peopleData.id, data);
      
      if (response.status === 200) {
        Alert.alert(
          "Sucesso!",
          `O contratado foi aceito com sucesso.`,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }

      Alert.alert(
        "Erro!",
        `Não foi possível realizar o contratado.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } 
    catch (error) {
      console.error("Erro ao tentar salvar:", error);
      Alert.alert("Erro!", `Ocorreu um erro inesperado.`, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.8}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver={true}
      propagateSwipe={true}
    >
      <>
        <Modal
          //@ts-ignore
          visible={zoomVisible}
          transparent={true}
          onRequestClose={closeImage}
        >
          <GestureHandlerRootView
            style={{ height: "80%", backgroundColor: "white" }}
          >
            {/* Ícone de voltar */}
            <TouchableOpacity
              className={"rounded-full items-center justify-center"}
              onPress={closeImage}
              style={{
                height: rf(30),
                width: rf(30),
              }}
            >
              <ChevronLeft size={rf(25)} color="#000" />
            </TouchableOpacity>

            {/* Imagem com zoom */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={closeImage}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {activeImage && (
                <ImageZoom
                  style={{
                    width: "100%",
                    height: Dimensions.get("window").height * 0.7,
                    resizeMode: "contain",
                  }}
                  source={{ uri: activeImage }}
                />
              )}
            </TouchableOpacity>
          </GestureHandlerRootView>
        </Modal>
      </>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              height: modalHeight,
            },
          ]}
        >
          {/* Draggable Header */}
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
                  {path ? (
                    <Image
                      source={{ uri: path }}
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
                      <UserRound size={rf(25)} />
                    </View>
                  )}

                  {peopleData && peopleData.isVerified && (
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
                    className="capitalize w-5/6"
                    style={{
                      ...FONTS.fontSemiBold,
                      fontSize: rf(16),
                      textTransform: "capitalize",
                    }}
                  >
                    {peopleData && peopleData.title && peopleData.title}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(12),
                      color: "#6b7280",
                    }}
                  >
                    {peopleData?.CPF_Creator?.collaborator?.collaborator?.name &&
                      peopleData?.CPF_Creator.collaborator.collaborator.name}
                  </Text>
                </View>
                {peopleData && peopleData?.isVerified && (
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

          {/* Scrollable Content */}
          <ScrollView style={styles.contentContainer}>
            <View
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: rf(16),
                padding: rf(12),
                marginBottom: rf(16),
                flexDirection: "row",
              }}
              className="justify-between items-center px-5"
            >
              <View style={{ gap: rf(12) }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Banknote size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                    }}
                  >
                    { peopleData?.salary ?
                      `${Mask("amount", peopleData.salary)}, ${peopleData.typePayment}`
                      :
                      "A combinar"
                    }
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BriefcaseBusiness size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                      textTransform: "capitalize",
                    }}
                  >
                    { peopleData?.model &&
                      peopleData.model}
                  </Text>
                </View>
              </View>
              <View style={{ gap: rf(12) }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Phone size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                    }}
                  >
                    {peopleData?.CPF_Creator?.collaborator?.collaborator
                      ?.phone &&
                      Mask(
                        "hiddenPhone",
                        peopleData.CPF_Creator.collaborator.collaborator.phone
                      )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MapPin size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                    }}
                  >
                    {peopleData?.city &&
                      `${peopleData?.city}, ${peopleData?.state}`
                    }
                  </Text>
                </View>
              </View>
            </View>
            <Animated.View
              onLayout={() => setShowContent(true)}
              style={[
                {
                  opacity: contentOpacity,
                  overflow: "hidden",
                },
                !showContent && { height: 0 },
              ]}
            >
              {/* Conteúdo extra */}
              <View className={"gap-2"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Galeria
                </Text>
                <View
                  className="flex-1 flex-row justify-between"
                  style={{ height: rf(150) }}
                >
                  {[0, 1, 2].map((index) => (
                    <View key={index} className="w-1/3 p-2">
                      {peopleData &&
                      peopleData.gallery &&
                      peopleData.gallery[index] &&
                      peopleData.gallery[index].base64 ? (
                        //  peopleData.gallery[index]
                        <TouchableOpacity
                          className="w-full h-full"
                          onPress={() =>
                            openImage(peopleData.gallery[index].base64)
                          }
                        >
                          <Image
                            source={{ uri: peopleData.gallery[index].base64 }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: rf(12),
                            }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      ) : (
                        <View className="w-full h-full rounded-xl bg-zinc-200 items-center justify-center">
                          <CameraOff size={rf(20)} />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  O que está incluído
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {peopleData && peopleData.included && peopleData.included}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  O que não está incluído
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {peopleData && peopleData.included && peopleData.included}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Informações
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {peopleData && peopleData.information
                    ? peopleData.information
                    : "Não informado"}
                </Text>
              </View>
            </Animated.View>
            {/* Add more content here if needed */}
          </ScrollView>

          {/* Fixed Footer */}
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
            {peopleData?.isPropostal ? (
              <TouchableOpacity
                style={{ flex: 1, padding: 12, alignItems: "center" }}
                onPress={handleSave}
              >
                <MailCheck size={rf(24)} color="#71717a" />
                <Text
                  style={{
                    ...FONTS.font,
                    fontSize: rf(9),
                    color: "#71717a",
                  }}
                >
                  Aceitar proposta
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {!autoView &&
                  (peopleData?.apply ? (
                    <TouchableOpacity
                      style={{ flex: 1, padding: 12, alignItems: "center" }}
                      onPress={handleApply}
                    >
                      <Minus size={rf(24)} color="#71717a" />
                      <Text
                        style={{
                          ...FONTS.font,
                          fontSize: rf(9),
                          color: "#71717a",
                        }}
                      >
                        Cancelar candidatura
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ flex: 1, padding: 12, alignItems: "center" }}
                      onPress={handleApply}
                    >
                      <Plus size={rf(24)} color="#71717a" />
                      <Text
                        style={{
                          ...FONTS.font,
                          fontSize: rf(9),
                          color: "#71717a",
                        }}
                      >
                        Candidatar
                      </Text>
                    </TouchableOpacity>
                  ))}
              </>
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

export default ServiceInformation;
