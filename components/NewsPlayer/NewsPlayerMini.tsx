// components/NewsPlayer/NewsPlayerMini.tsx
'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import NewsHeader from "./NewsHeader"
import AudioSeekBar from "./AudioSeekBar"
import PlaybackControls from "./PlaybackControls"
import { useVoicePlayer } from "@/context/VoicePlayerContext"

type Props = {
  isOpen: boolean
}

export default function NewsPlayerMini({ isOpen }: Props) {
  const { playing, currentItem } = useVoicePlayer()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState('1X')
  const [sleepMinutes, setSleepMinutes] = useState<number | 'track-end'>('track-end')
  const [isPlaying, setIsPlaying] = useState(false)

  // 同期：context の再生状態
  useEffect(() => {
    setIsPlaying(playing)
  }, [playing])

  // 再生タイマー（簡易版）
  useEffect(() => {
    if (!isPlaying) return
    const numericSpeed = playbackSpeed === '1X' ? 1 : parseFloat(playbackSpeed)
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        if (!currentItem) return prev
        const next = prev + 1 * numericSpeed
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed, currentItem])

  if (!currentItem) return null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[100]
        transition-transform duration-500 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="w-full max-w-[430px] mx-auto h-[215px]
        bg-gradient-to-b from-black to-[#003566]
        rounded-t-[40px] p-4 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col"
      >
        {/* タイトル */}
        <div className="px-4 mb-2">
          <NewsHeader title={currentItem.title} />
        </div>

        {/* シークバー */}
        <div className="px-4 mb-2">
          <AudioSeekBar
            duration={180}
            current={currentTime}
            onSeek={setCurrentTime}
          />
        </div>

        {/* 再生コントロール */}
        <PlaybackControls
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(!isPlaying)}
          onRewind={() => setCurrentTime(prev => Math.max(prev - 10, 0))}
          onForward={() => setCurrentTime(prev => prev + 10)}
        />

      </div>
    </div>
  )
}