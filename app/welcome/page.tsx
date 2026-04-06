"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Background from "@/components/Background";
import DialogueBox from "@/components/DialogueBox";
import LottiePlayer from "@/components/LottiePlayer";
import Fade from "@/components/Fade";

import sleepJson from "@/assets/animations/sleep-nemura.json";
import smileJson from "@/assets/animations/smile-nemura.json";
import { ArrowRightIcon } from "@icons/index";

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
  const animationSize = "clamp(14rem, 68vw, 20rem)";

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden px-4 pb-8 pt-[8vh] touch-none sm:px-6 sm:pb-10 sm:pt-[10vh] ${
        isFirstPage ? "cursor-pointer" : ""
      }`}
      onClick={isFirstPage ? handleNext : undefined}
    >
      <div className="mx-auto flex w-full max-w-[28rem] flex-1 flex-col items-center">
        {/* セリフ部分 */}
        <div className="w-full drop-shadow-white-glow">
          <Fade key={index}>
            <DialogueBox>{lines[index]}</DialogueBox>
          </Fade>
        </div>

        {/* ねむら */}
        <div className="mt-6 flex flex-1 w-full flex-col items-center justify-center sm:mt-8">
          <div className="relative shrink-0">
            {/* 指さしアイコン */}
            {isFirstPage && (
              <div
                className="pointer-events-none absolute right-[8%] top-[20%] z-20 animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                <i
                  className="fa-solid fa-mitten -translate-y-1/2 text-[clamp(1.75rem,8vw,2.5rem)] text-white-soft animate-poke drop-shadow-white-glow drop-shadow-cyan-500/50"
                />
              </div>
            )}

            {index === 1 ? (
              <Fade>
                <LottiePlayer
                  data={currentAnimation}
                  width={animationSize}
                  height={animationSize}
                />
              </Fade>
            ) : (
              <LottiePlayer
                data={currentAnimation}
                width={animationSize}
                height={animationSize}
              />
            )}
          </div>

          {/* ボタンエリア */}
          <div className="mt-6 flex min-h-[60px] w-full items-center justify-between gap-3 px-2 sm:mt-8">
            {isFirstPage ? (
              <div className="w-full">
                <p className="text-white-soft text-center text-lg font-bold animate-pulse drop-shadow-white-glow sm:text-xl">
                  タップして起こそう
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-1 justify-start">
                  {index > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1 rounded-full border border-white/0 bg-button px-4 py-2 text-white-soft transition-all active:scale-95 drop-shadow-white-glow backdrop-blur-md"
                    >
                      <ArrowRightIcon className="h-5 w-5 rotate-180" />
                      <span className="text-sm font-medium sm:text-base">もどる</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-1 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="flex items-center gap-1 rounded-full border border-white/0 bg-button px-5 py-2.5 font-bold text-white-soft transition-all active:scale-95 drop-shadow-white-glow backdrop-blur-md sm:px-6"
                  >
                    <span className="text-sm sm:text-base">次へ</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
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
