// context/VoicePlayerContext.tsx

'use client'

import { createContext, useContext, useState, ReactNode } from "react"
// import { Characters } from "@/app/_ai-character/config"
import { Characters } from "@/app/ai-character/config"

export type VoiceItem = {
    title: string
    body?: string
    imageUrl?: string
    estimatedDuration?: number
}

type VoicePlayerContextType = {
    currentItem: VoiceItem | null
    playing: boolean
    character: any | null
    setCurrentItem: (item: VoiceItem | null) => void
    setPlaying: (playing: boolean) => void
    setCharacter: (character: typeof Characters | null) => void
}

const VoicePlayerContext = createContext<VoicePlayerContextType | undefined>(undefined)

export function VoicePlayerProvider({ children }: { children: ReactNode }) {
    const [playing, setPlaying] = useState(false)
    const [currentItem, setCurrentItem] = useState<VoiceItem | null>(null)
    const [character, setCharacter] = useState<typeof Characters | null>(null)

    return (
        <VoicePlayerContext.Provider value={{
            currentItem,
            setCurrentItem,
            playing,
            setPlaying,
            character,
            setCharacter,
        }}>
            {children}
        </VoicePlayerContext.Provider>
    )
}

export function useVoicePlayer() {
    const context = useContext(VoicePlayerContext)
    if (!context) throw new Error("useVoicePlayer must be used within a VoicePlayerProvider")
    return context
}