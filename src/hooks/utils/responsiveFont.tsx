// utils/responsiveFont.ts
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 375; // iPhone 11, 12, 13...

export function rf(value: number) {
  return (SCREEN_WIDTH / BASE_WIDTH) * value;
}
