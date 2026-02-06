"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Background from "@/components/Background";
import DialogueBox from "@/components/DialogueBox";
import LottiePlayer from "@/components/LottiePlayer";
import Fade from "@/components/Fade";

import sleepJson from "@/assets/animations/sleep-nemura.json";
import smileJson from "@/assets/animations/smile-nemura.json";
import { ArrowRightIcon, FingerPointIcon } from "../../assets/icons/index";

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fixed: Use React fragments and spans instead of divs to avoid hydration errors
  const lines = [
    <>zzz...</>,
    <>&#65281;</>,
    <>
      はじめまして...!<br />
      僕の名前は <span className="text-yellow-300">ねむら</span>です
    </>,
    <>
      この世界では毎日、<br />いろんなニュースが<br />あつまってきます
    </>,
    <>
      あなたはニュースを聞きに<br />
      いらしたんですよね？<br />
      少し質問よろしいですか？
    </>,
  ];

  // URLの index パラメータを取得
  const initialIndex = Number(searchParams.get("index")) || 0;
  const [index, setIndex] = useState(initialIndex);

  // パラメータが直接書き換えられた場合にも対応
  useEffect(() => {
    const idx = searchParams.get("index");
    if (idx !== null) {
      setIndex(Number(idx));
    }
  }, [searchParams]);

  const handleNext = () => {
    if (index < lines.length - 1) {
      setIndex(index + 1);
    } else {
      router.push("/welcome/choose-topic");
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const currentAnimation = index === 0 ? sleepJson : smileJson;
  const isFirstPage = index === 0;

  return (
    <div
      className={`relative w-full h-[100dvh] overflow-hidden touch-none ${isFirstPage ? "cursor-pointer" : ""}`}
      onClick={isFirstPage ? handleNext : undefined}
    >

      {/* セリフ部分 */}
      <div className="absolute left-0 top-[27%] w-full flex justify-center px-6 drop-shadow-white-glow">
        <Fade key={index}>
          <DialogueBox>{lines[index]}</DialogueBox>
        </Fade>
      </div>

      {/* ねむら ＋ ボタンエリア */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        style={{
          top: "50%",
          width: "95%",
          maxWidth: "400px"
        }}
      >
        {/* アニメーション本体コンテナ */}
        <div className="relative shrink-0" style={{ width: 280, height: 280 }}>

          {/* 指さしアイコン */}
          {isFirstPage && (
            <div className="absolute -right-0 -top-4 z-20 animate-bounce pointer-events-none" style={{ animationDuration: '2s' }}>
              <i
                className="fa-solid fa-mitten absolute right-[100px] top-[60px] -translate-y-1/2
                text-4xl text-white-soft animate-poke drop-shadow-white-glow drop-shadow-cyan-500/50"
              />
            </div>
          )}

          {index === 1 ? (
            <Fade>
              <LottiePlayer data={currentAnimation} width={280} height={280} />
            </Fade>
          ) : (
            <LottiePlayer data={currentAnimation} width={280} height={280} />
          )}
        </div>

        {/* ボタンエリア */}
        <div className="w-full mt-10 flex justify-between items-center px-2 min-h-[60px]">
          {isFirstPage ? (
            <div className="w-full">
              <p className="text-white-soft text-center text-[20px] font-bold animate-pulse drop-shadow-white-glow">
                タップして起こそう
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 flex justify-start">
                {index > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-4 py-2 rounded-full transition-all active:scale-95 drop-shadow-white-glow"
                  >
                    <ArrowRightIcon className="rotate-180 w-5 h-5" />
                    <span className="text-base font-medium">もどる</span>
                  </button>
                )}
              </div>

              <div className="flex-1 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow"
                >
                  <span className="text-base">次へ</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Background>
      <Suspense fallback={null}>
        <WelcomeContent />
      </Suspense>
    </Background>
  );
}