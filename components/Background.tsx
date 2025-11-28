import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return (
    <div
      style={{
        position: "fixed",       // 画面全体に固定
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "url('/bg.png') no-repeat center center",
        backgroundSize: "cover",
        zIndex: -1,              // 子要素より後ろに
      }}
    >
      {children}
    </div>
  );
}