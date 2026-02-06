// context/VoicePlayerContext.tsx
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type VoiceItem = {
  title: string
  body?: string
  imageUrl?: string
  estimatedDuration?: number
}

type VoicePlayerContextType = {
  currentItem: VoiceItem | null
  setCurrentItem: (item: VoiceItem | null) => void
  newsItems: VoiceItem[]
  setNewsItems: (items: VoiceItem[]) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void
  playing: boolean
  setPlaying: (playing: boolean) => void
}

const VoicePlayerContext = createContext<VoicePlayerContextType | undefined>(undefined)

export function VoicePlayerProvider({ children }: { children: ReactNode }) {
  const [currentItem, setCurrentItemState] = useState<VoiceItem | null>(null)
  const [newsItems, setNewsItems] = useState<VoiceItem[]>([])
  const [currentIndex, setCurrentIndexState] = useState(0)
  const [playing, setPlaying] = useState(false)

  const setCurrentItem = (item: VoiceItem | null) => {
    setCurrentItemState(item)
  }

  const setCurrentIndex = (index: number) => {
    setCurrentIndexState(index)
    if (newsItems[index]) {
      setCurrentItemState(newsItems[index])
    }
  }

  return (
    <VoicePlayerContext.Provider
      value={{
        currentItem,
        setCurrentItem,
        newsItems,
        setNewsItems,
        currentIndex,
        setCurrentIndex,
        playing,
        setPlaying,
      }}
    >
      {children}
    </VoicePlayerContext.Provider>
  )
}

export function useVoicePlayer() {
  const context = useContext(VoicePlayerContext)
  if (context === undefined) {
    throw new Error('useVoicePlayer must be used within a VoicePlayerProvider')
  }
  return context
}