// icons
import {

    SettingIcon,
    GraphicIcon,
} from "@/assets/icons/index";
import SafeImage from "@/components/SafeImage";

export default function HomeHeader() {
    return (
        <header className="relative mb-6">
            <h1 className="text-2xl mb-4 font-bold text-center">今日の Nemura</h1>
        
            <SettingIcon
                className="text-gray-400 w-6 h-6 cursor-pointer absolute right-0 top-1"
                fontSize="medium"
            />

            {/* Voice Summary */}
            <div className="bg-[#3A86FF]/20 p-6 rounded-xl shadow-lg flex items-center justify-between space-x-6 mb-6">
            <div className="flex flex-col justify-between h-full">
                <button className="flex items-center space-x-2 bg-[#0D1B2A] text-white py-2 px-4 rounded-lg shadow-md mb-4 text-base font-semibold">
                    <GraphicIcon className="w-6 h-6 mr-2" fontSize="medium" />
                <span>音声で要約を聴く</span>
                </button>
                <p className="text-white text-sm leading-relaxed mt-auto">
                    今日の世界を音声で簡単にチェックできます！
                </p>
            </div>

            {/* graphic */}
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-lg relative">
                <SafeImage
                    src="/graphic-nemura.png"
                    alt="Description"
                    fill
                    sizes="300px"
                    className="rounded-lg object-cover"
                />
            </div>
            </div>
        </header>
    )
}
