import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import SelectAdType from "./SelectAdType";
import Header from "~/src/layout/Header";
export default function Form({ title, setSelectedCategory }: any) {
  const [selectAdTypeView, setSelectAdTypeView] = useState<boolean>(false);
  const [priceType, setPriceType] = useState("fixo");
  const [price, setPrice] = useState("");
  const [included, setIncluded] = useState("");
  const [excluded, setExcluded] = useState("");
  const [moreInfo, setMoreInfo] = useState("");
  const [contact, setContact] = useState("");
  const [adType, setAdType] = useState("selecione");
  const [images, setImages] = useState<string[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const boxSize = (screenWidth - 50) / 3;

  const handleImageUpload = () => {
    if (images.length >= 3) return;
    // Simulação de imagem
    setImages((prev) => [
      ...prev,
      `https://via.placeholder.com/100?text=${prev.length + 1}`,
    ]);
  };

  return (
    <View>
      <Header
        leftIcon="back"
        leftAction={() => {
          if (selectAdTypeView) {
            setSelectAdTypeView(false);
          } else {
            setSelectedCategory(null);
          }
        }}
        title={title}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 55 }}>
        {!selectAdTypeView ? (
          <>
            <Text
              style={[FONTS.fontBlack, { fontSize: rf(20), marginBottom: 16 }]}
            >
              Informações do Serviço
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Titulo"
              value={included}
              onChangeText={setIncluded}
            />
            {/* Tipo de preço */}
            <Text style={FONTS.fontLight}>Forma de Pagamento:</Text>
            <ScrollView
              horizontal
              className="px-3"
              contentContainerStyle={{ paddingRight: 18 }}
            >
              <View className="flex flex-row gap-4 mb-4 py-1">
                {[
                  "Por mês",
                  "Por tarefa",
                  "Por semana",
                  "Por dia",
                  "Fixo",
                  "Por hora",
                  "A combinar",
                ].map((type) => (
                  <TouchableOpacity
                    style={Styles.card}
                    key={type}
                    className={`px-4 py-2 rounded-full ${
                      priceType === type ? "bg-primary" : "bg-white"
                    }`}
                    onPress={() => setPriceType(type)}
                  >
                    <Text
                      className={`${
                        priceType === type ? "text-dark" : "text-gray-500"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Preço */}
            {priceType !== "A combinar" && (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Digite o preço"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            )}

            {/* Incluído */}
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="O que está incluído"
              value={included}
              onChangeText={setIncluded}
            />

            {/* Não incluído */}
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="O que não está incluído"
              value={excluded}
              onChangeText={setExcluded}
            />

            {/* Mais informações */}
            <TextInput
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Mais informações sobre o serviço"
              value={moreInfo}
              onChangeText={setMoreInfo}
            />

            {/* Contato */}
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Telefone / WhatsApp"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
            />

            {/* Tipo de anúncio */}
            <TouchableOpacity
              className="flex-row justify-between w-full p-2 rounded-lg bg-white"
              style={Styles.card}
              onPress={() => {
                // Aqui você pode alternar a visibilidade de um seletor, modal, etc.
                setSelectAdTypeView(true);
              }}
            >
              <Text>Tipo de Anúncio</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-1 capitalize">{adType}</Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={21}
                  color="black"
                />
              </View>
            </TouchableOpacity>

            {/* Upload de imagens */}
            <Text
              className="mt-3"
              style={[FONTS.fontLight, { marginBottom: 8 }]}
            >
              Imagens do Serviço (máx. 3)
            </Text>
            <View className="flex flex-row flex-wrap gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (images[i]) return;
                    handleImageUpload();
                  }}
                  className="rounded-lg items-center justify-center overflow-hidden bg-gray-100"
                  style={[Styles.card, { width: boxSize, height: boxSize }]}
                >
                  {images[i] ? (
                    <Image
                      source={{ uri: images[i] }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Text style={{ fontSize: rf(26), color: "#aaa" }}>+</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão de enviar (simples por enquanto) */}
            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center"
              onPress={() => {
                // Aqui você pode processar o envio
              }}
            >
              <Text className="text-dark font-bold">Publicar Anúncio</Text>
            </TouchableOpacity>
          </>
        ) : (
          <SelectAdType
            setSelectAdTypeView={setSelectAdTypeView}
            adType={adType}
            setAdType={setAdType}
          />
        )}
      </ScrollView>
    </View>
  );
}

const Styles = {
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // backgroundColor: "#FFFFFF",
  },
  select: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
