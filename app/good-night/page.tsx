'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Background from "@/components/Background"
import NavigationHeader from "@/components/NavigationHeader"
import Logo from '@/assets/graphics/logo.svg'
import Link from "next/link"
import { ArrowRightIcon } from "@/assets/icons"

export default function GoodNightPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [ended, setEnded] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 🌑 Darkness level (0 → 1)
  const [darkness, setDarkness] = useState(0)

  // 🎭 Curtain state
  const [curtainDown, setCurtainDown] = useState(false)

  // 🕒 Real-time clock
  const [now, setNow] = useState(new Date())

  // Fade-in mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  // 🎵 Audio Control + Fade Logic
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 1
    audio.play().catch(() => { })

    const onLoaded = () => setDuration(audio.duration)

    const onTimeUpdate = () => {
      const current = audio.currentTime
      setCurrentTime(current)

      const remaining = audio.duration - current

      // Start fade 5 seconds before end
      if (remaining <= 5 && remaining > 0) {
        const progress = remaining / 5
        audio.volume = progress
        setDarkness(1 - progress)
      }
    }

    const onEnded = () => {
      setEnded(true)

      // Drop curtain after slight pause
      setTimeout(() => {
        setCurtainDown(true)
      }, 800)
    }

    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
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
          ${mounted ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Header */}
        <div className="h-[54px] shrink-0">
          <NavigationHeader />
        </div>

        {/* 🌙 Main Content */}
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

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white-soft/70 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 🕒 Clock */}
            <div className="text-white-soft/70 text-3xl font-bold tracking-widest pt-6">
              {formattedTime}
            </div>
          </div>
        )}

        {/* 🌑 Darkness overlay */}
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundColor: "black",
            opacity: darkness,
          }}
        />

        {/* 🎭 Curtain from top */}
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1B2A] transition-transform duration-[2000ms] ease-in-out"
          style={{
            transform: curtainDown ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          {curtainDown && (
            <div className="bg-[url('/bg2.png')] bg-cover bg-center w-full h-full flex flex-col items-center justify-center gap-6">
              <Logo className="animate-pulse opacity-80" />

              <div className="text-white-soft text-3xl font-bold tracking-widest mt-[40px]">
                {formattedTime}
              </div>

              {/* <Link href="/" className="">
                <div className="bg-blue-900 text-white-soft/70  backdrop-blur-sm rounded-xl px-6 py-2">
                   ホームに戻る 
                </div>
              </Link> */}
            </div>
          )}


        </div>



        {/* 🎵 BGM */}
        <audio
          ref={audioRef}
          src="/nemura-sleep-time.mp3"
          preload="auto"
        />
      </main>
    </Background>
  )
}
