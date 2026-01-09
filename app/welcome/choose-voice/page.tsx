"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import LottiePlayer from "@/components/LottiePlayer";

import { 
  ArrowRightIcon, 
  CheckIcon,
  GraphicIcon,
} from "@/app/assets/icons";

import smileJson from "@/app/assets/animations/smile-nemura.json";

const VOICES = [
  { id: "electronic", label: "電子的な声" },
  { id: "cool", label: "冷静な声" },
  { id: "child", label: "子どもの声" },
  { id: "low", label: "低音な声" },
  { id: "warm", label: "あたたかい声" },
];

export default function ChooseVoicePage() {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState("electronic");

  return (
    <Background>
      <div className="relative w-full h-[100dvh] flex flex-col items-center overflow-hidden">
        
        {/* テキストエリア */}
        <div className="mt-[50%] w-full px-8 space-y-2 z-10">
          <h1 className="text-white-soft text-[22px] font-bold tracking-tight leading-tight text-left drop-shadow-white-glow-str">
            好きな僕の声をおしえてください！
          </h1>
          <p className="text-white-soft/90 text-[15px] text-left">
            あとから設定で変えられます
          </p>
        </div>

        {/* 音声選択ボタンエリア */}
        <div className="mt-10 w-full px-6 max-w-[420px] z-10 flex flex-col items-center gap-y-6">
          
          {/* 上段：2つ */}
          <div className="flex justify-center gap-x-12">
            {VOICES.slice(0, 2).map((voice) => (
              <VoiceButton 
                key={voice.id}
                label={voice.label}
                isSelected={selectedVoice === voice.id}
                onClick={() => setSelectedVoice(voice.id)}
              />
            ))}
          </div>

          {/* 下段：3つ */}
          <div className="flex justify-center gap-x-6">
            {VOICES.slice(2).map((voice) => (
              <VoiceButton 
                key={voice.id}
                label={voice.label}
                isSelected={selectedVoice === voice.id}
                onClick={() => setSelectedVoice(voice.id)}
              />
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="mt-10 w-full px-8 flex justify-between items-center z-20">
          <button
            onClick={() => router.push("/welcome/choose-topic")}
            className="flex items-center gap-1 text-white-soft bg-button/80 backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow"
          >
            <ArrowRightIcon className="rotate-180 w-5 h-5" />
            <span className="text-[16px]">もどる</span>
          </button>

          <button
            onClick={() => router.push("/welcome/arigatou")}
            className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-8 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow"
          >
            <span className="text-[16px]">確定</span>
            <CheckIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 下部のねむら */}
        <div className="absolute bottom-[-100px] w-full flex justify-center pointer-events-none z-0">
          <LottiePlayer data={smileJson} width={360} height={360} />
        </div>

      </div>
    </Background>
  );
}

// ボタンコンポーネント
function VoiceButton({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={`
        w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
        ${isSelected 
          ? "bg-button text-white-soft scale-110 drop-shadow-white-glow" 
          : "bg-white-soft text-gray-soft opacity-90"}
      `}>
        <GraphicIcon className={`w-10 h-10 ${isSelected ? "animate-pulse" : ""}`} />
      </div>
      <span className={`text-[14px] font-bold drop-shadow-md text-white-soft ${isSelected ? "opacity-100" : "opacity-80"}`}>
        {label}
      </span>
    </button>
  );
}