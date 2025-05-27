import React from "react";
import { Image } from "react-native";
import { IMAGES } from "~/src/constants/Images";

export default function Icon({
  name,
  color = "black",
}: {
  name: string;
  color?: string;
}) {
  return (
    <Image
      //@ts-ignore
      source={IMAGES[name]}
      tintColor={color}
      className={`h-full w-full`}
      resizeMode="contain"
    />
  );
}
