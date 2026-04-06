'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

// components
import SpeechNemura from "./SpeechNemura"
import NewsHeader from "./NewsHeader"
import AudioSeekBar from "./AudioSeekBar"
import NewsBody from "./NewsBody"
import ControlBar from "./ControlBar"
import PlaybackControls from "./PlaybackControls"

export type VoiceItem = {
  title: string
  body?: string
  imageUrl?: string
  estimatedDuration?: number
  newsId?: string
}

export type NewsPlayerProps = {
  item: VoiceItem
  audioUrl: string | null
  isPlaying: boolean
  setIsPlaying: (v: boolean) => void
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
  showNemura?: boolean
}

export default function NewsPlayer({
  item,
  audioUrl,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  showNemura = false
}: NewsPlayerProps) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [actualDuration, setActualDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState('1X')

  // ✅ PLAY / PAUSE (SINGLE SOURCE OF TRUTH)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    if (isPlaying) {
      audio.play().catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Play failed:', err)
          setIsPlaying(false)
        }
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audioUrl, setIsPlaying])

  // ✅ Playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate =
        playbackSpeed === '1X'
          ? 1
          : parseFloat(playbackSpeed.replace('X', ''))
    }
  }, [playbackSpeed])

  // ✅ CLEANUP ON UNMOUNT
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [])

  useEffect(() => {
    setActualDuration(0)
    setCurrentTime(0)
  }, [audioUrl])

  // Sleep timer
  const [sleepMinutes, setSleepMinutes] = useState<number | 'track-end'>('track-end')
  useEffect(() => {
    let sleepTimer: NodeJS.Timeout | undefined

    const audio = audioRef.current
    if (!audio) return

    // ⏰ Fixed-minute sleep timer
    if (isPlaying && typeof sleepMinutes === 'number') {
      sleepTimer = setTimeout(() => {
        setIsPlaying(false)
        audio.pause()
        router.push('/good-night')
      }, sleepMinutes * 60 * 1000)
    }

    // 🎵 Track-end sleep timer
    return () => {
      if (sleepTimer) clearTimeout(sleepTimer)
    }
  }, [isPlaying, sleepMinutes, router, setIsPlaying])

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[30rem] flex-col pb-4">

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        key={item.newsId}
        src={audioUrl || ''}
        preload="auto"
        crossOrigin="anonymous"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setActualDuration(audioRef.current.duration || 0)
          }
        }}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => {
          if (sleepMinutes === 'track-end') {
            if (hasNext) {
              onNext?.();
            } else {
              setIsPlaying(false);
              router.push('/good-night');
            }
          } else {
            if (hasNext) {
              onNext?.();
            }
          }
        }}
      />

      {/* 上：固定 */}
      <div className="shrink-0 space-y-3 pb-6 sm:space-y-4 sm:pb-8">
        {showNemura && <SpeechNemura isPlaying={isPlaying && !!audioUrl} />}
        <div className="px-4 sm:px-6">
          <NewsHeader title={item.title} />
        </div>
        <div className="px-4 sm:px-6">
          <AudioSeekBar
            duration={actualDuration}
            current={currentTime}
            onSeek={(time) => {
              if (audioRef.current) audioRef.current.currentTime = time
            }}
          />
        </div>
      </div>

      {/* 本文：レスポンシブ＋スクロール */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {
          audioUrl ? (
            <NewsBody body={item.body || '詳細はありません'} />
          ) :
            <div className="text-white/60 text-center">
              音声を準備中...
            </div>
        }
      </div>

      {/* 下：固定 */}
      <div className="shrink-0 flex flex-col">
        <PlaybackControls
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(!isPlaying)}
          onNext={hasNext ? onNext : undefined}
          onPrev={hasPrev ? onPrev : undefined}
          onRewind={() => { if (audioRef.current) audioRef.current.currentTime -= 10 }}
          onForward={() => { if (audioRef.current) audioRef.current.currentTime += 10 }}
        />
        <div className="pt-4 sm:pt-[16px]">
          <ControlBar
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            sleepMinutes={sleepMinutes}
            setSleepMinutes={setSleepMinutes}
          />
        </div>
      </div>
    </div>
  )
}
