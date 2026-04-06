'use client'

import React from 'react'
import {
  Forward10Icon,
  Replay10Icon,
  SkipNextIcon,
} from "@icons/index"
import PauseVoiceRing from '@/assets/graphics/pause-voice-ring.svg'
import PlayVoiceRing from '@/assets/graphics/play-voice-ring.svg'

interface PlaybackControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onRewind: () => void;
  onForward: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function PlaybackControls({ 
  isPlaying, 
  onToggle, 
  onRewind, 
  onForward,
  onNext,
  onPrev
}: PlaybackControlsProps) {
  return (
    <div className="flex w-full flex-col items-center px-4 sm:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        
        {/* 10秒戻る */}
        <button 
          onClick={onRewind}
          className="text-white-soft opacity-80 hover:opacity-100 transition-all active:scale-90"
        >
          <Replay10Icon className="scale-[1.1] sm:scale-[1.3]" />
        </button>

        {/* 前へ */}
        <button 
          onClick={onPrev}
          className="text-white-soft opacity-90 hover:opacity-100 transition-all active:scale-90 rotate-180"
        >
          <SkipNextIcon className="scale-[1.5] sm:scale-[2.0]" />
        </button>

        {/* 再生・一時停止 */}
        <button 
          className="relative h-24 w-24 items-center justify-center transition-all active:scale-95"
          onClick={onToggle}
        >
          <div className="absolute inset-0 pointer-events-none">
            {isPlaying ? (
              <PauseVoiceRing className="h-24 w-24" />
            ) : (
              <PlayVoiceRing className="h-24 w-24" />
            )}
          </div>
        </button>

        {/* 次へ */}
        <button 
          onClick={onNext}
          className="text-white-soft opacity-90 hover:opacity-100 transition-all active:scale-90"
        >
          <SkipNextIcon className="scale-[1.5] sm:scale-[2.0]" />
        </button>

        {/* 10秒進む */}
        <button 
          onClick={onForward}
          className="text-white-soft opacity-80 hover:opacity-100 transition-all active:scale-90"
        >
          <Forward10Icon className="scale-[1.1] sm:scale-[1.3]" />
        </button>
      </div>
    </div>
  )
}
