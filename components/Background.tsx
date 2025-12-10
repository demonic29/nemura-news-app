import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="relative w-full min-h-screen"> 
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-end flex-1 pt-20">
        {children}
      </div>
    </div>
  );
}