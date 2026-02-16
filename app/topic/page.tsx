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
        fetch("/api/hatena?type=popular")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) setError(data.error);
                else setpopularNews(data);
            })
            .catch(() => setError("Failed to load data"));
    }, []);

    // 音声再生
    const [character, setCharacter] = useState<string>('');
    console.log(character)

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);


    return (
        <div className="bg-background-light min-h-screen text-white px-2 py-6">
            {/* <ArrowLeftIcon className="w-4 h-4 text-[#3A86FF] cursor-pointer" /> */}

            <NavigationHeader title="トピック" />

            {/* news */}
            <div className="space-y-4 mt-4">
                {popularNews.slice(0, 10).map((i, index) => (
                    <LatestNewsCard key={index} i={i} playAudio={playAudio} />
                ))}
            </div>
        </div>
    );
}