import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
  variant?: "default" | "night"; // 背景の種類を指定
};

export default function Background({ children, variant = "default" }: BackgroundProps) {
  // variant に応じて背景画像を切り替え
  const backgroundImage = variant === "night" ? "/bg-night.png" : "/bg.png";

  return (
    // h-[100dvh] で画面高さを固定、overflow-hidden ではみ出し防止
    <div className="relative w-full h-[100dvh] overflow-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
}