// NavigationHeader.tsx

'use client'

import { useRouter } from 'next/navigation'
import { ArrowRightIcon, SettingIcon } from "@/assets/icons/index"

type Props = {
  showSetting?: boolean
  showBack?: boolean
  title?: string
  className?: string // ページ側で任意に余白やスタイルを追加できる
}

export default function NavigationHeader({
  showSetting = true,
  showBack = true,
  title,
  className = ""
}: Props) {
  const router = useRouter()

  return (
    <header className="w-full bg-transparent">
      <div className={`flex items-center justify-between h-[54px] px-6 ${className}`}>
        {/* 戻るボタン */}
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="p-2 text-white/70 transition-opacity hover:opacity-70 z-10 translate-y-[2px]"
            aria-label="戻る"
          >
            <div className="inline-block" style={{ transform: 'scaleX(-1)' }}>
              <ArrowRightIcon className="w-7 h-7" />
            </div>
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* 中央タイトル */}
        {title && (
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-white truncate">{title}</h1>
          </div>
        )}

        {/* 設定ボタン */}
        {showSetting ? (
          <button
            onClick={() => router.push('/settings')}
            className="p-2 text-white/70 transition-opacity hover:opacity-70"
            aria-label="設定"
          >
            <SettingIcon className="w-7 h-7" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  )
}