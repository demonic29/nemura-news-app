"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import DialogueBox from "@/components/DialogueBox";
import LottiePlayer from "@/components/LottiePlayer";
import Fade from "@/components/Fade";

import { ArrowRightIcon } from "@/app/assets/icons";

import smileJson from "@/app/assets/animations/smile-nemura.json";

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

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden touch-none">
      
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
        {/* アニメーション */}
        <div className="relative shrink-0 flex flex-col items-center" style={{ width: 280, height: 280 }}>
          <LottiePlayer data={smileJson} width={280} height={280} />

          {/* レッツゴー！ボタン */}
          {isLastPage && (
            <div className="absolute -top-20 z-30">
              <Fade>
                <button
                  onClick={() => router.push("/home")}
                  className="bg-[#FDE047] text-[#1D57A6] px-10 py-2 rounded-full font-bold text-[18px] shadow-[0_0_20px_rgba(253,224,71,0.6)] transition-all active:scale-95 animate-bounce whitespace-nowrap"
                >
                  レッツゴー！
                </button>
              </Fade>
            </div>
          )}
        </div>

        {/* ボタンエリア */}
        <div className="w-full mt-10 flex justify-between items-center px-2 min-h-[60px]">
          <div className="flex-1 flex justify-start">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-4 py-2 rounded-full transition-all active:scale-95 drop-shadow-white-glow"
            >
              <ArrowRightIcon className="rotate-180 w-5 h-5" />
              <span className="text-base font-medium">もどる</span>
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            {!isLastPage && (
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
        <ArigatouContent />
      </Suspense>
    </Background>
  );
}