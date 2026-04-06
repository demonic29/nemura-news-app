'use client'

import { useEffect, useState } from "react";

import { HatenaNewsItem } from "@/app/lib/news";

type HatenaFeedType = "popular" | "new";

type UseHatenaNewsResult = {
  error: string;
  loading: boolean;
  newsItems: HatenaNewsItem[];
};

export function useHatenaNews(
  type: HatenaFeedType,
  limit: number,
): UseHatenaNewsResult {
  const [newsItems, setNewsItems] = useState<HatenaNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/hatena?type=${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Hatena news.");
        }

        const data = (await response.json()) as HatenaNewsItem[] | { error?: string };

        if (!isActive) {
          return;
        }

        if (Array.isArray(data)) {
          setNewsItems(data.slice(0, limit));
          return;
        }

        setError(data.error ?? "ニュースの取得に失敗しました");
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        console.error("News fetch error:", fetchError);
        setError("ニュースの取得に失敗しました");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      isActive = false;
    };
  }, [limit, type]);

  return { error, loading, newsItems };
}
