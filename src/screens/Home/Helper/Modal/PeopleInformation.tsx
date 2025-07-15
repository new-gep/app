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
  Linking,
} from "react-native";
import Modal from "react-native-modal";
import {
  Share2,
  CameraOff,
  Banknote,
  MapPin,
  Phone,
  Check,
  UserRound,
  CircleCheck,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronLeft,
  Mail,
  MapPinCheckInside,
  MapPinXInside,
  Handshake,
  House,
  Clock,
  BusFront,
  Cigarette,
  Salad,
  Heart,
  Bone,
  MessageCircle,
  GraduationCap,
  Wine,
  Baby,
  BookHeart,
  Scale,
  School,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Music,
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
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4; // Minimum height (40% of screen)
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.95; // Maximum height (95% of screen)

const PeopleInformation = ({
  handleSwipeRight,
  visible,
  setVisible,
  peopleData,
}: any) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showVerifiedText, setShowVerifiedText] = useState(false);
  const modalHeight = useRef(new Animated.Value(MIN_MODAL_HEIGHT)).current;
  const lastModalHeight = useRef(MIN_MODAL_HEIGHT);
  const expandedThreshold = (MIN_MODAL_HEIGHT + MAX_MODAL_HEIGHT) / 2;
  const isUrl = (value: string) => value.startsWith("http");

  const contentOpacity = modalHeight.interpolate({
    inputRange: [MIN_MODAL_HEIGHT, expandedThreshold, MAX_MODAL_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

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

  if (!visible) return null;

  const openImage = (uri: string) => {
    setActiveImage(uri);
    setZoomVisible(true);
  };

  const closeImage = () => {
    setZoomVisible(false);
    setActiveImage(null);
  };

  const icons = {
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    twitter: Twitter,
    tiktok: Music, // ícone alternativo para TikTok
    youtube: Youtube,
    website: Globe,
  };

  const renderTagList = (items: string[]) => (
    <View>
      <View>
        <View className="flex-row flex-wrap">
          {/* {items && items.map((item, index) => (
            <Text
              key={index}
              style={[styles.tag, FONTS.fontLight, { fontSize: rf(10) }]}
            >
              {item}
            </Text>
          ))} */}
        </View>
      </View>
    </View>
  );

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
                  {peopleData && peopleData.picture  ? (
                    <Image
                      source={{ uri: peopleData.picture }}
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
                  <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(16) }}>
                    {`${peopleData.collaborator && Mask('fullName', peopleData.collaborator.name)}, ${peopleData.collaborator && Mask('age', peopleData.collaborator.birth)}`}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(12),
                      color: "#6b7280",
                    }}
                  >
                    {/* {peopleData.name} */}
                  </Text>
                </View>
                {/* {peopleData && peopleData.isVerified && (
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
                )} */}
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
                  <Phone size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                    }}
                  >
                    {peopleData && peopleData.collaborator ? Mask("hiddenPhone", peopleData.collaborator.phone) : `Telefone não informado`}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Mail size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                    }}
                  >
                    {peopleData && peopleData.collaborator ? Mask("hiddenEmail", peopleData.collaborator.email) : `E-mail não informado`}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MapPin size={rf(16)} />
                  <Text
                    style={{
                      ...FONTS.fontBlack,
                      fontSize: rf(11),
                      marginLeft: rf(4),
                      textTransform: "capitalize",
                    }}
                  >
                    {peopleData.collaborator && `${peopleData.collaborator.street}, ${peopleData.collaborator.district} - ${peopleData.collaborator.city}, ${peopleData.collaborator.uf}`}
                  </Text>
                </View>
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
              {/* Conteúdo extra */}
              <View className={"gap-2"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                >
                  Galeria
                </Text>
                <View
                  className="flex-1 flex-row justify-between"
                  style={{ height: rf(150) }}
                >
                  {[0, 1, 2].map((index) => (
                    <View key={index} className="w-1/3 p-2">
                      { peopleData.gallery && peopleData.gallery[index] ? (
                        //  peopleData.gallery[index]
                        <TouchableOpacity
                          className="w-full h-full"
                          onPress={() => openImage(peopleData.gallery[index])}
                        >
                          <Image
                            source={{ uri: peopleData.gallery[index] }}
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
                  Sobre mim
                </Text>
                <Text
                  className="text-justify"
                  style={[FONTS.fontLight, { fontSize: rf(10) }]}
                >
                  {/* {peopleData.workPreferences && peopleData.about} */}
                </Text>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Serviços
                </Text>
                {/* {peopleData.workPreferences && renderTagList(peopleData.service)} */}
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Como Trabalha
                </Text>
                <View className="">
                  <View className="flex-row">
                    <MapPin size={rf(12)} className="mr-1" />
                    <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                      {/* {`Distancia maxima até ${peopleData.workPreferences && peopleData.workPreferences.maxDistanceKm} km`} */}
                    </Text>
                  </View>
                  <View className="gap-2">
                    {peopleData.workPreferences && peopleData.workPreferences.allowFurtherDistance ? (
                      <View className="flex-row">
                        <MapPinCheckInside size={rf(12)} className="mr-1" />
                        <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                          Aceita maiores distâncias
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row">
                        <MapPinXInside size={rf(12)} />
                        <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                          Não aceita maiores distâncias
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Handshake size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Contratos
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.workPreferences.contractType)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <House size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Modalidade
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.workPreferences.modality)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Clock size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Período
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.workPreferences.schedule)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <BusFront size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Mobilidade
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.workPreferences.mobility)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Banknote size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Pagamentos
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.workPreferences.paymentType)} */}
                  </View>
                </View>
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Interesses
                </Text>
                {/* <View>{peopleData.workPreferences && renderTagList(peopleData.interests)}</View> */}
              </View>

              <View className={"gap-2 mt-3"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Informações Pessoais
                </Text>
                <View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Scale size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Valores
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.values)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <GraduationCap size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Formação
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.education)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <MessageCircle size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Comunicação
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.communicationType)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Heart size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Casado (a) ?
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.marriage)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Wine size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Bebe ?
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.drinks)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Baby size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Filhos
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.children)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Cigarette size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Fuma?
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.smokes)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <BookHeart size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Linguagem do Amor
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.loveLanguage)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row">
                      <Salad size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Alimentação
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.diet)} */}
                  </View>
                  <View className="gap-2">
                    <View className="flex-row ">
                      <Bone size={rf(12)} className="mr-1" />
                      <Text
                        style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                        className={""}
                      >
                        Pets
                      </Text>
                    </View>
                    {/* {peopleData.workPreferences && renderTagList(peopleData.personal.pets)} */}
                  </View>
                </View>
              </View>

              <View className={"mt-5 mb-5"}>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className={""}
                >
                  Redes Sociais
                </Text>
                <View className="gap-3">
                  {/* Textos (não links) em coluna */}
                  <View className="gap-2">
                    {/* {Object.entries(peopleData.social).map(
                      ([key, value]: any) => {
                        const Icon = icons[key as keyof typeof icons];
                        const isLink = isUrl(value);

                        if (!isLink) {
                          return (
                            <View key={key} className="flex-row items-center">
                              <Icon
                                size={rf(12)}
                                color="#6B7280"
                                className="mr-1"
                              />
                              <Text style={{ ...FONTS.font, fontSize: rf(12) }}>
                                {value}
                              </Text>
                            </View>
                          );
                        }
                        return null; // Pula se for link
                      }
                    )} */}
                  </View>

                  {/* Botões (links) lado a lado */}
                  <View className="flex-row flex-wrap gap-x-3 gap-y-2">
                    {/* {peopleData.social && Object.entries(peopleData.social).map(
                      ([key, value]: any) => {
                        const Icon = icons[key as keyof typeof icons];
                        const isLink = isUrl(value);

                        if (isLink) {
                          return (
                            <TouchableOpacity
                              key={key}
                              onPress={() => Linking.openURL(value)}
                              className="bg-primary rounded-full p-2 h-8 w-8 items-center justify-center"
                            >
                              <Icon size={rf(14)} className="text-dark" />
                            </TouchableOpacity>
                          );
                        }
                        return null; // Pula se não for link
                      }
                    )} */}
                  </View>
                </View>
              </View>
            </Animated.View>
            {/* Add more content here if needed */}
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={{ flex: 1, padding: 12, alignItems: "center" }}
              onPress={handleShare}
            >
              <Share2 size={rf(24)} color="#71717a" />
              <Text
                style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
              >
                Compartilhar
              </Text>
            </TouchableOpacity>
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
            
           { handleSwipeRight &&
              <TouchableOpacity
                style={{ flex: 1, padding: 12, alignItems: "center" }}
                onPress={handleApply}
              >
                <Plus size={rf(24)} color="#71717a" />
                <Text
                  style={{ ...FONTS.font, fontSize: rf(9), color: "#71717a" }}
                >
                  Contratar
                </Text>
              </TouchableOpacity>
            }

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
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
});

export default PeopleInformation;
