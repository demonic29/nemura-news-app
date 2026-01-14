// playlist/page.tsx

'use client'

import NavigationHeader from "@/components/NavigationHeader"
import NewsCard from "@/components/NewsCard"
import NewsPlayerMini from "@/components/NewsPlayer/NewsPlayerMini"
import { useVoicePlayer, VoiceItem } from '@/context/VoicePlayerContext'
import BottomNavigationBar from "@/components/BottomNavigationBar";

import { useState } from "react"

// ダミーデータ
const DUMMY_PLAYLIST: VoiceItem[] = [
  { title: "成人式…", body: "本文1", imageUrl: "https://picsum.photos/200/200?random=1", subject: "暮らし" } as any,
  { title: "最新テクノロジー…", body: "本文2", imageUrl: "https://picsum.photos/200/200?random=2", subject: "テクノロジー" } as any,
  { title: "週末に行きたいカフェ…", body: "本文3", imageUrl: "https://picsum.photos/200/200?random=3", subject: "お出かけ" } as any
]

export default function PlaylistPage() {
  const [items, setItems] = useState(DUMMY_PLAYLIST)

  // VoicePlayerContext
  const { playing, currentItem, setCurrentItem, setPlaying } = useVoicePlayer()

  const handleRemove = (title: string) => {
    setItems(prev => prev.filter(item => item.title !== title))
    // 再生中のアイテムを削除した場合は停止
    if (currentItem?.title === title) {
      setPlaying(false)
      setCurrentItem(null)
    }
  }

  const handlePlay = (item: VoiceItem) => {
    setCurrentItem(item)
    setPlaying(true)
  }

  const handleCloseMini = () => {
    setPlaying(false)
    setCurrentItem(null)
  }

  return (
    <div className="bg-background-light h-screen w-full relative flex flex-col overflow-hidden">
      <div className="relative w-full flex flex-col overflow-hidden">
        <div className="h-[54px] shrink-0" />
        <NavigationHeader title="選択されたプレイリスト" />
        {/* ナビバー */}
        <BottomNavigationBar />


        <div className="flex-1 flex flex-col px-6 mt-6 z-20 overflow-y-auto pb-32">
          <div className="space-y-4">
          {items.map((item, idx) => (
            <NewsCard
              key={idx}
              item={item}  // ←ここで丸ごと渡す
              onPlayClick={() => handlePlay(item)}
              onToggleAdd={(added) => {
                if (!added) handleRemove(item.title)
              }}
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

      {/* 再生中ならMiniプレイヤー表示 */}
      {playing && currentItem && (
        <NewsPlayerMini isOpen={true} />
      )}
    </div>
  )
}