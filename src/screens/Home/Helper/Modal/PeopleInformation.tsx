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
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  HeartOff,
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
  Link,
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
import ModalPropostal from "./ModalPropostal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import UpdateCollaborator from "~/src/hooks/update/collaborator";
import useCollaborator from "~/src/function/fetchCollaborator";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4; // Minimum height (40% of screen)
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.95; // Maximum height (95% of screen)

const PeopleInformation = ({
  handleSwipeRight,
  visible,
  setVisible,
  peopleData,
  setReload,
  reload,
  removeCard,
  distance,
}: any) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isContract, setIsContract] = useState<boolean>(false);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [modalPropostal, setModalPropostal] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [allService, setAllService] = useState<any>(null);
  const [loadFavorite, setLoadFavorite] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);
  const { collaborator, updateCollaborator } = useCollaborator();
  const navigation = useNavigation();
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
    if (peopleData.isCandidate) {
      handleSave();
      return;
    }
    setModalPropostal(true);
  };

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
    site: Globe,
    default: Link,
  };

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

  const renderTagList = (items: string[]) => {
    return (
      <View>
        <View className="flex-row flex-wrap">
          {items.map((item, index) => (
            <Text
              key={index}
              style={[styles.tag, FONTS.fontLight, { fontSize: rf(10) }]}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const handleSave = async () => {
    const data = {
      CPF_responder: peopleData.collaborator.CPF,
    };
    const response = await UpdateAnnouncement(peopleData.id, data);
    if (response.status == 200) {
      Alert.alert(
        "Sucesso!",
        `O ${Mask(
          "firstName",
          peopleData.collaborator.name
        )} foi contratado com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => {
              setIsContract(true);
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
  };

  const handleFavorite = async () => {
    if (!collaborator || !peopleData?.collaborator?.CPF) return;
    setLoadFavorite(true);
    const currentCpf = String(peopleData.collaborator.CPF);
    let favorites: string[] = [];

    // Lida com favorito sendo array OU string JSON
    if (Array.isArray(collaborator.favorite)) {
      favorites = collaborator.favorite.map(String);
    } else if (typeof collaborator.favorite === "string") {
      try {
        favorites = JSON.parse(collaborator.favorite || "[]");
      } catch (e) {
        favorites = [];
      }
    }

    const alreadyExists = favorites.includes(currentCpf);

    const updatedFavorites = alreadyExists
      ? favorites.filter((cpf) => cpf !== currentCpf)
      : [...favorites, currentCpf];

    const props = {
      favorite: JSON.stringify(updatedFavorites),
    };

    const response = await UpdateCollaborator(collaborator.CPF, props);

    if (response?.status === 200) {
      setIsFavorite(!alreadyExists);
      // Alert.alert("Sucesso", "Favoritos atualizados com sucesso!");
      updateCollaborator(collaborator.CPF);
    } else {
      console.warn("Erro ao atualizar favoritos.");
    }
    setLoadFavorite(false);
    if (reload) {
      setReload((prev: number) => prev + 1);
    }
  };

  useEffect(() => {
    if (peopleData && peopleData?.collaborator?.service) {
      const allServiceList = extractAllServices(
        peopleData.collaborator.service
      );
      setAllService(allServiceList);
    }
  }, []);

  useEffect(() => {
    if (!collaborator || !peopleData?.collaborator?.CPF) return;

    const currentCpf = String(peopleData.collaborator.CPF);

    let favorites: string[] = [];

    if (Array.isArray(collaborator.favorite)) {
      favorites = collaborator.favorite.map(String);
    } else if (typeof collaborator.favorite === "string") {
      try {
        favorites = JSON.parse(collaborator.favorite || "[]");
      } catch {
        favorites = [];
      }
    }

    setIsFavorite(favorites.includes(currentCpf));
  }, [collaborator, peopleData]);

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.8}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver={true}
      propagateSwipe={true}
    >
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

      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ModalPropostal
            visible={modalPropostal}
            setVisible={setModalPropostal}
            item={peopleData}
          />
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
                    {peopleData && peopleData.picture ? (
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
                      {`${
                        peopleData.collaborator &&
                        peopleData.collaborator.name &&
                        Mask("fullName", peopleData.collaborator.name)
                      }${
                        peopleData?.collaborator?.birth
                          ? `, ${Mask("age", peopleData.collaborator.birth)}`
                          : ""
                      }`}
                    </Text>
                    { distance &&
                      <Text
                        style={{
                          ...FONTS.fontBlack,
                          fontSize: rf(12),
                          color: "#6b7280",
                        }}
                      >
                      Está {distance.distance} de você (endereço cadastrado)
                      </Text>
                    }
                  </View>
                  {peopleData && peopleData.isVerified && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        marginLeft: "auto",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 999,
                      }}
                      className="bg-primary"
                    >
                      {/* {showVerifiedText && (
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
                      )} */}
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
                    <Phone size={rf(16)} />
                    <Text
                      style={{
                        ...FONTS.fontBlack,
                        fontSize: rf(11),
                        marginLeft: rf(4),
                      }}
                    >
                      {peopleData &&
                      peopleData.collaborator &&
                      peopleData.collaborator.phone
                        ? peopleData.match
                          ? Mask("phone", peopleData.collaborator.phone)
                          : Mask("hiddenPhone", peopleData.collaborator.phone)
                        : `Telefone não informado`}
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
                      {peopleData &&
                      peopleData.collaborator &&
                      peopleData.collaborator.email
                        ? peopleData.match
                          ? peopleData.collaborator.email
                          : Mask("hiddenEmail", peopleData.collaborator.email)
                        : `E-mail não informado`}
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
                      {peopleData.collaborator &&
                        peopleData.collaborator.street &&
                        peopleData.collaborator.district &&
                        peopleData.collaborator.city &&
                        peopleData.collaborator.uf &&
                        `${peopleData.collaborator.street}, ${peopleData.collaborator.district} - ${peopleData.collaborator.city}, ${peopleData.collaborator.uf}`}
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
                  <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}>
                    Galeria
                  </Text>
                  <View
                    className="flex-1 flex-row justify-between"
                    style={{ height: rf(150) }}
                  >
                    {[0, 1, 2].map((index) => {
                      const item = peopleData?.gallery?.path?.[index];

                      return (
                        <View key={index} className="w-1/3 p-2">
                          {item?.base64 ? (
                            <TouchableOpacity
                              className="w-full h-full"
                              onPress={() => openImage(item.base64)} // passa { base64, key }
                            >
                              <Image
                                source={{ uri: item.base64 }}
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
                      );
                    })}
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
                    {peopleData?.collaborator?.presentation
                      ? peopleData.collaborator.presentation
                      : "Sem apresentação definida"}
                  </Text>
                </View>

                <View className={"gap-2 mt-3"}>
                  <Text
                    style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                    className={""}
                  >
                    Serviços
                  </Text>
                  {allService ? (
                    renderTagList(allService)
                  ) : (
                    <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                      Sem serviços definidos
                    </Text>
                  )}
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

                      {peopleData.collaborator?.howWork?.distance ? (
                        <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                          {`Distancia maxima até ${
                            peopleData.collaborator &&
                            peopleData.collaborator?.howWork?.distance &&
                            peopleData.collaborator.howWork.distance
                          } km`}
                        </Text>
                      ) : (
                        <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                          Sem distância definida
                        </Text>
                      )}
                    </View>

                    <View className="gap-2">
                      {peopleData.collaborator &&
                      peopleData.collaborator?.howWork?.showFarWork &&
                      peopleData.collaborator.howWork.showFarWork ? (
                        <View className="flex-row">
                          <MapPinCheckInside size={rf(12)} className="mr-1" />
                          <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                            Aceita maiores distâncias
                          </Text>
                        </View>
                      ) : peopleData?.collaborator?.howWork?.showFarWork ===
                        false ? (
                        <View className="flex-row">
                          <MapPinXInside size={rf(12)} className="mr-1" />
                          <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                            Não aceita maiores distâncias
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row">
                          <MapPinXInside size={rf(12)} className="mr-1" />
                          <Text style={[FONTS.fontLight, { fontSize: rf(10) }]}>
                            Sem distância definida
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
                      {peopleData?.collaborator?.howWork?.contract ? (
                        renderTagList(peopleData.collaborator.howWork.contract)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem preferencia de contrato definida
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.howWork?.modality ? (
                        renderTagList(peopleData.collaborator.howWork.modality)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem modalidade definida
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.howWork?.horary ? (
                        renderTagList(peopleData.collaborator.howWork.horary)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem horário definido
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.howWork?.mobility ? (
                        renderTagList(peopleData.collaborator.howWork.mobility)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem mobilidade definida
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.howWork?.payment ? (
                        renderTagList(peopleData.collaborator.howWork.payment)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem forma de pagamento definida
                        </Text>
                      )}
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
                  <View>
                    {peopleData?.collaborator?.about?.interests ? (
                      renderTagList(peopleData.collaborator.about.interests)
                    ) : (
                      <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                        Sem interesses definidos
                      </Text>
                    )}
                  </View>
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
                      {peopleData?.collaborator?.about?.values ? (
                        renderTagList(peopleData.collaborator.about.values)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre valores
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.formation ? (
                        renderTagList(peopleData.collaborator.about.formation)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre formação
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.communication ? (
                        renderTagList(
                          peopleData.collaborator.about.communication
                        )
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre comunicação
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.marriage ? (
                        renderTagList([
                          peopleData.collaborator.marriage === "1"
                            ? "Sim"
                            : "Não",
                        ])
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre estado civil
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.drink ? (
                        renderTagList(peopleData.collaborator.about.drink)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre bebida
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.children ? (
                        renderTagList(
                          peopleData.collaborator?.children &&
                            Object.keys(peopleData.collaborator.children)
                              .length > 0
                            ? [
                                `${
                                  Object.keys(peopleData.collaborator.children)
                                    .length
                                } ${
                                  Object.keys(peopleData.collaborator.children)
                                    .length === 1
                                    ? "filho"
                                    : "filhos"
                                }`,
                              ]
                            : ["Não informado"]
                        )
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre filhos
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.smoke ? (
                        renderTagList(peopleData.collaborator.about.smoke)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre fumo
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.languageLove ? (
                        renderTagList(
                          peopleData.collaborator.about.languageLove
                        )
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre Linguagem do Amor
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.food ? (
                        renderTagList(peopleData.collaborator.about.food)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre alimentação
                        </Text>
                      )}
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
                      {peopleData?.collaborator?.about?.pet ? (
                        renderTagList(peopleData.collaborator.about.pet)
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem informação sobre pets
                        </Text>
                      )}
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
                      {peopleData.collaborator?.social ? (
                        Object.entries(peopleData.collaborator.social).map(
                          ([key, value]) => {
                            const Icon =
                              icons[key as keyof typeof icons] || icons.default;
                            //@ts-ignore
                            const isLink = isUrl(value);

                            if (isLink) {
                              return (
                                <TouchableOpacity
                                  key={key}
                                  //@ts-ignore
                                  onPress={() => Linking.openURL(value)}
                                  className="items-center justify-center"
                                >
                                  <Icon size={rf(22)} color="#2563EB" />
                                </TouchableOpacity>
                              );
                            } else {
                              return (
                                <View
                                  key={key}
                                  className="flex-row items-center gap-2"
                                >
                                  <Icon size={rf(18)} color="#6B7280" />
                                  <Text
                                    style={{ ...FONTS.font, fontSize: rf(14) }}
                                  >
                                    {/* @ts-ignore */}
                                    {value}
                                  </Text>
                                </View>
                              );
                            }
                          }
                        )
                      ) : (
                        <Text style={{ ...FONTS.fontLight, fontSize: rf(10) }}>
                          Sem redes sociais definidas
                        </Text>
                      )}
                    </View>
                  </View>
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
                      style={{
                        ...FONTS.font,
                        fontSize: rf(9),
                        color: "#71717a",
                      }}
                    >
                      Recolher
                    </Text>
                  </>
                ) : (
                  <>
                    <ChevronUp size={rf(24)} color="#71717a" />
                    <Text
                      style={{
                        ...FONTS.font,
                        fontSize: rf(9),
                        color: "#71717a",
                      }}
                    >
                      Visualizar
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {!loadFavorite ? (
                <TouchableOpacity
                  style={{ flex: 1, padding: 12, alignItems: "center" }}
                  onPress={handleFavorite}
                >
                  {!isFavorite ? (
                    <>
                      <Heart size={rf(24)} color="#71717a" />
                      <Text
                        style={{
                          ...FONTS.font,
                          fontSize: rf(9),
                          color: "#71717a",
                        }}
                      >
                        Favoritar
                      </Text>
                    </>
                  ) : (
                    <>
                      <HeartOff size={rf(24)} color="#71717a" />
                      <Text
                        style={{
                          ...FONTS.font,
                          fontSize: rf(9),
                          color: "#71717a",
                        }}
                      >
                        Desfavoritar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View
                  className="mt-1"
                  style={{ flex: 1, padding: 12, alignItems: "center" }}
                >
                  <ActivityIndicator color={"#71717a"} size={rf(25)} />
                </View>
              )}

              {handleSwipeRight && !isContract && (
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
              )}
            </View>
          </Animated.View>
        </BottomSheetModalProvider>
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
