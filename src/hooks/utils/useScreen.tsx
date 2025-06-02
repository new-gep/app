// src/hooks/useScreen.ts
import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

export function useScreen() {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;

  const wp = (percent: number) => (width * percent) / 100;
  const hp = (percent: number) => (height * percent) / 100;

  return { width, height, wp, hp };
}
