'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Background from "@/components/Background"
import NavigationHeader from "@/components/NavigationHeader"
import Logo from '@/assets/graphics/logo.svg'

export default function GoodNightPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [ended, setEnded] = useState(false)
  const [mounted, setMounted] = useState(false)

  // フェードイン用
  useEffect(() => {
    setMounted(true)
  }, [])

  // BGM 制御
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.play().catch(() => {})

    const onLoaded = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setEnded(true)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  return (
    <Background variant="night">
      <main
        className={`
          h-[100svh] w-full relative flex flex-col overflow-hidden pt-[54px]
          transition-opacity duration-1000 ease-out
          ${mounted ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Header */}
        <div className="h-[54px] shrink-0">
          <NavigationHeader />
        </div>

        {/* 再生中 */}
        {!ended && (
          <div className="flex-1 flex flex-col items-center justify-start pt-36 gap-4">
            <Image
              src="/good-night-nemura.png"
              alt="good night"
              width={160}
              height={160}
              priority
              className="opacity-90"
            />

            <div className="text-center space-y-1 text-white-soft/80">
              <p className="text-lg tracking-wide">おやすみなさい</p>
              <p className="text-sm text-white-soft/50 pb-2">よい眠りを</p>
            </div>

            {/* 再生進捗バー */}
            <div className="w-48 h-[2px] bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white-soft/70 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* BGM */}
        <audio
          ref={audioRef}
          src="/hoshi-no-yurikago.mp3"
          preload="auto"
        />

        {/* 再生終了後オーバーレイ */}
        {ended && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]">
            <Logo
              width={160}
              height={160}
              className="opacity-90"
            />
          </div>
        )}
      </main>
    </Background>
  )
}