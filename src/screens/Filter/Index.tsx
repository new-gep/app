import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Alert, Switch } from "react-native";
import Header from "~/src/layout/Header";
import Input from "./Input";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Check } from "lucide-react-native";
import Service from "./Components/Service";
import Time from "./Components/Time";
import Payment from "./Components/Payment";
import Contract from "./Components/Contract";
import Button from "~/src/components/Button/Button";
import Modality from "./Components/Modality";
import Category from "./Components/Category";
import { useNavigation, useRoute } from "@react-navigation/native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { FONTS } from "~/src/constants/theme";
import Slider from "@react-native-community/slider";

export default function Filter() {
  const [menu, setMenu] = useState<string>("default");
  const [serviceSelected, setServiceSelected] = useState<string[]>([]);
  const [distance, setDistance] = useState(2);
  const [showFarWork, setShowFarWork] = useState<boolean>(false);
  const [timeSelected, setTimeSelected] = useState<string[]>([]);
  const [paymentSelected, setPaymentSelected] = useState<string[]>([]);
  const [contractSelected, setContractSelected] = useState<string[]>([]);
  const [modalitySelected, setModalitySelected] = useState<string[]>([]);
  const [categorySelected, setCategorySelected] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { option, reload, setReload } = route.params as {
    option?: string;
    reload?: any;
    setReload?: any;
  };
  const handleApplyFilter = async () => {
    if (option == "Service") {
      const filterService = {
        service: serviceSelected,
        time: timeSelected,
        payment: paymentSelected,
        contract: contractSelected,
        modality: modalitySelected,
        distance: distance,
        showFarWork: showFarWork,
      };
      await AsyncStorage.setItem(
        "filterService",
        JSON.stringify(filterService)
      );
      Alert.alert("Filtro aplicado", "Seu filtro foi aplicado com sucesso!", [
        { text: "OK" },
      ]);
      return;
    }
    const filterCategory = {
      category: categorySelected,
      time: timeSelected,
      payment: paymentSelected,
      contract: contractSelected,
      modality: modalitySelected,
      distance: distance,
      showFarWork: showFarWork,
    };
    await AsyncStorage.setItem(
      "filterCategory",
      JSON.stringify(filterCategory)
    );
    setReload((prev: number) => prev + 1);

    Alert.alert("Filtro aplicado", "Seu filtro foi aplicado com sucesso!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(), // <- volta para a tela anterior
      },
    ]);
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        if (option === "Service") {
          const json = await AsyncStorage.getItem("filterService");
          if (json) {
            const filters = JSON.parse(json);
            setServiceSelected(filters.service || []);
            setTimeSelected(filters.time || []);
            setPaymentSelected(filters.payment || []);
            setContractSelected(filters.contract || []);
            setModalitySelected(filters.modality || []);
            setDistance(filters.distance || 2);
            setShowFarWork(filters.showFarWork || false);
          }
        } else {
          const json = await AsyncStorage.getItem("filterCategory");
          if (json) {
            const filters = JSON.parse(json);
            setCategorySelected(filters.category || []);
            setTimeSelected(filters.time || []);
            setPaymentSelected(filters.payment || []);
            setContractSelected(filters.contract || []);
            setModalitySelected(filters.modality || []);
            setDistance(filters.distance || 2);
            setShowFarWork(filters.showFarWork || false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar filtros do storage:", error);
      }
    };

    loadFilters();
  }, []);

  return (
    <View className="h-full bg-white">
      {option == "Service" ? (
        <>
          {menu == "default" ? (
            <>
              <Header title="Filtro de Serviço" leftIcon={"back"} />
              <ScrollView
                className="gap-5 mt-5"
                contentContainerStyle={{ paddingBottom: 70 }}
              >
                <View>
                  <Input
                    go={"service"}
                    title={"Serviço"}
                    placeholder={"Escolha uma opção"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {serviceSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {serviceSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go={"time"}
                    title={"Horário"}
                    placeholder={"Escolha um horário"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {timeSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {timeSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go={"payment"}
                    title={"Pagamento"}
                    placeholder={"Escolha um pagamento"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {paymentSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {paymentSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go="contract"
                    title={"Contrato"}
                    placeholder={"Escolha um contrato"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {contractSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {contractSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go="modality"
                    title={"Modalidade"}
                    placeholder={"Escolha uma modalidade"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {modalitySelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {modalitySelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View className="rounded-lg p-4 mb-4">
                  <Text
                    className="text-dark mb-2"
                    style={{ ...FONTS.fontRegular, fontSize: 14 }}
                  >
                    Distância máxima
                  </Text>
                  <Slider
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                    value={distance}
                    onValueChange={setDistance}
                    minimumTrackTintColor="#fde047"
                    maximumTrackTintColor="#666"
                    thumbTintColor="#fde047"
                    className="mb-4"
                  />
                  <Text
                    className="text-dark mb-2"
                    style={{ ...FONTS.fontRegular, fontSize: 14 }}
                  >
                    {distance} km
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-dark w-5/6"
                      style={{ ...FONTS.fontRegular, fontSize: 14 }}
                    >
                      Mostrar vagas mais longe de mim se eu ficar sem vagas pra
                      ver
                    </Text>
                    <Switch
                      value={showFarWork}
                      onValueChange={setShowFarWork}
                      trackColor={{ true: "#fde047", false: "#666" }}
                      thumbColor="#FFF"
                    />
                  </View>
                </View>
              </ScrollView>
              <View className="px-5 py-2 ">
                <Button
                  color={"#fde047"}
                  text={"black"}
                  title={"Aplicar Filtro"}
                  onPress={handleApplyFilter}
                />
              </View>
            </>
          ) : menu == "service" ? (
            <Service
              menu={menu}
              setMenu={setMenu}
              select={serviceSelected}
              setSelect={setServiceSelected}
            />
          ) : menu == "time" ? (
            <Time
              menu={menu}
              setMenu={setMenu}
              select={timeSelected}
              setSelect={setTimeSelected}
            />
          ) : menu == "payment" ? (
            <Payment
              menu={menu}
              setMenu={setMenu}
              select={paymentSelected}
              setSelect={setPaymentSelected}
            />
          ) : menu == "contract" ? (
            <Contract
              menu={menu}
              setMenu={setMenu}
              select={contractSelected}
              setSelect={setContractSelected}
            />
          ) : menu == "modality" ? (
            <Modality
              menu={menu}
              setMenu={setMenu}
              select={modalitySelected}
              setSelect={setModalitySelected}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {menu == "default" ? (
            <>
              <Header title="Filtro de Serviço" leftIcon={"back"} />
              <ScrollView
                className="gap-5 mt-5"
                contentContainerStyle={{ paddingBottom: 50 }}
              >
                <View>
                  <Input
                    go={"category"}
                    title={"Categoria"}
                    placeholder={"Escolha uma opção"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {categorySelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {categorySelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go={"time"}
                    title={"Horário"}
                    placeholder={"Escolha um horário"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {timeSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {timeSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go={"payment"}
                    title={"Pagamento"}
                    placeholder={"Escolha um pagamento"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {paymentSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {paymentSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go="contract"
                    title={"Contrato"}
                    placeholder={"Escolha um contrato"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {contractSelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {contractSelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View>
                  <Input
                    go="modality"
                    title={"Modalidade"}
                    placeholder={"Escolha uma modalidade"}
                    visible={menu}
                    setVisible={setMenu}
                  />
                  {modalitySelected.length > 0 && (
                    <View className="mt-2 px-8">
                      {modalitySelected.map((item, index) => (
                        <View className="flex-row items-center">
                          <Check
                            size={rf(20)}
                            color={"#22c55e"}
                            className="mr-1"
                          />
                          <Text
                            key={index}
                            className="text-sm text-[#22c55e] font-semibold"
                            style={{ marginBottom: 4, fontSize: rf(14) }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
              <View className="px-5 py-2 ">
                <Button
                  color={"#fde047"}
                  text={"black"}
                  title={"Aplicar Filtro"}
                  onPress={handleApplyFilter}
                />
              </View>
            </>
          ) : menu == "category" ? (
            <Category
              menu={menu}
              setMenu={setMenu}
              select={categorySelected}
              setSelect={setCategorySelected}
            />
          ) : menu == "time" ? (
            <Time
              menu={menu}
              setMenu={setMenu}
              select={timeSelected}
              setSelect={setTimeSelected}
            />
          ) : menu == "payment" ? (
            <Payment
              menu={menu}
              setMenu={setMenu}
              select={paymentSelected}
              setSelect={setPaymentSelected}
            />
          ) : menu == "contract" ? (
            <Contract
              menu={menu}
              setMenu={setMenu}
              select={contractSelected}
              setSelect={setContractSelected}
            />
          ) : menu == "modality" ? (
            <Modality
              menu={menu}
              setMenu={setMenu}
              select={modalitySelected}
              setSelect={setModalitySelected}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
}

const styles = {
  card: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};
