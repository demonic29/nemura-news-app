import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode
  variant?: 'day' | 'night'
}

export default function Background({
  children,
  variant = 'day',
}: BackgroundProps) {
  const bgImage =
    variant === 'night' ? "/bg-night.png" : "/bg.png"

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </div>
  )
}