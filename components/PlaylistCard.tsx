// PlaylistCard.tsx

'use client'

import Link from 'next/link'

import SafeImage from './SafeImage'
import { RemoveCircleIcon, PlayCircleIcon } from "@/assets/icons"

export type VoiceItem = {
    title: string
    imageUrl?: string
    body?: string
    subject?: string | string[]
    [key: string]: any
}

export type NewsCardProps = {
    item: VoiceItem
    onPlayClick?: () => void
    onToggleAdd?: (added: boolean) => void
    isPlaylistMode?: boolean
}

export default function PlaylistCard({
    item,
    onPlayClick,
    onToggleAdd,
    isPlaylistMode = false,
}: NewsCardProps) {
    const subject =
        Array.isArray(item["dc:subject"])
            ? item["dc:subject"][1] || item["dc:subject"][0] || "未分類"
            : item["dc:subject"] || item.subject || "未分類"

    const imageUrl = item.imageUrl || item["hatena:imageurl"]
    const detailHref = `/playlist/${encodeURIComponent(item.title)}`

    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-colors hover:bg-white/[0.08]">
            <div className="flex items-center gap-4">
                <Link
                    href={detailHref}
                    className="relative h-[92px] w-[92px] flex-shrink-0 overflow-hidden rounded-[20px] bg-white/10"
                >
                    {imageUrl && (
                        <SafeImage
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="92px"
                        />
                    )}
                </Link>

                <div className="min-w-0 flex-1">
                    <Link href={detailHref} className="block min-w-0">
                        <span className="inline-flex max-w-full rounded-full bg-[#3A86FF]/15 px-2.5 py-1 text-[11px] font-medium text-blue-100">
                            {subject}
                        </span>
                        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-5 text-white-soft">
                            {item.title}
                        </h3>
                    </Link>

                    <p className="mt-3 text-xs text-white/50">
                        {isPlaylistMode ? "プレイリストに保存済み" : "あとで聞くニュース"}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onPlayClick?.()
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A86FF]/18 text-blue-100 transition-colors hover:bg-[#3A86FF]/28"
                        aria-label={`${item.title} を再生`}
                    >
                        <PlayCircleIcon className="h-6 w-6" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleAdd?.(false)
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/65 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label={`${item.title} をプレイリストから削除`}
                    >
                        <RemoveCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}
