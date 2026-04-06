"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import DialogueBox from "@/components/DialogueBox";
import LottiePlayer from "@/components/LottiePlayer";
import Fade from "@/components/Fade";

import { ArrowRightIcon } from "@/assets/icons";

import smileJson from "@/assets/animations/smile-nemura.json";

function ArigatouContent() {
  const router = useRouter();

  const lines = [
    <>なるほどなるほど</>,
    <>あなたが知りたそうな<br />ニュースがあつまって<br />きましたよ</>,
    <>さっそくみてみましょう！</>,
  ];

  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < lines.length - 1) {
      setIndex(index + 1);
    } else {
      router.push("/home");
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      setIndex(index - 1);
    } else {
      router.push("/welcome/choose-voice");
    }
  };

  const isLastPage = index === lines.length - 1;
  const animationSize = "clamp(14rem, 68vw, 20rem)";

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden px-4 pb-8 pt-[8vh] touch-none sm:px-6 sm:pb-10 sm:pt-[10vh]">
      <div className="mx-auto flex w-full max-w-[28rem] flex-1 flex-col items-center">
        {/* セリフ部分 */}
        <div className="w-full drop-shadow-white-glow">
          <Fade key={index}>
            <DialogueBox>{lines[index]}</DialogueBox>
          </Fade>
        </div>

        {/* ねむら ＋ ボタンエリア */}
        <div className="mt-6 flex flex-1 w-full flex-col items-center justify-center sm:mt-8">
          {/* アニメーション */}
          <div className="relative shrink-0 flex flex-col items-center">
            <LottiePlayer data={smileJson} width={animationSize} height={animationSize} />

            {/* レッツゴー！ボタン */}
            {isLastPage && (
              <div className="absolute -top-12 z-30 sm:-top-16">
                <Fade>
                  <button
                    onClick={() => router.push("/home")}
                    className="animate-bounce whitespace-nowrap rounded-full bg-[#FDE047] px-7 py-2 text-base font-bold text-[#1D57A6] shadow-[0_0_20px_rgba(253,224,71,0.6)] transition-all active:scale-95 sm:px-10 sm:text-[18px]"
                  >
                    レッツゴー！
                  </button>
                </Fade>
              </div>
            )}
          </div>

          {/* ボタンエリア */}
          <div className="mt-6 flex min-h-[60px] w-full items-center justify-between gap-3 px-2 sm:mt-8">
            <div className="flex flex-1 justify-start">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 rounded-full border border-white/0 bg-button px-4 py-2 text-white-soft transition-all active:scale-95 drop-shadow-white-glow backdrop-blur-md"
              >
                <ArrowRightIcon className="h-5 w-5 rotate-180" />
                <span className="text-sm font-medium sm:text-base">もどる</span>
              </button>
            </div>

            <div className="flex flex-1 justify-end">
              {!isLastPage && (
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
              )}
            </div>
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
        <ArigatouContent />
      </Suspense>
    </Background>
  );
}
