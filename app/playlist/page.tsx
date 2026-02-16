// playlist/page.tsx

'use client'

import NavigationHeader from "@/components/NavigationHeader"
import NewsCard from "@/components/NewsCard"
import NewsPlayerMini from "@/components/NewsPlayer/NewsPlayerMini"
import { useVoicePlayer, VoiceItem } from '@/context/VoicePlayerContext'
import BottomNavigationBar from "@/components/BottomNavigationBar"
import { auth, db } from '@/app/lib/firebase/firebase'
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore'

import { useState, useRef, useEffect } from "react"

interface PlaylistItem {
    id: string
    title: string
    imageUrl: string
    category: string
    link: string
    addedAt: any
}

export default function PlaylistPage() {
    const [items, setItems] = useState<PlaylistItem[]>([])
    const [user, setUser] = useState<any>(null)
    const { playing, currentItem, setCurrentItem, setPlaying } = useVoicePlayer()
    const miniPlayerRef = useRef<HTMLDivElement>(null)

    // Get current user
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribeAuth()
    }, [])

    // Fetch user's playlist from Firebase
    useEffect(() => {
        if (!user) return

        const userDocRef = doc(db, "users", user.uid)
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            const data = snapshot.data()
            const playlistItems = (data?.playlist || []) as PlaylistItem[]
            setItems(playlistItems)
        })

        return () => unsubscribe()
    }, [user])

    const handleRemove = async (itemId: string) => {
        if (!user) return

        try {
            const userDocRef = doc(db, "users", user.uid)
            const itemToRemove = items.find(item => item.id === itemId)
            
            if (itemToRemove) {
                await updateDoc(userDocRef, {
                    playlist: arrayRemove(itemToRemove)
                })
            }
            
            setItems(prev => prev.filter(item => item.id !== itemId))
            if (currentItem?.title === itemToRemove?.title) {
                setPlaying(false)
                setCurrentItem(null)
            }
        } catch (error) {
            console.error("Error removing item from playlist:", error)
        }
    }

    const handlePlay = (item: PlaylistItem) => {
        setCurrentItem({
            title: item.title,
            body: item.category,
            imageUrl: item.imageUrl,
        })
        setPlaying(true)
    }

    // 外クリックでMiniPlayerを閉じる
    useEffect(() => {
        const handleCloseMini = () => {
            setPlaying(false)
            setCurrentItem(null)
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                miniPlayerRef.current &&
                !miniPlayerRef.current.contains(event.target as Node)
            ) {
                handleCloseMini()
            }
        }
        if (playing) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [playing, setCurrentItem, setPlaying])

    return (
        <div className="bg-background-light h-screen w-full relative flex flex-col overflow-hidden">
            <div className="relative w-full flex flex-col overflow-hidden">
                <div className="h-[54px] shrink-0" />
                <BottomNavigationBar />
                    <NavigationHeader title="プレイリスト" />

                <div className="flex-1 flex flex-col px-6 mt-6 z-20 overflow-y-auto pb-32">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <NewsCard
                                key={item.id}
                                item={{
                                    title: item.title,
                                    imageUrl: item.imageUrl,
                                    subject: item.category,
                                }}
                                onPlayClick={() => handlePlay(item)}
                                onToggleAdd={(added) => {
                                    if (!added) handleRemove(item.id)
                                }}
                                isPlaylistMode={true}
                            />
                        ))}
                    </div>

                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <p>リストにニュースがありません</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ミニプレイヤー */}
            {playing && currentItem && (
                <div ref={miniPlayerRef} className="absolute bottom-0 left-0 right-0 z-[200]">
                    <NewsPlayerMini isOpen={true} />
                </div>
            )}
        </div>
    )
}