// voice-player

'use client'

import React from "react"
import NavigationHeader from "@/components/NavigationHeader"
import NewsPlayer from "@/components/NewsPlayer"
import Wave from '@/assets/graphics/wave.svg'
import { useVoicePlayer } from '@/context/VoicePlayerContext'
import BottomNavigationBar from "@/components/BottomNavigationBar";

export default function Page() {
  const { currentItem } = useVoicePlayer()

  return (
    <main
      className="h-screen w-full relative flex flex-col overflow-hidden pt-[54px]"
      style={{ backgroundImage: 'linear-gradient(to bottom, #00040a, #003569, #004E9A)' }}
    >
      {/* ヘッダー */}
      <div className="h-[54px] shrink-0">
        <NavigationHeader />
      </div>

      {/* ナビバー */}
      <BottomNavigationBar />

      {/* ニュースプレイヤー */}
      <div className="flex-1 relative z-10 pb-[36px]">
        {currentItem ? (
          <NewsPlayer
          showNemura
          item={currentItem}
        />
        ) : (
          <p className="text-white/70 p-6">再生するニュースがありません</p>
        )}
      </div>

      {/* 波グラフィック */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <Wave className="w-full h-auto" />
      </div>
    </main>
  )
}