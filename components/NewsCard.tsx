// NewsCard.tsx

'use client'

import SafeImage from './SafeImage'
import { useState } from 'react'
import { AddCircleIcon, RemoveCircleIcon, PlayCircleIcon } from "@/assets/icons"
import Link from 'next/link'

export type VoiceItem = {
  title: string
  imageUrl?: string
  body?: string
  subject?: string | string[]
  [key: string]: any
}

export type NewsCardProps = {
  item: VoiceItem
  isAdded?: boolean
  onPlayClick?: () => void
  onToggleAdd?: (added: boolean) => void
  isPlaylistMode?: boolean
}

export default function NewsCard({
  item,
  isAdded = false,
  onPlayClick,
  onToggleAdd,
  isPlaylistMode = false,
}: NewsCardProps) {
  const [added, setAdded] = useState(isAdded)

  const handleToggleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdded(!added)
    onToggleAdd?.(!added)
  }

  // subject を item["dc:subject"] から取得
  const subject =
    Array.isArray(item["dc:subject"])
      ? item["dc:subject"][1] || "未分類"
      : item["dc:subject"] || item.subject || "未分類"

  // 画像は item.imageUrl 優先、それがなければ item["hatena:imageurl"]
  const imageUrl = item.imageUrl || item["hatena:imageurl"]

  return (
    <Link href={`/latest/${encodeURIComponent(item.title)}`}>
      <div
        className="relative mb-4 flex min-h-[6rem] w-full overflow-hidden rounded-xl bg-[#3A86FF]/10 transition-colors hover:bg-[#3A86FF]/20 sm:h-[100px]"
      >

        {/* 画像 */}
        <div className="relative h-auto w-[5.5rem] flex-shrink-0 sm:w-[6.25rem]">
          {imageUrl && (
            <SafeImage
              src={imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 5.5rem, 6.25rem"
            />
          )}
        </div>

        {/* テキスト */}
        <div className="relative flex flex-grow flex-col px-3 py-3">
          <h3 className="line-clamp-2 pr-2 text-sm font-semibold text-white sm:text-[0.95rem]">
            {item.title}
          </h3>
          <div className="mt-auto text-xs text-gray-400">
            {subject}
          </div>
        </div>

        {/* アクションボタン（常にアイコン） */}
        {/* <div className="absolute bottom-1 right-2 flex items-center space-x-2">
          <button
            onClick={handleToggleAdd}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            {isPlaylistMode ? (
              <RemoveCircleIcon className="w-7 h-7 text-gray-400" />
            ) : added ? (
              <RemoveCircleIcon className="w-7 h-7 text-gray-400" />
            ) : (
              <AddCircleIcon className="w-7 h-7 text-gray-400" />
            )}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onPlayClick?.() }}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <PlayCircleIcon className="w-7 h-7 text-gray-400" />
          </button>
        </div> */}
      </div>
    </Link>
  )
}
