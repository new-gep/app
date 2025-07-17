import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ServiceInformation from "~/src/screens/Home/Helper/Modal/ServiceInformation";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import {
  Banknote,
  ChevronRight,
  CircleCheck,
  History,
  Home,
  Info,
  MapPin,
  Phone,
  PhoneCall,
  UserRound,
} from "lucide-react-native";
import Mask from "~/src/function/mask";
import PeopleInformation from "~/src/screens/Home/Helper/Modal/PeopleInformation";
export default function Modal({ item, visible, setVisible }: any) {
  const [visibleService, setVisibleService] = useState<boolean>(false);
  const [visiblePeople, setVisiblePeople] = useState<boolean>(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
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
        opacity={0.6} // você pode ajustar para 0.4 ou 0.8 se quiser mais claro ou mais escuro
      />
    ),
    []
  );

  // console.log(item.collaborator)

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <GestureHandlerRootView>
      {item && (
        <ServiceInformation
          autoView={true}
          peopleData={item}
          visible={visibleService}
          setVisible={setVisibleService}
          handleSwipeRight={() => {}}
        />
      )}
      { item?.CPF_Creator?.collaborator && (
        <PeopleInformation
          visible={visiblePeople}
          setVisible={setVisiblePeople}
          peopleData={{...item.CPF_Creator.collaborator, match:true}}
        />
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["35%", "80%"]}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View className="px-5">
          <View className="flex-row items-center mb-5">
            {item?.CPF_Creator?.collaborator?.picture ? (
              <Image
                source={{ uri: item.CPF_Creator.collaborator.picture }}
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
            <View className="ml-3">
              <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(16) }}>
                {item && item.title && item.title}
              </Text>
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                Categoria: {item?.category && item.category}
              </Text>
            </View>
          </View>

          <View className="mt-5 gap-2 ">
            <View className="flex-row">
              <UserRound size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                {item?.CPF_Creator?.collaborator?.collaborator?.name && item.CPF_Creator.collaborator.collaborator.name}
              </Text>
            </View>
            <View className="flex-row">
              <Phone size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                {item?.CPF_Creator?.collaborator?.collaborator?.phone && Mask('phone', item.CPF_Creator.collaborator.collaborator.phone)}
              </Text>
            </View>
            <View className="flex-row">
              <MapPin size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                {item?.CPF_Creator?.collaborator?.collaborator?.city && item.CPF_Creator.collaborator.collaborator.city},  {item?.CPF_Creator?.collaborator?.collaborator?.uf && item.CPF_Creator.collaborator.collaborator.uf}
              </Text>
            </View>
            <View className="flex-row">
              <Banknote size={rf(16)} className="mr-1" />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                Pagamento {`${item?.salary && Mask("amount", item.salary)} ${item?.typePayment && item.typePayment}`}
              </Text>
            </View>
          </View>
        </View>
        {currentSnapIndex > 0 && (
          <View className="border-t border-1 border-zinc-200 mt-5 px-5">
            <TouchableOpacity
              className="flex-row w-full justify-between items-center mt-5"
              onPress={() => setVisiblePeople(true)}
            >
              <View>
                <Text style={{ ...FONTS.fontLight, fontSize: rf(9) }}>
                  Solicitante do serviço
                </Text>
                <View className="flex-row">
                  {item?.CPF_Creator?.collaborator?.picture ? (
                    <Image
                      source={{ uri: item.CPF_Creator.collaborator.picture }}
                      style={{ width: rf(18), height: rf(18) }}
                      className="rounded-full mr-1"
                      resizeMode="cover"
                    />
                  ) : (
                    <UserRound size={rf(16)} className="mr-1" />
                  )}
                  <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                    {item.CPF_Creator?.collaborator?.collaborator?.name && item.CPF_Creator.collaborator.collaborator.name}
                  </Text>
                </View>
              </View>
              <ChevronRight size={rf(16)} />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row w-full justify-between items-center mt-5"
              onPress={() => setVisibleService(true)}
            >
              <View>
                <Text style={{ ...FONTS.fontLight, fontSize: rf(9) }}>
                  Anúncio
                </Text>
                <View className="flex-row">
                  <History size={rf(16)} className="mr-1" />
                  <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                    {item && item.title && item.title}
                  </Text>
                </View>
              </View>
              <ChevronRight size={rf(16)} />
            </TouchableOpacity>
            
            {/* <TouchableOpacity className="flex-row w-full justify-between items-center mt-5">
              <View className="flex-row">
                <Info size={rf(16)} className="mr-1" />
                <Text style={{ ...FONTS.fontLight, fontSize: rf(12) }}>
                  Denunciar
                </Text>
              </View>
              <ChevronRight size={rf(16)} />
            </TouchableOpacity> */}
          </View>
        )}
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}
