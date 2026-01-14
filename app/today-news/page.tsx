"use client";
import "../globals.css";
import {
  ChevronRightIcon,
} from "@icons/index";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import NavigationHeader from "@/components/NavigationHeader";
import VoiceNewsCard, { VoiceItem } from "@/components/NewsCard";
import VerticalNewsCard from "@/components/VerticalNewsCard";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { Characters } from "@/app/ai-character/config"; // キャラクター情報をインポート

type HatenaItem = {
  title: string;
  link: string;
  "hatena:imageurl": string;
  "dc:subject"?: string | string[];
  body?: string
};

export default function HomePage() {
  const [popularNews, setpopularNews] = useState<HatenaItem[]>([]);
  const [newTopics, setnewTopics] = useState<HatenaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hatena?type=new")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setnewTopics(data);
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  useEffect(() => {
    fetch("/api/hatena?type=popular")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setpopularNews(data);
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  // playAudio 関数
  const playAudio = async (text: string, speaker: string) => {
    try {
      const res = await axios.post("/api/audio", { text, speaker });
      const base64Audio = res?.data?.response;
      if (!base64Audio) return;

      const byteArray = Buffer.from(base64Audio, "base64");
      const audioBlob = new Blob([byteArray], { type: "audio/x-wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = 1;
      audio.play();

      console.log("再生中キャラクター:", speaker);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-background-light h-screen w-full px-0 relative flex flex-col overflow-hidden">
      <BottomNavigationBar />
      <div className="pt-[54px] shrink-0">
        <NavigationHeader title="最新ニュース" showBack={false} />
      </div>
      {error && <p className="text-red-400">{error}</p>}

      {/* graphic */}
      <div className="flex justify-center my-4">
        <div className="relative w-[398px] h-[132px] md:w-48 md:h-48">
          <SafeImage
            src="/graphic-nemura.png"
            alt="Description"
            fill
            sizes="400px"
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="px-5">
        {/* Trending News */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="title font-bold text-white-soft">おすすめ</h2>
              <p className="desc">選択されたトピックに基づくおすすめ</p>
            </div>
            <Link href="/today-news/topic-news" className="flex items-center pt-8">
              <p className="text-[#3A86FF]">すべて見る</p>
              <ChevronRightIcon className="w-4 h-4 text-[#3A86FF] cursor-pointer" />
            </Link>
          </div>

          <div className="flex space-x-4 overflow-x-auto">
            {newTopics.slice(0, 5).map((news, idx) => (
              <div key={idx} className="flex-shrink-0">
                <VerticalNewsCard
                  item={{
                    title: news.title,
                    imageUrl: news["hatena:imageurl"],
                    subject: Array.isArray(news["dc:subject"]) ? news["dc:subject"][0] : news["dc:subject"] || "未分類",
                    body: news.body,
                    link: news.link
                  }}
                  onPlayClick={() => playAudio(news.title, Characters[18].label)}
                  onToggleAdd={(added) => console.log("added:", added)}
                />
              </div>
            ))}
          </div>
        </div>


        {/* Topic News */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white-soft">最新ニュース</h2>
            <Link href="/today-news/latest-news" className="flex items-center pt-2">
              <p className="text-[#3A86FF]">すべて見る</p>
              <ChevronRightIcon className="w-4 h-4 text-[#3A86FF] cursor-pointer" />
            </Link>
          </div>

          <div className="h-[400px] overflow-y-auto space-y-4">
            {popularNews.slice(0, 10).map((news) => (
              <VoiceNewsCard
                key={news.title}
                item={{
                  title: news.title,
                  imageUrl: news["hatena:imageurl"],
                  subject: Array.isArray(news["dc:subject"])
                    ? news["dc:subject"][0]
                    : news["dc:subject"] || "未分類",
                  body: news.body,
                  link: news.link
                }}
                onToggleAdd={(added) => console.log("added:", added)}
                onPlayClick={() => playAudio(news.title, Characters[18].label)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}