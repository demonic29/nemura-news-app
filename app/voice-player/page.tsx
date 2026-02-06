// voice-player

'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Wave from '@/assets/graphics/wave.svg'

// firebase
import { auth, db } from "@/app/lib/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

// supabase
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// components
import NavigationHeader from "@/components/NavigationHeader"
import NewsPlayer from "@/components/NewsPlayer"

type HatenaNews = {
  title: string
  description: string
  url?: string
  id: string
  className?: string
}

type AudioLoadingState = {
  [newsId: string]: 'idle' | 'loading' | 'ready' | 'error'
}

// Supabase types
type NewsAudioCache = {
  id: string
  news_id: string
  title: string
  description: string
  audio_url: string
  speaker: string
  created_at: string
  updated_at: string
}

export const VOICES = [
  { id: "electronic", label: "電子的な声", speaker: "54", word: "電子的な声です" },
  { id: "cool", label: "冷静な声", speaker: "47", word: "冷静な声" },
  { id: "child", label: "子どもの声", speaker: "42", word: "子どもの声" },
  { id: "low", label: "低音な声", speaker: "13", word: "低音な声" },
  { id: "warm", label: "あたたかい声", speaker: "24", word: "あたたかい声" },
]

const MAX_NEWS_ITEMS = 3

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Note: Initialize only on client side
let supabase: SupabaseClient | null = null

