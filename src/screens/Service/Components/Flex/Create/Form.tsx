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
  ActivityIndicator,
  Alert,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import SelectAdType from "./SelectAdType";
import Header from "~/src/layout/Header";
import GetPathPicture from "~/src/function/getPathPicture";
import ModalErrors from "./Modal";
import ModalUpload from "./ModalUpload";
import Mask from "~/src/function/mask";
import CreateAnnouncement from "~/src/hooks/create/announcement";
import UpdateAnnouncement from "~/src/hooks/update/announcement/announcement";
import useCollaborator from "~/src/function/fetchCollaborator";
export default function Form({ title, setSelectedCategory, item }: any) {
  const [visible, setVisible] = useState<boolean>(false);
  const [gallery, setGallery] = useState<Array<any>>(item ? item?.gallery : []);
  const [oldGallery, setOldGallery] = useState<Array<any>>(item?.gallery);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<Array<any>>(
    []
  );
  const [visibleUpload, setVisibleUpload] = useState<boolean>(false);
  const [street, setStreet] = useState(item?.street ? item.street : "");
  const [complement, setComplement] = useState(item?.complement ? item.complement : "");
  const [number, setNumber] = useState(item?.number ? item.number : "");
  const [city, setCity] = useState(item?.city ? item.city : "");
  const [district, setDistrict] = useState(item?.district ? item.district : "");
  const [state, setState] = useState(item?.state  ? item.state : "");
  const [zip, setZip] = useState(item?.cep ? item.cep : "");
  const [noNumber, setNoNumber] = useState(false);
  const [selectAdTypeView, setSelectAdTypeView] = useState<boolean>(false);
  const [priceType, setPriceType] = useState(item ? item.typePayment : "");
  const [model, setModel] = useState(item ? item.model : "");
  const [titleValue, setTitleValue] = useState(item ? item.title : "");
  const [price, setPrice] = useState(item ? item.salary : "");
  const [included, setIncluded] = useState(item ? item.included : "");
  const [excluded, setExcluded] = useState(item ? item.notIncluded : "");
  const [moreInfo, setMoreInfo] = useState(item ? item.information : "");
  const [adType, setAdType] = useState(item ? item.typeAnnouncement : "");
  const [awaitCreat, setAwaitCreat] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const screenWidth = Dimensions.get("window").width;
  const boxSize = (screenWidth - 50 - 2 * 8) / 3;
  const { collaborator } = useCollaborator();
  const navigation = useNavigation<any>();

  const validateForm = () => {
    const newErrors: any = {};

    // Campos já existentes
    if (!titleValue.trim()) newErrors.title = "Título é Obrigatório";
    if (!included.trim()) newErrors.included = "Campo Obrigatório";
    if (!priceType) newErrors.priceType = "Selecione uma forma de pagamento";
    if (!model) newErrors.model = "Selecione um modelo de trabalho";
    if (priceType !== "A combinar" && !price.trim())
      newErrors.price = "Preço Obrigatório";
    if (!adType || adType === "selecione")
      newErrors.adType = "Selecione o tipo de anúncio";

    // Campos de endereço
    if (!street?.trim()) newErrors.street = "Rua é obrigatória";
    if (!city?.trim()) newErrors.city = "Cidade é obrigatória";
    if (!state?.trim()) newErrors.state = "Estado é obrigatório";
    if (!zip?.trim()) newErrors.zipCode = "CEP é obrigatório";

    // Número: obrigatório apenas se não for marcado como "Sem número"
    if (!noNumber && (!number || !number.trim())) {
      newErrors.number = "Número é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    const validate = await validateForm();
    // console.log(validate);
    if (!item) {
      if (validate && collaborator) {
        setAwaitCreat(true);
        const data = {
          category: title,
          CPF_creator: collaborator.CPF,
          title: titleValue,
          typePayment: priceType,
          typeAnnouncement: adType,
          salary: price,
          included: included,
          notIncluded: excluded,
          information: moreInfo,
          model: model,
          street: street,
          complement: complement,
          number: number,
          city: city,
          district: district,
          state: state,
          zip: Mask("remove", zip),
          gallery: gallery,
        };
        const response = await CreateAnnouncement(data);
        if (response.status == 201) {
          Alert.alert(
            "Sucesso!",
            "A vaga foi criada com sucesso.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
          setAwaitCreat(false);
          navigation.goBack();
          return;
        }
        setAwaitCreat(false);
      } else {
        setVisible(true);
      }
      return;
    }
    if (validate && collaborator) {
      const data = {
        category: title,
        title: titleValue,
        typePayment: priceType,
        typeAnnouncement: adType,
        salary: price,
        included: included,
        notIncluded: excluded,
        information: moreInfo,
        model: model,
        street: street,
        complement: complement,
        number: number,
        city: city,
        district: district,
        state: state,
        zip: Mask("remove", zip),
        gallery: gallery,
        oldGallery: oldGallery,
      };
      setAwaitCreat(true);
      const response = await UpdateAnnouncement(item.id, data);
      console.log(response)
      if (response.status == 200) {
        Alert.alert(
          "Sucesso!",
          "A vaga foi editada com sucesso.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        setAwaitCreat(false);
        navigation.goBack();
        navigation.goBack();
        return;
      }
      setAwaitCreat(false);
    } else {
      setVisible(true);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    try {
      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length !== 8) return;

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não encontramos esse CEP.");
        return;
      }

      setStreet(data.logradouro || "");
      setCity(data.localidade || "");
      setState(data.uf || "");
      setDistrict(data.bairro || "");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o endereço.");
      console.error(error);
    }
  };

  return (
    <View>
      <ModalErrors item={errors} visible={visible} setVisible={setVisible} />
      <ModalUpload
        selectedGalleryIndex={selectedGalleryIndex}
        setSelectedGalleryIndex={setSelectedGalleryIndex}
        setGallerty={setGallery}
        visible={visibleUpload}
        setVisible={setVisibleUpload}
      />
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
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
          paddingHorizontal: 20,
        }}
      >
        {!selectAdTypeView ? (
          <>
            <Text
              style={[FONTS.fontBlack, { fontSize: rf(20), marginBottom: 16 }]}
            >
              Formulário de Serviço
            </Text>
            <View className="gap-1">
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Título
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Título"
                value={titleValue}
                onChangeText={setTitleValue}
              />
            </View>

            {/* Tipo de preço */}
            <View>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Forma de Pagamento
              </Text>
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
            </View>

            {/* Preço */}
            <View className="gap-1">
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Preço
              </Text>
              {priceType !== "A combinar" && (
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mb-4"
                  placeholder="Digite o preço"
                  keyboardType="numeric"
                  value={Mask("amount", price)}
                  onChangeText={(text) => {
                    const numeric = text.replace(/\D/g, ""); // remove tudo que não é número
                    setPrice(numeric);
                  }}
                />
              )}
            </View>

            {/* Modelo */}
            <View>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Modelo
              </Text>
              <ScrollView
                horizontal
                className="px-3"
                contentContainerStyle={{ paddingRight: 18 }}
              >
                <View className="flex flex-row gap-4 mb-4 py-1">
                  {["Presencial", "Híbrido", "Remoto"].map((type) => (
                    <TouchableOpacity
                      style={Styles.card}
                      key={type}
                      className={`px-4 py-2 rounded-full ${
                        model === type ? "bg-primary" : "bg-white"
                      }`}
                      onPress={() => setModel(type)}
                    >
                      <Text
                        className={`${
                          model === type ? "text-dark" : "text-gray-500"
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Incluído */}
            <View className="gap-1">
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                O que está incluído
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="O que está incluído"
                value={included}
                onChangeText={setIncluded}
              />
            </View>

            {/* Não incluído */}
            <View>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                O que não está incluído
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="O que não está incluído"
                value={excluded}
                onChangeText={setExcluded}
              />
            </View>

            {/* Mais informações */}
            <View>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Mais informações sobre o serviço
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Mais informações sobre o serviço"
                value={moreInfo}
                onChangeText={setMoreInfo}
              />
            </View>

            {/* Endereço */}
            <View>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>CEP</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite o CEP"
                value={Mask("cep", zip)}
                onChangeText={(value) => {
                  setZip(value);
                  const numericCep = value.replace(/\D/g, "");
                  if (numericCep.length === 8) fetchAddressByCep(numericCep);
                }}
                keyboardType="numeric"
              />

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>Rua</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite a rua"
                value={street}
                onChangeText={setStreet}
              />

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Bairro
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite a cidade"
                value={district}
                onChangeText={setDistrict}
              />

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Complemento (opcional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite o complemento (opcional)"
                value={complement}
                onChangeText={setComplement}
              />

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Número
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-2"
                placeholder="Digite o número"
                value={noNumber ? "S/N" : number}
                onChangeText={setNumber}
                editable={!noNumber}
                keyboardType="numeric"
              />

              <TouchableOpacity
                className="mb-4"
                onPress={() => {
                  setNoNumber((prev) => !prev);
                  if (!noNumber)
                    setNumber("S/N"); // limpa se marcar como sem número
                  else setNumber(""); // reseta se desmarcar
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-4 h-4 mr-2 rounded border border-gray-400 ${
                      noNumber ? "bg-green-600" : "bg-white"
                    }`}
                  />
                  <Text style={{ ...FONTS.fontBlack, fontSize: rf(17) }}>
                    Sem número
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Cidade
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite a cidade"
                value={city}
                onChangeText={setCity}
              />

              <Text style={{ ...FONTS.fontLight, fontSize: rf(16) }}>
                Estado
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Digite o estado"
                value={state}
                onChangeText={setState}
              />
            </View>

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
                    // if (gallery[i]) return;
                    // @ts-ignore
                    setSelectedGalleryIndex(i);
                    setVisibleUpload(true); // abrir modal
                  }}
                  className="rounded-lg items-center justify-center overflow-hidden bg-gray-100"
                  style={[Styles.card, { width: boxSize, height: boxSize }]}
                >
                  {gallery[i]?.base64 || gallery[i]?.uri || gallery[i] ? (
                    <Image
                      source={{
                        uri:
                          gallery[i]?.base64 || gallery[i]?.uri || gallery[i],
                      }} // <- garante que funcione se for string ou objeto
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
              onPress={handleCreate}
            >
              {!awaitCreat ? (
                <Text className="text-dark font-bold">
                  {item ? "Atualizar Anúncio" : "Publicar Anúncio"}
                </Text>
              ) : (
                <ActivityIndicator color={"black"} size={19} />
              )}
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
