import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "~/src/layout/Header";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const screenWidth = Dimensions.get("window").width;
const spacing = 22;
const CARD_SIZE = (screenWidth - spacing * 4) / 3;

const ageFromBirthDate = (birthDate: string) => {
  const birth = new Date(birthDate);
  const diffMs = Date.now() - birth.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export default function Review() {
  const data = {
    fullName: "João da Silva",
    marriage: "Sim",
    children: "3",
    photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
    phone: "+55 11 91234-5678",
    email: "joao.silva@email.com",
    birthDate: "1990-05-20",
    sex: "Masculino",
    address: "Rua das Flores, 123, São Paulo - SP",
    communicationType: "Assertiva",
    education: "Ensino Superior Completo",
    smokes: false,
    drinks: true,
    interests: ["Música", "Tecnologia", "Esportes"],
    loveLanguage: "Toques Físicos",
    pets: "Cachorro",
    diet: "Onívoro",
    about:
      "Sou uma pessoa dedicada, focada e apaixonada pelo que faço. Sempre busco aprender e crescer profissionalmente.",
    signature: "https://i.imgur.com/TBJ72m5.jpeg", 
    socialLinks: {
      facebook: "https://facebook.com/joaosilva",
      instagram: "https://instagram.com/joaosilva",
      linkedin: "https://linkedin.com/in/joaosilva",
      twitter: "twitter",
      tiktok: "https://github.com/joaosilva",
      youtube: "twitter",
    },
    workPreferences: {
      location: "São Paulo - SP",
      maxDistanceKm: 50,
      allowFurtherDistance: true,
      contractType: "PJ",
      modality: "Híbrido",
      schedule: ["Dia", "Noite"],
      mobility: ["Carro", "Moto"],
      paymentType: "Por dia",
    },
    gallery: {
      photos: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
      ],
      videos: [
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=400&q=80",
      ],
    },
  };

  const age = ageFromBirthDate(data.birthDate);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="h-full bg-white">
      <Header title="Meu Perfil" leftIcon="back" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        className="px-6"
        style={{ flex: 1 }}
      >
        <View className="items-center mb-6">
          <Image
            source={{ uri: data.photoUri }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mt-3">
            {data.fullName}, {age}
          </Text>
          <Text className="text-gray-600">{data.sex}</Text>
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre Você</Text>
          <Text>{data.about}</Text>
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Contato & Endereço</Text>
          <Text>📱 {data.phone}</Text>
          <Text>✉️ {data.email}</Text>
          <Text>📍 {data.address}</Text>
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <Text>Casado: {data.marriage}</Text>
          <Text>Filhos: {data.children}</Text>
          <Text>Tipo de Comunicação: {data.communicationType}</Text>
          <Text>Formação: {data.education}</Text>
          <Text>Fuma: {data.smokes ? "Sim" : "Não"}</Text>
          <Text>Bebe: {data.drinks ? "Sim" : "Não"}</Text>
          <Text>Interesses: {data.interests.join(", ")}</Text>
          <Text>Linguagem do Amor: {data.loveLanguage}</Text>
          <Text>Pets: {data.pets}</Text>
          <Text>Alimentação: {data.diet}</Text>
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Preferências de Trabalho</Text>
          <Text>Localização: {data.workPreferences.location}</Text>
          <Text>Distância Máxima: {data.workPreferences.maxDistanceKm} km</Text>
          <Text>
            Mostrar mais longe:{" "}
            {data.workPreferences.allowFurtherDistance ? "Sim" : "Não"}
          </Text>
          <Text>Contrato: {data.workPreferences.contractType}</Text>
          <Text>Modalidade: {data.workPreferences.modality}</Text>
          <Text>Horário: {data.workPreferences.schedule.join(", ")}</Text>
          <Text>Mobilidade: {data.workPreferences.mobility.join(", ")}</Text>
          <Text>Pagamento: {data.workPreferences.paymentType}</Text>
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Galeria</Text>
          <View>
            <Text>Foto</Text>
            <View style={styles.galleryContainer}>
              {data.gallery.photos.map((uri, idx) => (
                <Image
                  key={`photo-${idx}`}
                  source={{ uri }}
                  style={styles.galleryImage}
                />
              ))}
            </View>
          </View>
          <View>
            <Text>Vídeo</Text>
            <View style={styles.galleryContainer}>
              {data.gallery.videos.map((uri, idx) => (
                <View key={`video-${idx}`} style={styles.videoThumbnail}>
                  <MaterialCommunityIcons
                    name="video"
                    size={32}
                    color="#fff"
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      top: 15,
                    }}
                  />
                  <Image source={{ uri }} style={styles.galleryImage} />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="p-3 rounded-lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Assinatura</Text>

          {data.signature ? (
            <Image
              className="rounded-lg"
              source={{ uri: data.signature }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ color: "#999" }}>Sem assinatura disponível</Text>
          )}
        </View>

        <View className="p-3" style={styles.card}>
          <Text style={styles.sectionTitle}>Redes Sociais</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Object.entries(data.socialLinks).map(([key, url]) => {
              if (!url) return null;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => openLink(url)}
                  style={styles.socialIconContainer}
                >
                  <FontAwesome5 name={key} size={28} color="#3b82f6" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#111",
  },
  socialIconContainer: {
    marginRight: 14,
    marginBottom: 10,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  serviceCard: {
    width: CARD_SIZE,
    marginRight: 12,
    marginBottom: 12,
  },
  serviceThumbnail: {
    width: "100%",
    height: CARD_SIZE,
    borderRadius: 10,
  },
  serviceTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  galleryContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  galleryImage: {
    width: CARD_SIZE - 2,
    height: CARD_SIZE,
    borderRadius: 10,
    marginRight: 7,
    marginBottom: 12,
  },
  videoThumbnail: {
    position: "relative",
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  signatureImage: {
  width: '100%',
  height: CARD_SIZE,
  marginTop: 8,
  borderRadius: 6,
},

});
