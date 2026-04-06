// playlist/page.tsx

'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { User } from "firebase/auth"
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore"

import NavigationHeader from "@/components/NavigationHeader"
import NewsPlayerMini from "@/components/NewsPlayer/NewsPlayerMini"
import BottomNavigationBar from "@/components/BottomNavigationBar"
import PlaylistCard from "@/components/PlaylistCard"
import SafeImage from "@/components/SafeImage"
import { PlayCircleIcon } from "@/assets/icons"
import { useVoicePlayer } from "@/app/context/VoicePlayerContext"
import { auth, db } from "@/app/lib/config/firebase"

import sample from "@/public/fallback-img.png"

interface PlaylistItem {
    id: string
    title: string
    imageUrl?: string
    category?: string
    link?: string
    addedAt?: unknown
}

export default function PlaylistPage() {
    const [items, setItems] = useState<PlaylistItem[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [isAuthReady, setIsAuthReady] = useState(false)

    const {
        playing,
        currentItem,
        setCurrentItem,
        setPlaying,
        playQueue,
    } = useVoicePlayer()

    const miniPlayerRef = useRef<HTMLDivElement>(null)
    const playlistCoverImage = currentItem?.imageUrl || items[0]?.imageUrl || sample
    const playlistSummary =
        items.length === 0
            ? "あとで聞きたいニュースを、ここに少しずつ集めていきましょう。"
            : "気になったニュースをまとめて、眠る前にゆっくり聞けるプレイリストです。"

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser)
            setIsAuthReady(true)
        })

        return () => unsubscribeAuth()
    }, [])

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
            const itemToRemove = items.find((item) => item.id === itemId)

            if (itemToRemove) {
                await updateDoc(userDocRef, {
                    playlist: arrayRemove(itemToRemove),
                })
            }

            setItems((prev) => prev.filter((item) => item.id !== itemId))
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

    const handlePlayAll = () => {
        const voiceItems = items.map((item) => ({
            title: item.title,
            body: item.category,
            imageUrl: item.imageUrl,
        }))

        playQueue(voiceItems)
    }

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
        <main className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background-light">
            <BottomNavigationBar />

            <div
                className={`mx-auto flex w-full max-w-[30rem] flex-1 flex-col px-4 pt-2 sm:px-6 ${
                    playing ? "pb-[18rem]" : "pb-32"
                }`}
            >
                <NavigationHeader title="Playlist" showBack={false} className="px-0" />

                <section className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-white/10">
                            <SafeImage
                                alt="Playlist cover"
                                fill
                                src={playlistCoverImage}
                                sizes="96px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                                Playlist
                            </p>
                            <h1 className="mt-2 text-[26px] font-semibold leading-8 text-white-soft">
                                Nemura Playlist
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-white/65">
                                {playlistSummary}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
                            {items.length}件保存中
                        </span>
                        {playing && currentItem && (
                            <span className="rounded-full bg-[#3A86FF]/20 px-3 py-1.5 text-xs font-medium text-blue-100">
                                再生中
                            </span>
                        )}
                    </div>

                    {playing && currentItem && (
                        <div className="mt-4 rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
                                Now Playing
                            </p>
                            <p className="mt-1 line-clamp-1 text-sm text-white/80">
                                {currentItem.title}
                            </p>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={handlePlayAll}
                            disabled={items.length === 0}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3A86FF] px-5 py-3 text-sm font-semibold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/45"
                        >
                            <PlayCircleIcon className="h-5 w-5" />
                            全て再生
                        </button>

                        <p className="text-sm leading-6 text-white/55 sm:max-w-[13rem]">
                            保存したニュースを、順番にそのまま連続再生できます。
                        </p>
                    </div>
                </section>

                <section className="mt-8 flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-white-soft">
                            保存したニュース
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                            {items.length === 0
                                ? "あとで聞きたい記事を追加すると、ここに並びます。"
                                : `${items.length}件のニュースがあります。`}
                        </p>
                    </div>
                </section>

                <div className="mt-4 flex-1 overflow-y-auto no-scrollbar">
                    {!isAuthReady ? (
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.05] px-5 py-10 text-center text-sm text-white/60">
                            プレイリストを読み込み中...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.04] px-6 py-12 text-center">
                            <p className="text-base font-medium text-white-soft">
                                まだニュースが保存されていません
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/60">
                                気になった記事をプレイリストに追加すると、あとでゆっくり聞けます。
                            </p>
                            <Link
                                href="/home"
                                className="mt-5 inline-flex items-center justify-center rounded-full border border-white/12 bg-white/10 px-5 py-2.5 text-sm font-medium text-white-soft transition-colors hover:bg-white/15"
                            >
                                おすすめを見る
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3 pb-4">
                            {items.map((item) => (
                                <PlaylistCard
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
                    )}
                </div>
            </div>

            {playing && currentItem && (
                <div
                    ref={miniPlayerRef}
                    className="pointer-events-none absolute bottom-0 left-0 right-0 z-[200]"
                >
                    <div className="pointer-events-auto">
                        <NewsPlayerMini isOpen={true} />
                    </div>
                </div>
            )}
        </main>
    )
}
