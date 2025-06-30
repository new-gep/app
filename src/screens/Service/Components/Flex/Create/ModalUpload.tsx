import React, { useRef, useEffect, useCallback, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity } from "react-native";
import { CircleAlert } from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import GetPathPicture from "~/src/function/getPathPicture";

export default function ModalUpload({ setGallerty, setSelectedGalleryIndex, selectedGalleryIndex, visible, setVisible }: any) {
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
        opacity={0.6}
      />
    ),
    []
  );
  const handlePicture = async (option: "gallery" | "camera") => {
  let path: any;

  switch (option) {
    case "gallery":
      path = await GetPathPicture("gallery");
      break;
    case "camera":
      path = await GetPathPicture("camera");
      break;
  }

  if (path === "cancel" || selectedGalleryIndex === null) return;

  setGallerty((prev: any) => {
    const updated = [...prev];
    updated[selectedGalleryIndex] = path; // Atualiza exatamente o índice clicado
    return updated;
  });

  setSelectedGalleryIndex(null);  // Limpa o índice depois do uso
  setVisible(false);      // Fecha o modal
};

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%"]}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View className="px-5">
          <View className="mt-5 gap-3">
            <View>
              <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(14) }}>
                Escolha uma opção
              </Text>
            </View>
            <View className="items-center justify-center mt-5 gap-4">
              <TouchableOpacity
                className="bg-primary w-3/6 py-2 rounded-lg"
                onPress={() => handlePicture("gallery")}
              >
                <Text
                  style={{ ...FONTS.fontBlack, fontSize: rf(16) }}
                  className="text-center"
                >
                  Galeria
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primary w-3/6 py-2 rounded-lg"
                onPress={() => handlePicture("camera")}
              >
                <Text
                  style={{ ...FONTS.fontBlack, fontSize: rf(16) }}
                  className="text-center"
                >
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* {currentSnapIndex > 0 && (
            <View className="border-t border-1 border-zinc-200 mt-5">
             
            </View>
          )} */}
        </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}
