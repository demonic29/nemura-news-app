"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/Background";
import DialogueBox from "@/components/DialogueBox";
import LottiePlayer from "@/components/LottiePlayer";
import Fade from "@/components/Fade";

import sleepJson from "@/assets/animations/sleep-nemura.json";
import smileJson from "@/assets/animations/smile-nemura.json";

export default function Page() {
  const router = useRouter();

  const lines = [
    <>Zzz...</>,
    <>!!!</>,
    <>
    はじめまして...!<br />
    僕の名前は <span className="text-yellow-300">ねむら</span>
    </>,
    <>
      この世界は<br /><span className="text-yellow-300">Nemura</span><br />
      って言うんだ!
    </>,
    <>ここでは今日<br />なにが起こったかが<br />簡単に分かるよ!</>,
    <>まずはじめに<br />気になる話題をえらんでね</>
  ];

  const [index, setIndex] = useState(0);

  const handleClick = () => {
    if (index < lines.length - 1) {
      setIndex(index + 1);
    } else {
      router.push("/ai-summary");
    }
  };

  const currentAnimation = index === 0 ? sleepJson : smileJson;

  const fadeAll = index === 1;

  return (
    <Background>
      <div
        className="relative w-full min-h-screen"
        onClick={handleClick}
      >

        <div className="absolute left-0 top-[20%] w-full flex justify-center px-6">
          {fadeAll ? (
            <DialogueBox>{lines[index]}</DialogueBox>
          ) : (
            <Fade key={index}>
              <DialogueBox>{lines[index]}</DialogueBox>
            </Fade>
          )}
        </div>

        {/* アニメーション部分 */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{
            bottom: "25%",
            width: 300,
            height: 300,
          }}
        >
          {/* 最初のクリック */}
          {fadeAll ? (
            <Fade>
              <LottiePlayer data={currentAnimation} width={280} height={280} />
            </Fade>
          ) : (
            <LottiePlayer data={currentAnimation} width={280} height={280} />
          )}

          {index === 0 && (
            <p className="text-white text-center mt-4 text-shadow-white text-lg">
              クリックして起こそう
            </p>
          )}
        </div>

      </div>
    </Background>
  );
}