if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

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
  const [userId, setUserId] = useState<string | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)

  // NEW: Fetch all cached audio data from Supabase
  const fetchAllCachedAudio = async (): Promise<NewsAudioCache[]> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    try {
      const { data, error } = await supabase
        .from('news_audio_cache')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching cached audio:', error)
        return []
      }

      console.log('Fetched cached audio items:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('Error fetching all cached audio:', error)
      return []
    }
  }

  // NEW: Fetch cached audio by speaker
  const fetchCachedAudioBySpeaker = async (speaker: string): Promise<NewsAudioCache[]> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    try {
      const { data, error } = await supabase
        .from('news_audio_cache')
        .select('*')
        .eq('speaker', speaker)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching cached audio by speaker:', error)
        return []
      }

      console.log(`Fetched cached audio for speaker ${speaker}:`, data?.length || 0)
      return data || []
    } catch (error) {
      console.error('Error fetching cached audio by speaker:', error)
      return []
    }
  }

  // NEW: Fetch cached audio by news ID
  const fetchCachedAudioByNewsId = async (newsId: string): Promise<NewsAudioCache[]> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    try {
      const { data, error } = await supabase
        .from('news_audio_cache')
        .select('*')
        .eq('news_id', newsId)

      if (error) {
        console.error('Error fetching cached audio by news ID:', error)
        return []
      }

      console.log(`Fetched cached audio for news ${newsId}:`, data?.length || 0)
      return data || []
    } catch (error) {
      console.error('Error fetching cached audio by news ID:', error)
      return []
    }
  }

  // NEW: Delete old cache entries (optional - for cleanup)
  const deleteOldCacheEntries = async (daysOld: number = 7): Promise<number> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return 0
    }

    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { data, error } = await supabase
        .from('news_audio_cache')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select()

      if (error) {
        console.error('Error deleting old cache entries:', error)
        return 0
      }

      console.log(`Deleted ${data?.length || 0} old cache entries`)
      return data?.length || 0
    } catch (error) {
      console.error('Error deleting old cache entries:', error)
      return 0
    }
  }

  // Fetch user's voice preference from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)

        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            const userVoiceId = userData.aiVoice || userData.voice || userData.selectedVoice

            const matchedVoice = VOICES.find(voice => voice.id === userVoiceId)

            if (matchedVoice) {
              setSelectedVoice(matchedVoice.id)
              setSelectedSpeaker(matchedVoice.speaker)
              console.log("Voice loaded from Firebase:", matchedVoice.label)

              // NEW: Optionally fetch cached audio for this speaker
              // await fetchCachedAudioBySpeaker(matchedVoice.speaker)
            } else {
              console.warn("No matching voice found, using default")
              setSelectedVoice(VOICES[0].id)
              setSelectedSpeaker(VOICES[0].speaker)
            }
          } else {
            console.log("User document not found, using default voice")
            setSelectedVoice(VOICES[0].id)
            setSelectedSpeaker(VOICES[0].speaker)
          }
        } catch (err) {
          console.error("Error fetching user voice preference:", err)
          setSelectedVoice(VOICES[0].id)
          setSelectedSpeaker(VOICES[0].speaker)
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        setError("")

        const mockNews: HatenaNews[] = [
          {
            id: "1",
            title: "最新テクノロジーが世界を変える",
            description: "AI技術の発展により、日常生活が大きく変化しています。",
            url: "#"
          },
          {
            id: "2",
            title: "経済ニュース速報",
            description: "本日の株式市場は好調なスタートを切りました。",
            url: "#"
          },
          {
            id: "3",
            title: "気象情報",
            description: "週末は全国的に晴れる見込みです。",
            url: "#"
          },
          {
            id: "4",
            title: "スポーツニュース",
            description: "今シーズンの注目選手について解説します。",
            url: "#"
          },
          {
            id: "5",
            title: "文化・芸術情報",
            description: "新しい美術展が開催されます。",
            url: "#"
          }
        ]

        let newsData = mockNews

        try {
          const response = await fetch("/api/hatena?type=popular")
          if (response.ok) {
            const fetchedNews = await response.json()
            newsData = Array.isArray(fetchedNews)
              ? fetchedNews.slice(0, MAX_NEWS_ITEMS)
              : mockNews
          }
        } catch (e) {
          console.log("Using mock data:", e)
        }

        setNewsItems(newsData.slice(0, MAX_NEWS_ITEMS))

        // NEW: Optionally fetch all cached audio when component mounts
        // const cachedAudio = await fetchAllCachedAudio()
        // console.log('All cached audio:', cachedAudio)

      } catch (e) {
        console.error("Error fetching news:", e)
        setError("ニュースの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Check cache in Supabase for existing audio
  const checkAudioCache = async (
    newsId: string,
    title: string,
    description: string,
    speaker: string
  ): Promise<string | null> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    try {
      // Create a unique cache key based on content and speaker
      const cacheKey = `${newsId}_${speaker}_${hashString(title + description)}`

      const { data, error } = await supabase
        .from('news_audio_cache')
        .select('audio_url')
        .eq('id', cacheKey)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - cache miss
          console.log('Cache miss for:', cacheKey)
          return null
        }
        console.error('Error checking cache:', error)
        return null
      }

      console.log('Cache hit for:', cacheKey)
      return data.audio_url
    } catch (error) {
      console.error('Error checking audio cache:', error)
      return null
    }
  }

  // Store audio URL in Supabase cache
  const storeAudioInCache = async (
    newsId: string,
    title: string,
    description: string,
    speaker: string,
    audioUrl: string
  ): Promise<boolean> => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    try {
      const cacheKey = `${newsId}_${speaker}_${hashString(title + description)}`

      const { error } = await supabase
        .from('news_audio_cache')
        .upsert({
          id: cacheKey,
          news_id: newsId,
          title,
          description,
          audio_url: audioUrl,
          speaker,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error storing audio in cache:', error)
        return false
      }

      console.log('Audio stored in cache:', cacheKey)
      return true
    } catch (error) {
      console.error('Error storing audio in cache:', error)
      return false
    }
  }

  // Helper function to create hash of string
  const hashString = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  // Generate audio for current news item
  const getNewsId = (news: HatenaNews, index: number) => news.id || `idx-${index}`;



  // Pre-generate audio for next items in background
  useEffect(() => {
    if (newsItems.length === 0 || !selectedSpeaker) return

    const preloadIndices = [currentIndex + 1, currentIndex + 2].filter(
      i => i < newsItems.length
    )

    preloadIndices.forEach(index => {
      const news = newsItems[index]
      const newsId = getNewsId(news, index);

      if (!audioUrls[newsId] && audioLoadingStates[newsId] !== 'loading') {
        console.log('Pre-generating audio for:', newsId)
        generateAudioForNews(news, newsId, selectedSpeaker)
      }
    })
  }, [currentIndex, newsItems, selectedSpeaker, audioUrls, audioLoadingStates])

  const generateAudioForNews = async (
    news: HatenaNews,
    newsId: string,
    speaker: string
  ) => {
    setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'loading' }))

    try {
      // First, check cache
      const cachedAudioUrl = await checkAudioCache(
        newsId,
        news.title,
        news.description,
        speaker
      )

      if (cachedAudioUrl) {
        console.log('Using cached audio for', newsId)
        setAudioUrls(prev => ({ ...prev, [newsId]: cachedAudioUrl }))
        setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'ready' }))
        return
      }

      // If not in cache, generate new audio
      const response = await fetch("/api/pregenerate-news-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsId,
          title: news.title,
          description: news.description,
          speaker
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const data = await response.json()

      console.log('Audio generated for', newsId, ':', data.audioUrl)

      // Store in cache for future use
      await storeAudioInCache(
        newsId,
        news.title,
        news.description,
        speaker,
        data.audioUrl
      )

      setAudioUrls(prev => ({ ...prev, [newsId]: data.audioUrl }))
      setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'ready' }))
    } catch (error) {
      console.error(`Error generating audio for ${newsId}:`, error)
      setAudioLoadingStates(prev => ({ ...prev, [newsId]: 'error' }))
    }
  }

  useEffect(() => {
    if (newsItems.length === 0 || !selectedSpeaker) return;

    const currentNews = newsItems[currentIndex];
    const newsId = getNewsId(currentNews, currentIndex);

    if (audioUrls[newsId] || audioLoadingStates[newsId] === 'loading') {
      console.log('Audio already exists or loading for:', newsId)
      return
    }

    generateAudioForNews(currentNews, newsId, selectedSpeaker)
  }, [audioLoadingStates, audioUrls, currentIndex, generateAudioForNews, newsItems, selectedSpeaker])

  // auto-play
  const [isPlaying, setIsPlaying] = useState(false);
  const handleNext = () => {
    if (currentIndex < newsItems.length - 1) {
      setIsPlaying(false); // stop old audio first
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true); // request autoplay for next
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      console.log('Moving to previous:', currentIndex - 1)
      setCurrentIndex(i => i - 1)
    }
  }

  useEffect(() => {
    const newsId = newsItems[currentIndex]?.id;
    if (!newsId) return;

    if (audioUrls[newsId] && audioLoadingStates[newsId] === 'ready') {
      setIsPlaying(true);
    }
  }, [currentIndex, audioUrls, audioLoadingStates, newsItems]);

  const calculateDuration = (title: string, description: string) => {
    const totalText = `${title}${description}`
    const wordCount = totalText.length / 3
    const minutes = wordCount / 110
    return Math.ceil(minutes * 60)
  }

  if (loading) {
    return <FullScreen message="ニュースを読み込み中..." />
  }

  if (error) {
    return <FullScreen message={error} error />
  }

  if (newsItems.length === 0) {
    return <FullScreen message="ニュースが見つかりませんでした" />
  }

  if (!selectedVoice || !selectedSpeaker) {
    return <FullScreen message="音声設定を読み込み中..." />
  }

  const currentNews = newsItems[currentIndex]
  const newsId = getNewsId(currentNews, currentIndex);
  const audioUrl = audioUrls[newsId] || null
  const audioState = audioLoadingStates[newsId] || 'idle'

  console.log('Rendering - Current:', currentIndex, 'NewsID:', newsId, 'AudioURL:', audioUrl)

  // Show loading screen while generating audio for current item
  if (audioState === 'loading' && !audioUrl) {
    return (
      <main
        className="h-screen w-full relative flex flex-col overflow-hidden pt-[54px]"
        style={{ backgroundImage: 'linear-gradient(to bottom, #00040a, #003569, #004E9A)' }}
      >
        <NavigationHeader className="px-6" />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <LoadingSpinner />
            </div>
            <p className="text-white text-xl">音声を生成中...</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
          <Wave className="w-full h-auto" />
        </div>
      </main>
    )
  }

  // Show error state
  if (audioState === 'error') {
    return (
      <main
        className="h-screen w-full relative flex flex-col overflow-hidden pt-[54px]"
        style={{ backgroundImage: 'linear-gradient(to bottom, #00040a, #003569, #004E9A)' }}
      >
        <NavigationHeader className="px-6" />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-300 text-xl mb-4">音声の生成に失敗しました</p>
            <button
              onClick={() => generateAudioForNews(currentNews, newsId, selectedSpeaker)}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              再試行
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
          <Wave className="w-full h-auto" />
        </div>
      </main>
    )
  }

  return (
    <main
      className="h-screen w-full relative flex flex-col overflow-hidden pt-[54px]"
      style={{ backgroundImage: 'linear-gradient(to bottom, #00040a, #003569, #004E9A)' }}
    >
      <NavigationHeader />

      <div className="flex-1 relative z-10 pb-[36px]">
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
            newsId: newsId
          }}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={currentIndex < newsItems.length - 1}
          hasPrev={currentIndex > 0}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
        <Wave className="w-full h-auto" />
      </div>
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

function LoadingSpinner() {
  return (
    <div className="inline-block">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )
}