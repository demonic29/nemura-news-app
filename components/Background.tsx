import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return (
    // min-h-screen を h-[100dvh] に変更し、はみ出しを禁止
    <div className="relative w-full h-[100dvh] overflow-hidden"> 
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
}