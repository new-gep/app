import { View, Text, Dimensions, Image } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef } from "react";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { IMAGES } from "~/src/constants/Images";

export default function Modal({ visible, setVisible, path }: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { width, height } = Dimensions.get("window");
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

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
      setVisible(false)
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["95%"]}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
      >
        <View className="h-full px-3">
          <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(15) }}>
            Assinatura
          </Text>
          {path ? (
            <ImageZoom
              style={{
                width: "100%",
                height: Dimensions.get("window").height * 0.7,
                resizeMode: "contain",
              }}
              source={{ uri: path }}
            />
          ) : (
            <View className="h-full items-center justify-center mt-10">
              <Image
                source={IMAGES.unique29}
                style={{
                  height: height * 0.3, // Ajuste dinâmico para altura
                  width: width * 0.5, // Ajuste dinâmico para largura
                  resizeMode: "contain",
                  marginTop: -120,
                }}
              />
              <View className="items-center mt-5">
                <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(11) }}>
                  Nenhuma assinatura encontrada
                </Text>
                <Text
                  style={{
                    ...FONTS.fontLight,
                    fontSize: rf(9),
                    textAlign: "center",
                  }}
                >
                  Salve sua assinatura digital para continuar com a visualização
                </Text>
              </View>
            </View>
          )}
        </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}
