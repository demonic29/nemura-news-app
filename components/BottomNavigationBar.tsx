// BottomNavigationBar.tsx

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  HomeIcon, 
  SpeechToTextIcon, 
  PlayListAddCheckIcon 
} from "@icons/index"

export default function BottomNavigationBar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: 'Home', icon: HomeIcon, path: '/today-news' },
    { label: 'Listen', icon: SpeechToTextIcon, path: '/voice-player', small: true },
    { label: 'Playlist', icon: PlayListAddCheckIcon, path: '/playlist' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-md border-t border-white/10 pb-6 pt-3 px-5 sm:px-10 rounded-t-3xl">
      <div className="flex items-center justify-between max-w-[430px] mx-auto w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          const iconSizeClass = item.small ? 'w-7 h-7' : 'w-8 h-8'

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center flex-1 transition-all"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-button' : 'text-white-soft'
                  } ${iconSizeClass}`}
                />
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-button' : 'text-white-soft'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}