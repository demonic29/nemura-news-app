'use client'

import { useRouter } from 'next/navigation'
import { ArrowRightIcon, SettingIcon } from "@icons/index"

type Props = {
  showSetting?: boolean
}

export default function NavigationHeader({ showSetting = true }: Props) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-6 h-[54px] w-full bg-transparent">

      {/* 戻るボタン */}
      <button
        onClick={() => router.back()}
        className="p-2 text-white-soft/70 transition-opacity hover:opacity-70"
        aria-label="戻る"
      >
        <div className="inline-block" style={{ transform: 'scaleX(-1)' }}>
          <ArrowRightIcon size={32} strokeWidth={1.5} />
        </div>
      </button>

      {/* 設定ボタン */}
      {showSetting && (
        <button
          onClick={() => router.push('/settings')}
          className="p-2 text-white-soft/70 transition-opacity hover:opacity-70"
          aria-label="設定"
        >
          <SettingIcon size={32} strokeWidth={1.5} />
        </button>
      )}

    </header>
  )
}