"use client";

import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import NavigationHeader from "@/components/NavigationHeader"
import LottiePlayer from "@/components/LottiePlayer";

import { 
  AddCircleIcon,
  GraphicIcon,
} from "@/assets/icons";

import smileJson from "@/assets/animations/smile-nemura.json";

export default function SettingsPage() {
  const router = useRouter();

  const SETTINGS_MENU = [
    { id: "topics", label: "気になる話題", icon: <AddCircleIcon className="w-7 h-7 text-gray-soft" /> },
    { id: "voice", label: "読み上げ音声", icon: <GraphicIcon className="w-7 h-7 text-gray-soft" /> },
  ];

  return (
    <Background>
    <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden pt-[54px]">
      <div className="h-[54px] shrink-0">
        <NavigationHeader showSetting={false} />
      </div>

        {/* メインメニュー */}
        <div className="flex-1 flex flex-col items-center px-10 gap-5 z-20 pt-40">
          {SETTINGS_MENU.map((item) => (
            <button
              key={item.id}
              className="group flex items-center w-full max-w-[340px] bg-white-soft py-4 px-5 rounded-full shadow-lg transition-all active:scale-[0.97]"
            >
              {/* アイコン */}
              <div className="flex items-center justify-center w-8">
                {item.icon}
              </div>

              {/* ラベル */}
              <span className="ml-4 text-base font-bold text-gray-soft">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* 下部のねむら（Lottie） */}
        <div className="absolute bottom-[-60px] w-full flex justify-center pointer-events-none z-10">
          <LottiePlayer 
            data={smileJson} 
            width={340} 
            height={340} 
          />
        </div>

      </div>
    </Background>
  );
}