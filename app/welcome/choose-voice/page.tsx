"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import LottiePlayer from "@/components/LottiePlayer";
import VoiceOptionPicker from "@/components/VoiceOptionPicker";

import {
  ArrowRightIcon,
  CheckIcon,
} from "@/app/assets/icons";

import smileJson from "@/app/assets/animations/smile-nemura.json";

// firebase
import { auth } from "@/app/lib/config/firebase";
import { DEFAULT_VOICE } from "@/app/lib/voices";
import {
  cacheVoicePreference,
  saveUserVoicePreference,
} from "@/app/lib/userPreferences";

export default function ChooseVoicePage() {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE.id);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError("ログイン情報が見つかりません");
      return;
    }

    try {
      setLoading(true);
      const savedVoice = await saveUserVoicePreference(user.uid, selectedVoice);
      cacheVoicePreference(savedVoice);

      // Navigate immediately - pre-generation happens in voice-player
      router.replace("/welcome/arigatou");
    } catch (e) {
      setError("保存に失敗しました");
      setLoading(false);
    }
  };

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

        <VoiceOptionPicker
          selectedVoiceId={selectedVoice}
          disabled={loading}
          onSelect={setSelectedVoice}
        />

        {/* ナビゲーションボタン */}
        <div className="mt-10 w-full px-8 flex justify-between items-center z-20">
          <button
            onClick={() => router.push("/welcome/choose-topic")}
            disabled={loading}
            className="flex items-center gap-1 text-white-soft bg-button/80 backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow disabled:opacity-50"
          >
            <ArrowRightIcon className="rotate-180" />
            <span className="text-[16px]">もどる</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-8 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow disabled:opacity-50"
          >
            <span className="text-[16px]">{loading ? "保存中..." : "確定"}</span>
            {!loading && <CheckIcon />}
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="absolute top-20 left-8 right-8 bg-red-500/20 text-red-200 px-4 py-2 rounded-lg z-30">
            {error}
          </div>
        )}

        {/* 下部のねむら */}
        <div className="absolute bottom-[-100px] w-full flex justify-center pointer-events-none z-0">
          <LottiePlayer data={smileJson} width={360} height={360} />
        </div>
      </div>
    </Background>
  );
}
