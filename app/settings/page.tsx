'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import Background from "@/components/Background"
import NavigationHeader from "@/components/NavigationHeader"
import LottiePlayer from "@/components/LottiePlayer"
import { AddCircleIcon, GraphicIcon } from "@/assets/icons/index"
import smileJson from "@/assets/animations/smile-nemura.json"
import { auth, db } from "@/app/lib/firebase/firebase" // Adjust import path as needed
import { signOut } from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const SETTINGS_MENU = [
    {
      id: "topics",
      label: "おすすめトピック",
      icon: <AddCircleIcon className="w-7 h-7 text-gray-soft" />,
      path: "/settings/choose-topic",
    },
    {
      id: "voice",
      label: "読み上げ音声",
      icon: <GraphicIcon className="w-7 h-7 text-gray-soft" />,
      path: "/settings/choose-voice",
    },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const user = auth.currentUser

      if (user) {
        // Delete user data from Firestore
        const userDocRef = doc(db, "users", user.uid)
        await deleteDoc(userDocRef)
        
        // Sign out from Firebase Auth
        await signOut(auth)
        
        // Navigate to welcome page
        router.push("/welcome")
      }
    } catch (error) {
      console.error("ログアウトエラー:", error)
      alert("ログアウトに失敗しました。もう一度お試しください。")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Background>
      <div className="relative w-full h-[100dvh] z-0">

        <div className="relative z-50">
          <div className="h-[54px]" /> {/* 上余白 */}
          <div className="h-[54px]">
            <NavigationHeader showSetting={false} />
          </div>
        </div>

        <div className="relative z-40 flex flex-col items-center px-10 gap-5 mt-20">
          {SETTINGS_MENU.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                console.log("リンクをクリックしました:", item.path)
                router.push(item.path)
              }}
              className="relative z-50 cursor-pointer flex items-center w-full max-w-[340px] bg-white-soft py-4 px-5 rounded-full shadow-lg transition-all active:scale-[0.97] pointer-events-auto"
            >
              <div className="flex items-center justify-center w-8 translate-y-0.5 pointer-events-none">
                {item.icon}
              </div>
              <span className="ml-4 text-base leading-none text-gray-soft pointer-events-none">
                {item.label}
              </span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="relative z-50 cursor-pointer flex items-center justify-center w-full max-w-[340px] bg-blue-900 hover:bg-blue-600 disabled:bg-gray-400 py-4 px-5 rounded-full shadow-lg transition-all active:scale-[0.97] pointer-events-auto mt-8"
          >
            <span className="text-base leading-none text-white pointer-events-none">
              {isLoggingOut ? "ログアウト中..." : "ログアウト"}
            </span>
          </button>
        </div>

        {/* 3. 背景のアニメーション：z-10 で一番奥へ */}
        <div className="absolute bottom-[-60px] w-full flex justify-center pointer-events-none z-10">
          <LottiePlayer data={smileJson} width={340} height={340} />
        </div>

      </div>
    </Background>
  )
}