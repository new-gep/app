import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text } from "react-native";
export default function ModalService({ item, visible, setVisible }: any) {
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
        snapPoints={["25%", "50%"]}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <View>
            <Text>Congratulation</Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}
