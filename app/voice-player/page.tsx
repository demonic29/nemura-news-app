'use client'

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Wave from '@/assets/graphics/wave.svg'
import waitVoice from '@/public/wait-voice.png'

// firebase
import { auth, db } from "@/app/lib/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

// components
import NavigationHeader from "@/components/NavigationHeader"
import NewsPlayer from "@/components/NewsPlayer"

// voices
import { VOICES } from "@/app/lib/voices"
import Image from "next/image"

type HatenaNews = {
  title: string
  description: string
  url?: string
  id: string
}

type AudioLoadingState = {
  [newsId: string]: 'idle' | 'loading' | 'ready' | 'error'
}

const MAX_NEWS_ITEMS = 3

export default function Page() {
  const router = useRouter()

  const [newsItems, setNewsItems] = useState<HatenaNews[]>([])
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})
  const [audioLoadingStates, setAudioLoadingStates] = useState<AudioLoadingState>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getNewsId = useCallback(
    (news: HatenaNews, index: number) => news.id || `idx-${index}`,
    []
  )

  // 🔥 Generate Audio (API handles caching)
  const generateAudioForNews = useCallback(async (
    news: HatenaNews,
    newsId: string,
    speaker: string
  ) => {
    setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'loading' }))

    try {
      const safeTitle = news.title?.trim() || "この記事にはタイトルがありません"
      const safeDescription = news.description?.trim() || "詳細情報がありません"

      if (!safeTitle && !safeDescription) {
        throw new Error("No valid content to generate audio")
      }

      const response = await fetch("/api/pregenerate-news-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsId,
          title: safeTitle,
          description: safeDescription,
          speaker
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate audio")
      }

      const data = await response.json()

      if (!data.audioUrl) {
        throw new Error("No audio URL returned")
      }

      setAudioUrls(prev => ({ ...prev, [newsId]: data.audioUrl }))
      setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'ready' }))

    } catch (error) {
      console.error(`Audio generation error for ${newsId}:`, error)
      setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'error' }))
    }
  }, [])

  // 🔥 Fetch user voice from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        const userVoiceId =
          userDoc.data()?.aiVoice ||
          userDoc.data()?.voice ||
          userDoc.data()?.selectedVoice

        const matchedVoice = VOICES.find(v => v.id === userVoiceId)

        if (matchedVoice) {
          setSelectedVoice(matchedVoice.id)
          setSelectedSpeaker(matchedVoice.speaker)
        } else {
          setSelectedVoice(VOICES[0].id)
          setSelectedSpeaker(VOICES[0].speaker)
        }
      } catch (err) {
        console.error("Voice fetch error:", err)
        setSelectedVoice(VOICES[0].id)
        setSelectedSpeaker(VOICES[0].speaker)
      }
    })

    return () => unsubscribe()
  }, [router])

  // 🔥 Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch("/api/hatena?type=popular")

        if (!response.ok) throw new Error()

        const data = await response.json()

        const newsData = Array.isArray(data)
          ? data.slice(0, MAX_NEWS_ITEMS)
          : []

        setNewsItems(newsData)
      } catch (e) {
        console.error("News fetch error:", e)
        setError("ニュースの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // 🔥 Generate current item audio
  useEffect(() => {
    if (!selectedSpeaker || newsItems.length === 0) return

    const currentNews = newsItems[currentIndex]
    const newsId = getNewsId(currentNews, currentIndex)

    if (audioUrls[newsId] || audioLoadingStates[newsId] === 'loading') return

    generateAudioForNews(currentNews, newsId, selectedSpeaker)
  }, [
    currentIndex,
    newsItems,
    selectedSpeaker,
    audioUrls,
    audioLoadingStates,
    generateAudioForNews,
    getNewsId
  ])

  // 🔥 Preload next items
  useEffect(() => {
    if (!selectedSpeaker || newsItems.length === 0) return

    const preload = [currentIndex + 1, currentIndex + 2]
      .filter(i => i < newsItems.length)

    preload.forEach(index => {
      const news = newsItems[index]
      const newsId = getNewsId(news, index)

      if (!audioUrls[newsId] && audioLoadingStates[newsId] !== 'loading') {
        generateAudioForNews(news, newsId, selectedSpeaker)
      }
    })
  }, [
    currentIndex,
    newsItems,
    selectedSpeaker,
    audioUrls,
    audioLoadingStates,
    generateAudioForNews,
    getNewsId
  ])

  // 🔥 Auto play when ready
  useEffect(() => {
    const newsId = newsItems[currentIndex]?.id
    if (!newsId) return

    if (audioUrls[newsId] && audioLoadingStates[newsId] === 'ready') {
      setIsPlaying(true)
    }
  }, [currentIndex, audioUrls, audioLoadingStates, newsItems])

  const handleNext = () => {
    if (currentIndex < newsItems.length - 1) {
      setCurrentIndex(i => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
    }
  }

  const calculateDuration = (title: string, description: string) => {
    const total = `${title}${description}`
    return Math.ceil((total.length / 3 / 110) * 60)
  }

  if (loading) return <FullScreen message="ニュースを読み込み中..." />
  if (error) return <FullScreen message={error} error />
  if (!selectedSpeaker) return <FullScreen message="音声設定を読み込み中..." />
  if (newsItems.length === 0)
    return <FullScreen message="ニュースが見つかりませんでした" />

  const currentNews = newsItems[currentIndex]
  const newsId = getNewsId(currentNews, currentIndex)
  const audioUrl = audioUrls[newsId] || null
  const audioState = audioLoadingStates[newsId] || 'idle'

  return (
    <main className="h-[100dvh] overflow-hidden flex flex-col pt-[40px] bg-gradient-to-b from-[#00040a] via-[#003569] to-[#004E9A]">
      <NavigationHeader />

      <div className="flex-1 z-10">
        {
          audioState === 'loading' ? (
            <div className="flex flex-col items-center justify-center mt-40">
              <Image
                src={waitVoice}
                alt="音声生成中"
                width={200}
                height={200}
                className="animate-pulse"
                priority
              />
              <p className="text-white mt-8">音声を生成中...</p>
            </div>
          ) : (
            <NewsPlayer
              key={newsId}
              showNemura
              audioUrl={audioUrl}
              item={{
                title: currentNews.title,
                body: currentNews.description,
                estimatedDuration: calculateDuration(
                  currentNews.title,
                  currentNews.description
                ),
                newsId
              }}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={currentIndex < newsItems.length - 1}
              hasPrev={currentIndex > 0}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )
        }

      </div>

      <Wave className="absolute bottom-0 w-full pointer-events-none" />
    </main>
  )
}

function FullScreen({ message, error }: { message: string; error?: boolean }) {
  return (
    <main className="h-screen flex items-center justify-center text-xl text-white bg-gradient-to-b from-[#00040a] via-[#003569] to-[#004E9A]">
      <span className={error ? "text-red-300" : ""}>{message}</span>
    </main>
  )
}
