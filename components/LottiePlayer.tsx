"use client";

import Lottie from "lottie-react";

export default function LottiePlayer({
  data,
  width = 300,
  height = 300,
  loop = true,
}: {
  data: any;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
}) {
  return (
    <Lottie
      animationData={data}
      loop={loop}
      style={{ width, height, margin: 'auto' }}
    />
  );
}
