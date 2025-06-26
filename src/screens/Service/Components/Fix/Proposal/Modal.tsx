import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  Banknote,
  History,
  CircleCheck,
  Megaphone,
  Info,
  ChevronRight,
  Home,
  UserRound,
  Mail,
  MapPin,
} from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import CardPeople from "~/src/screens/Home/Helper/CardPeopleService";
import PeopleInformation from "~/src/screens/Home/Helper/Modal/PeopleInformation";
import ServiceInformation from "~/src/screens/Home/Helper/Modal/ServiceInformation";
export default function ModalProposal({ item, visible, setVisible }: any) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [visiblePeople, setVisiblePeople] = useState<boolean>(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);
      if (index === -1) {
        setVisible(false);
      }
    },
    [setVisible]
  );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <GestureHandlerRootView>
      <ServiceInformation
        visible={visiblePeople}
        setVisible={setVisiblePeople}
        peopleData={item}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["35%", "80%"]}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View className="px-5">
          <View className="flex-row items-center mb-5">
            <View
              style={{ height: rf(40), width: rf(40) }}
              className="bg-zinc-100 flex-row items-center justify-center rounded-full mr-3"
            >
              <Mail size={rf(20)} />
            </View>
            <View>
              <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(16) }}>
                {item && item.title && item.title}
              </Text>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                Criado em: {item && item.create && item.create}
              </Text>
            </View>
          </View>
          <View className="mt-5 gap-2">
            <View className="flex-row">
              <Banknote size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                Pagando {`${Mask("amount", item.salary)} ${item.valueType}`}
              </Text>
            </View>
            <View className="flex-row">
              <Home size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                Modelo {item && item.model && item.model}
              </Text>
            </View>
            <View className="flex-row">
              <MapPin size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                {item && item.locality && item.locality}
              </Text>
            </View>
          </View>

          {currentSnapIndex > 0 && (
            <View className="border-t border-1 border-zinc-200 mt-5">
              <TouchableOpacity
                className="flex-row w-full justify-between items-center mt-5"
                onPress={() => setVisiblePeople(true)}
              >
                <View>
                  <Text style={{ ...FONTS.fontLight, fontSize: rf(9) }}>
                    Serviço
                  </Text>
                  <View className="flex-row">
                    {item.photoUri ? (
                      <Image
                        source={{ uri: item.photoUri }}
                        style={{ width: rf(18), height: rf(18) }}
                        className="rounded-full mr-1"
                        resizeMode="cover"
                      />
                    ) : (
                      <UserRound size={rf(16)} className="mr-1" />
                    )}
                    <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                      {item &&
                        item.name &&
                        item.name}
                    </Text>
                  </View>
                </View>
                
                <ChevronRight size={rf(16)} />
              </TouchableOpacity>


              <TouchableOpacity className="flex-row w-full justify-between items-center mt-5">
                <View className="flex-row">
                  <Info size={rf(16)} className="mr-1" />
                  <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                    Denunciar
                  </Text>
                </View>
                <ChevronRight size={rf(16)} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}
