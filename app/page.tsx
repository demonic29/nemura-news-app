'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'
import Image from 'next/image'

export default function SplashWelcome() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home') // 3秒後に ページへ
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background-light">
      <Image
        src="/logo.jpg"
        alt="プロジェクトロゴ"
        width={200}
        height={200}
        priority
      />
      <p className="mt-4 text-white text-xl">Nemura</p>
    </main>
  )
}