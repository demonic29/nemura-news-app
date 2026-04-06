"use client";

import { useEffect, useState } from "react";

import LatestNewsCard from "@/components/LatestNewsCard"
import NavigationHeader from "@/components/NavigationHeader";
import { HatenaNewsItem } from "@/app/lib/news";

export default function TopicPage() {
    const [popularNews, setPopularNews] = useState<HatenaNewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/hatena?type=popular")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) setError(data.error);
                else setPopularNews(data);
            })
            .catch(() => setError("Failed to load data"));
    }, []);

    return (
        <div className="bg-background-light min-h-screen text-white px-2 py-6">
            {/* <ArrowLeftIcon className="w-4 h-4 text-[#3A86FF] cursor-pointer" /> */}

            <NavigationHeader title="トピック" />

            {/* news */}
            <div className="space-y-4 mt-4">
                {popularNews.slice(0, 10).map((i, index) => (
                    <LatestNewsCard key={index} item={i} detailBasePath="/topic" />
                ))}
            </div>
        </div>
    );
}
