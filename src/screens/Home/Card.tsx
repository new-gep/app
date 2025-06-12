import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;

// Ativa animações no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CathoStyleCards({ data, setCards }: any) {
  const [previousCards, setPreviousCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const translateX = useRef(new Animated.Value(0)).current;

  const handleSwipeLeft = () => {
    if (data.length === 0) return;
    const [firstCard, ...rest] = data;
    setPreviousCards((prev: any) => [...prev, firstCard]);
    setCards(rest);
  };

  const handleSwipeRight = async (id: any) => {
    const collaborator = null; // Substitua pelo colaborador real do contexto
    const ApplyJob = async () => ({ status: 200 }); // Simule ou substitua pela função real

    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }

    const response = await ApplyJob(id, collaborator?.CPF);
    if (response.status === 200) {
      showPopupMessage("Você aplicou para a vaga com sucesso!");
      handleSwipeLeft();
    } else if (response.status === 400) {
      showPopupMessage("Você já aplicou para essa vaga!");
      handleSwipeLeft();
    } else {
      showPopupMessage("Erro ao aplicar para a vaga!");
    }
  };

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleSwipe = (direction: "left" | "right") => {
    Animated.timing(translateX, {
      toValue: direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCards((prev: any) => prev.slice(1));
      translateX.setValue(0);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipe("left");
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderItem = ({ item, index }: any) => {
    if (index === 0) {
      return (
        <Animated.View
          {...panResponder.panHandlers}
          className={'bg-white rounded-lg p-3'}
          style={[styles.card, { transform: [{ translateX }] }]}
        >
          <Text style={styles.title}>{item.function}</Text>
          <Text style={styles.company}>{item.company}</Text>
        </Animated.View>
      );
    }

    return (
      <View style={styles.card} className={'bg-white rounded-lg mt-5 p-3'}>
        <Text style={styles.title}>{item.function}</Text>
        <Text style={styles.company}>{item.company}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container} className="px-5 py-2">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal:10, paddingTop: 10, }}
        showsVerticalScrollIndicator={false}
      />

      {showPopup && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  company: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
  },
  popupContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    color: "#fff",
    fontSize: 14,
  },
});
