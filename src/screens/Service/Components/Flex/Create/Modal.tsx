import React, { useRef, useEffect, useCallback, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import {
  CircleAlert,
} from "lucide-react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";

export default function ModalErrors({ item, visible, setVisible }: any) {
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%", "80%"]}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <View className="px-5">
          <View className="justify-center items-center mb-5">
            <CircleAlert className="text-red-500" size={rf(30)} />
          </View>
          <View className="mt-5 gap-2">
             {Object.values(item).map((errorMsg, index) => (
                <View>
                    <Text key={index} style={{ color: "#71717a", fontSize: rf(13), ...FONTS.fontSemiBold }}>
                        {errorMsg}
                    </Text>
                </View>
              ))}
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
