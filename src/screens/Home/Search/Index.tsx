import react, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, View, Text } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ListFilter } from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import FilterToggle from "./Toggle";
import { ScrollView } from "react-native-gesture-handler";
export default function SearchModal({ visible, setVisible, activeTab }: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const service  = ["Serviço", "Contrato", "Pagamento", "Horário"];
  const horary   = ["Integral", "Manhã", "Tarde", "Noite", "Madrugada", "Fins de semana", "Horário flexível"];
  const payment  = ["Serviço", "Contrato", "Pagamento", "Horário"];
  const contract = ["CLT", "PJ", "Contrato", "Autônomo", "Freelancer", "A combinar"];
  const modality = ["Presencial", "Híbrido", "Remoto"];
  const mobility = ["Carro", "Moto", "Aplicativo", "Ônibus", "Trem", "Bike", "A combinar"];

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

  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);
      if (index === -1) {
        setVisible(false);
      }
    },
    [setVisible]
  );

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss(); // opcional: fecha se visible for false
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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={["25%", "70%"]}
      index={1}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="px-5 py-2">
            { activeTab === "People" ?
                <View>
                    <View className="flex-row items-center">
                        <ListFilter size={rf(18)} className="mr-2"/>
                        <Text style={{fontSize:rf(18), ...FONTS.fontSemiBold}}>Título Pessoa</Text>
                        
                    </View>
                </View>
                :
                <ScrollView>
                    <View className="flex-row items-center">
                        <ListFilter size={rf(18)} className="mr-2"/>
                        <Text style={{fontSize:rf(18), ...FONTS.fontSemiBold}}>Título Serviço</Text>
                    </View>
                    <View className="py-3 gap-5">
                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Serviço
                            </Text>
                            {service.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>

                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Horário
                            </Text>
                            {horary.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>

                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Pagamento
                            </Text>
                            {payment.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>

                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Contrato
                            </Text>
                            {contract.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>

                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Modalidade
                            </Text>
                            {modality.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>

                        <View>
                            <Text style={{fontSize:rf(18), ...FONTS.fontLight}}>
                                Mobilidade
                            </Text>
                            {mobility.map((item) => (
                                <FilterToggle key={item} label={item} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            }
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
