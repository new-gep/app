import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { rf } from "~/src/hooks/utils/responsiveFont";
import ModalPercentage from "./Modal";

const { width: screenWidth } = Dimensions.get("window");

const SIZE = screenWidth * 0.2;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

const getProgressColor = (progress: number): string => {
  if (progress < 50) return "#ef4444"; // vermelho
  if (progress < 75) return "#facc15"; // amarelo
  return "#22c55e"; // verde
};

export default function Percentage({ progress = 50 }: { progress?: number }) {
  const strokeDashoffset = CIRCLE_LENGTH - (CIRCLE_LENGTH * progress) / 100;
  const [modal, setModal] = React.useState<boolean>(false);
  const progressColor = getProgressColor(progress);

  return (
    <>
      <ModalPercentage visible={modal} setVisible={setModal} />
      <TouchableOpacity
        onPress={() => setModal(!modal)}
        className="absolute justify-center items-center bg-dark rounded-full opacity-80"
        style={{
          width: SIZE,
          height: SIZE,
          bottom: 30,
          right: 25,
        }}
      >
        <Svg height={SIZE} width={SIZE} className="absolute">
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#2f2f2f"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={progressColor}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        <Text
          className="text-white font-semibold text-center"
          style={{ fontSize: rf(15) }}
        >
          {progress}%
        </Text>
      </TouchableOpacity>
    </>
  );
}
