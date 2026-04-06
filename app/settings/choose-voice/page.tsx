"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import NavigationHeader from "@/components/NavigationHeader";

import LottiePlayer from "@/components/LottiePlayer";
import VoiceOptionPicker from "@/components/VoiceOptionPicker";

import {
  CheckIcon,
} from "@/assets/icons";

import smileJson from "@/assets/animations/smile-nemura.json";
import { auth } from "@/app/lib/config/firebase";
import { DEFAULT_VOICE } from "@/app/lib/voices";
import {
  cacheVoicePreference,
  saveUserVoicePreference,
} from "@/app/lib/userPreferences";

export default function ChooseVoicePage() {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE.id);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const confirmVoice = async () => {
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
      router.replace("/home");
    } catch (e) {
      setError("保存に失敗しました");
      setLoading(false);
    }
  };

  return (
    <Background>
      <div className="relative w-full h-[100dvh] flex flex-col items-center overflow-hidden pt-[54px]">
        <NavigationHeader showSetting={false} />

        {/* テキストエリア */}
        <div className="mt-[30%] w-full px-8 space-y-2 z-10">
          <h1 className="text-white-soft text-[22px] font-bold tracking-tight leading-tight text-left drop-shadow-white-glow-str">
            好きな僕の声をおしえてください！
          </h1>
        </div>

        <VoiceOptionPicker
          selectedVoiceId={selectedVoice}
          disabled={loading}
          onSelect={setSelectedVoice}
        />

        {/* ナビゲーションボタン */}
        <div className="mt-10 w-full px-8 flex justify-between items-center z-20">

          <button
            onClick={confirmVoice}
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
