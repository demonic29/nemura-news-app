'use client'

import Wave from '@/assets/graphics/wave.svg'

// componentsg
import NavigationHeader from "@/components/NavigationHeader"
import NewsPlayer from "@/components/NewsPlayer"

import AudioGenerationState from "@/app/voice-player/components/AudioGenerationState"
import NotificationToast from "@/app/voice-player/components/NotificationToast"
import { useHatenaNews } from "@/app/voice-player/hooks/useHatenaNews"
import { useNewsAudio } from "@/app/voice-player/hooks/useNewsAudio"
import { useCurrentUserVoice } from "@/app/lib/useCurrentUserVoice"

const MAX_NEWS_ITEMS = 3

export default function VoicePlayerPage() {
  const { loading: voiceLoading, selectedSpeaker } = useCurrentUserVoice()
  const { error, loading: newsLoading, newsItems } = useHatenaNews(
    "popular",
    MAX_NEWS_ITEMS,
  )
  const {
    currentAudioState,
    currentAudioUrl,
    currentItem,
    handleNext,
    handlePrev,
    hasNext,
    hasPrev,
    isPlaying,
    notification,
    setIsPlaying,
  } = useNewsAudio(newsItems, selectedSpeaker)

  if (newsLoading) return <FullScreen message="ニュースを読み込み中..." />
  if (error) return <FullScreen message={error} error />
  if (voiceLoading) return <FullScreen message="音声設定を読み込み中..." />
  if (!currentItem) return <FullScreen message="ニュースが見つかりませんでした" />

  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-gradient-to-b from-[#00040a] via-[#003569] to-[#004E9A] pb-4 pt-2s">
      <div className="mx-auto flex w-full max-w-[30rem] flex-1 flex-col">
        <NavigationHeader className="px-0" />

        <NotificationToast
          message={notification.message}
          visible={notification.visible}
        />

        <div className="relative z-10 flex-1">
          {currentAudioState === 'loading' ? (
            <AudioGenerationState />
          ) : (
            <NewsPlayer
              key={currentItem.newsId}
              showNemura
              audioUrl={currentAudioUrl}
              item={currentItem}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={hasNext}
              hasPrev={hasPrev}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
        </div>
      </div>

      <Wave className="absolute bottom-0 w-full pointer-events-none" />
    </main>
  )
}

function FullScreen({ message, error }: { message: string; error?: boolean }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-b from-[#00040a] via-[#003569] to-[#004E9A] px-6 text-center text-lg text-white sm:text-xl">
      <span className={error ? "text-red-300" : ""}>{message}</span>
    </main>
  )
}
