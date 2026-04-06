// コントロールバー

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SleepTimerModal from "./SleepTimerModal"
import PlaybackSpeedModal from "./PlaybackSpeedModal"
import { OnexMobiledataIcon, BedtimeIcon, PlayListAddCheckIcon } from "@icons/index"

type Props = {
  playbackSpeed: string
  setPlaybackSpeed: React.Dispatch<React.SetStateAction<string>>
  sleepMinutes: number | 'track-end'
  setSleepMinutes: React.Dispatch<React.SetStateAction<number | 'track-end'>>
}

export default function ControlBar({ playbackSpeed, setPlaybackSpeed, sleepMinutes, setSleepMinutes }: Props) {
  const [sleepOpen, setSleepOpen] = useState(false)
  const [speedOpen, setSpeedOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative flex h-[60px] w-full items-center justify-between px-6 sm:px-10">

      {/* 再生速度 */}
      <div className="relative">
        <button
          onClick={() => setSpeedOpen(!speedOpen)}
          className="text-white-soft/80 hover:text-white transition-colors"
        >
          <OnexMobiledataIcon className="scale-[1.3] sm:scale-[1.5]" />
        </button>

        <div className="relative">
          <div
            onClick={() => setSpeedOpen(false)}
            className={`
              fixed inset-0 z-40
              transition-opacity duration-200
              ${speedOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          />
          <div
            className={`
              absolute bottom-full mb-12 z-50
              transition-all duration-200 ease-out
              ${speedOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
              left-[calc(50%-40px)]
            `}
          >
            <PlaybackSpeedModal
              selectedSpeed={playbackSpeed}
              setSelectedSpeed={setPlaybackSpeed}
              onCloseAction={() => setSpeedOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* スリープタイマー */}
      <div className="relative">
        <button
          onClick={() => setSleepOpen(!sleepOpen)}
          className="text-white-soft/80 hover:text-white transition-colors"
        >
          <BedtimeIcon className="scale-[1.15] sm:scale-[1.3]" />
        </button>

        <div className="relative">
          <div
            onClick={() => setSleepOpen(false)}
            className={`
              fixed inset-0 z-40
              transition-opacity duration-200
              ${sleepOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          />
          <div
            className={`
              absolute bottom-full mb-12 left-1/2 -translate-x-1/2 z-50
              transition-all duration-200 ease-out
              ${sleepOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
            `}
          >
            <SleepTimerModal
              onCloseAction={() => setSleepOpen(false)}
              onSelectTime={(minutes) => setSleepMinutes(minutes)}
            />
          </div>
        </div>
      </div>

      {/* プレイリスト・完了 */}
      <button
        onClick={() => router.push('/playlist')}
        className="text-white-soft/80 hover:text-white transition-colors"
      >
        <PlayListAddCheckIcon className="scale-[1.35] sm:scale-[1.6]" />
      </button>

    </div>
  )
}
