"use client";

import Lottie from "lottie-react";

export default function LottiePlayer({
  data,
  width = 300,
  height = 300,
  loop = true,
}: {
  data: any;
  width?: number;
  height?: number;
  loop?: boolean;
}) {
  return (
    <Lottie
      animationData={data}
      loop={loop}
      style={{ width, height }}
    />
  );
}