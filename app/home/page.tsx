'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import sleepData from "@/assets/animations/sleep-nemura.json";
import sleepImage from "@/assets/animations/sleep-click-nemura.png";
import Background from "@/components/Background";

export default function Home() {
  const [showPng, setShowPng] = useState(false);
  const [showText, setShowText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 3秒後に PNG 切り替え + セリフ表示
    const t1 = setTimeout(() => {
      setShowPng(true);
      setShowText(true);
    }, 3000);

    // 10秒後にリダイレクト
    const t2 = setTimeout(() => {
      router.push("/ai-summary");
    }, 13000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router]);

  return (
    <Background>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 flex flex-col items-center">
        {showText && (
          <p className="mb-3 text-white text-xl leading-6 opacity-0 animate-fadeIn">
            今日もおつかれさま
            <br />
            さっそく今日の世界を見てみる？
          </p>
        )}

        {/* 共通のコンテナでサイズを統一 */}
        <div style={{ width: 300, height: 300, position: "relative" }}>
          {showPng ? (
            <Image
              src={sleepImage}
              alt="sleep"
              fill
              style={{ objectFit: "contain", pointerEvents: "none" }}
            />
          ) : (
            <Player
              autoplay
              loop
              src={sleepData}
              style={{ width: "100%", height: "100%", pointerEvents: "none" }}
            />
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 2s forwards;
          }
        `}</style>
      </div>
    </Background>
  );
}