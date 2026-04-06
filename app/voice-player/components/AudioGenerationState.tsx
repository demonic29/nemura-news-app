import Image from "next/image";

import waitVoice from "@/public/wait-voice.png";

export default function AudioGenerationState() {
  return (
    <div className="flex h-full min-h-[55dvh] flex-col items-center justify-center px-6 text-center">
      <Image
        src={waitVoice}
        alt="音声生成中"
        width={200}
        height={200}
        className="animate-pulse"
        priority
        style={{ width: "clamp(9rem, 38vw, 12.5rem)", height: "auto" }}
      />
      <p className="mt-6 text-lg text-white sm:text-xl">音声を生成中...</p>
      <p className="mt-2 text-sm text-gray-300 sm:text-[14px]">寝る前の準備をしといてね ~~ 😴</p>
    </div>
  );
}
