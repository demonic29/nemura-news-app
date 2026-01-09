"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import LottiePlayer from "@/components/LottiePlayer";

import { 
  ArrowRightIcon, 
  AddCircleIcon, 
  RemoveCircleIcon 
} from "@/app/assets/icons";

import smileJson from "@/app/assets/animations/smile-nemura.json";

const TOPICS = [
  { id: "world", label: "世の中" },
  { id: "politics", label: "政治と経済" },
  { id: "life", label: "暮らし" },
  { id: "study", label: "学び" },
  { id: "tech", label: "テクノロジー" },
  { id: "entame", label: "エンタメ" },
  { id: "funny", label: "おもしろ" },
  { id: "anime", label: "アニメとゲーム" },
];

export default function TopicSelectionPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <Background>
      <div className="relative w-full h-[100dvh] flex flex-col items-center overflow-hidden">
        
        {/* テキストエリア */}
        <div className="mt-[50%] w-full px-8 space-y-2 z-10">
          <h1 className="text-white-soft text-[20px] font-bold tracking-tight leading-tight text-left drop-shadow-white-glow-str">
            あなたが気になる話題はなんですか？
          </h1>
          <p className="text-white-soft text-[15px] text-left">
            あとから設定で変えられます
          </p>
        </div>

        {/* トピック 2列 */}
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-3 w-full px-6 max-w-[420px] z-10">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 active:scale-95
                  ${isSelected 
                    ? "bg-button text-white-soft border-transparent drop-shadow-white-glow" 
                    : "bg-white-soft text-gray-soft border-transparent"}
                `}
              >
                {isSelected ? (
                  <RemoveCircleIcon className="w-5 h-5 shrink-0" />
                ) : (
                  <AddCircleIcon className="w-5 h-5 shrink-0 text-gray-soft" />
                )}
                <span className="text-[15px] font-bold truncate">{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* ナビゲーションボタン */}
        <div className="mt-10 w-full px-8 flex justify-between items-center z-20">
          <button
            onClick={() => router.push("/welcome?index=4")}
            className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow"
          >
            <ArrowRightIcon className="rotate-180 w-5 h-5" />
            <span className="text-[16px]">もどる</span>
          </button>

          <button
            onClick={() => router.push("/welcome/choose-voice")}
            className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow"
          >
            <span className="text-[16px]">次へ</span>
            <ArrowRightIcon className="w-5 h-5" />
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