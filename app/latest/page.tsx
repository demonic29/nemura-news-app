"use client";

import { ArrowRightIcon, AddCircleIcon, PlayCircleIcon } from "@/assets/icons";
import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderNav from "@/components/HeaderNav";
import SafeImage from "@/components/SafeImage";
import axios from "axios";
import { Characters } from '../ai-character/config';
import LatestNewsCard from "@/components/LatestNewsCard"
import { playAudio } from "../lib/audio";
import NavigationHeader from "@/components/NavigationHeader";

export default function LatestPage() {
  const [popularNews, setpopularNews] = useState<any[]>([]);
  const [newTopics, setnewTopics] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hatena?type=new")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setpopularNews(data);
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  // 音声再生
  const [character, setCharacter] = useState<string>('');

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredNews = selectedTopic
    ? popularNews.filter((item) => {
      const subject = Array.isArray(item["dc:subject"])
        ? item["dc:subject"][1]
        : item["dc:subject"];
      return subject === selectedTopic;
    })
    : popularNews;

  // Get unique topics
  const uniqueTopics = Array.from(
    new Set(
      popularNews.map((item) => {
        const subject = Array.isArray(item["dc:subject"])
          ? item["dc:subject"][1]
          : item["dc:subject"];
        return subject;
      })
    )
  );

  return (
    <div className="bg-background-light min-h-screen text-white px-2 py-6">
      {/* <ArrowLeftIcon className="w-4 h-4 text-[#3A86FF] cursor-pointer" /> */}

      <NavigationHeader title="最新ニュース" />

      <div>
        <div>
          <p className="desc">トピック絞り込み</p>

          {/* topics - now using uniqueTopics */}
          <div className="flex gap-2 overflow-x-auto pb-2 my-4 scrollbar-hide">
            {uniqueTopics.map((subject, index) => (
              <button
                key={index}
                onClick={() => {
                  if (selectedTopic === subject) {
                    setSelectedTopic(null);
                  } else {
                    setSelectedTopic(subject);
                  }
                }}
                className={`flex-shrink-0 bg-gradient-to-r from-[#1D57A6] to-[#2868B8] text-white text-sm font-medium rounded-full px-5 py-2.5 hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap ${selectedTopic === subject ? "ring-2 ring-blue-200" : ""
                  }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* news */}
        <div className="space-y-4">
          {filteredNews.slice(0, 10).map((i, index) => (
            <LatestNewsCard key={index} i={i} playAudio={playAudio} />
          ))}
        </div>
      </div>
    </div>
  );
}