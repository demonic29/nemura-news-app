'use client'

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  estimateReadingDurationSeconds,
  getHatenaNewsDescription,
  getHatenaNewsId,
  HatenaNewsItem,
} from "@/app/lib/news";

export type AudioLoadingStatus = "idle" | "loading" | "ready" | "error";

type NotificationState = {
  message: string;
  visible: boolean;
};

type CurrentVoiceItem = {
  body: string;
  estimatedDuration: number;
  newsId: string;
  title: string;
};

type UseNewsAudioResult = {
  currentAudioState: AudioLoadingStatus;
  currentAudioUrl: string | null;
  currentIndex: number;
  currentItem: CurrentVoiceItem | null;
  handleNext: () => void;
  handlePrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  isPlaying: boolean;
  notification: NotificationState;
  setIsPlaying: (isPlaying: boolean) => void;
};

type PregenerateAudioResponse = {
  audioUrl?: string;
};

export function useNewsAudio(
  newsItems: HatenaNewsItem[],
  selectedSpeaker: string | null,
): UseNewsAudioResult {
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [audioLoadingStates, setAudioLoadingStates] = useState<
    Record<string, AudioLoadingStatus>
  >({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    visible: false,
  });
  const [announcedReadyId, setAnnouncedReadyId] = useState<string | null>(null);

  const showNotification = useCallback((message: string) => {
    setNotification({ message, visible: true });
  }, []);

  useEffect(() => {
    if (!notification.visible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotification((currentNotification) => ({
        ...currentNotification,
        visible: false,
      }));
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notification.visible]);

  useEffect(() => {
    if (currentIndex >= newsItems.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, newsItems.length]);

  const requestAudioForIndex = useCallback(
    async (index: number) => {
      if (!selectedSpeaker) {
        return;
      }

      const news = newsItems[index];
      if (!news) {
        return;
      }

      const newsId = getHatenaNewsId(news, index);
      const audioState = audioLoadingStates[newsId];

      if (audioUrls[newsId] || audioState === "loading" || audioState === "ready") {
        return;
      }

      const title = news.title?.trim() || "この記事にはタイトルがありません";
      const description =
        getHatenaNewsDescription(news).trim() || "詳細情報がありません";

      setAudioLoadingStates((currentStates) => ({
        ...currentStates,
        [newsId]: "loading",
      }));

      try {
        const response = await fetch("/api/pregenerate-news-audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newsId,
            title,
            description,
            speaker: selectedSpeaker,
          }),
        });

        const data = (await response.json()) as PregenerateAudioResponse & {
          error?: string;
        };

        if (!response.ok || !data.audioUrl) {
          throw new Error(data.error ?? "Failed to generate audio.");
        }

        setAudioUrls((currentUrls) => ({
          ...currentUrls,
          [newsId]: data.audioUrl!,
        }));
        setAudioLoadingStates((currentStates) => ({
          ...currentStates,
          [newsId]: "ready",
        }));
      } catch (audioError) {
        console.error(`Audio generation error for ${newsId}:`, audioError);
        setAudioLoadingStates((currentStates) => ({
          ...currentStates,
          [newsId]: "error",
        }));
      }
    },
    [audioLoadingStates, audioUrls, newsItems, selectedSpeaker],
  );

  useEffect(() => {
    if (!selectedSpeaker || newsItems.length === 0) {
      return;
    }

    void requestAudioForIndex(currentIndex);
  }, [currentIndex, newsItems.length, requestAudioForIndex, selectedSpeaker]);

  useEffect(() => {
    const currentNews = newsItems[currentIndex];
    if (!currentNews) {
      return;
    }

    const currentNewsId = getHatenaNewsId(currentNews, currentIndex);
    const isCurrentAudioReady =
      audioLoadingStates[currentNewsId] === "ready" || Boolean(audioUrls[currentNewsId]);

    if (!isCurrentAudioReady) {
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < newsItems.length) {
      void requestAudioForIndex(nextIndex);
    }
  }, [audioLoadingStates, audioUrls, currentIndex, newsItems, requestAudioForIndex]);

  useEffect(() => {
    const currentNews = newsItems[currentIndex];
    if (!currentNews) {
      return;
    }

    const currentNewsId = getHatenaNewsId(currentNews, currentIndex);
    const isCurrentAudioReady =
      audioLoadingStates[currentNewsId] === "ready" && Boolean(audioUrls[currentNewsId]);

    if (!isCurrentAudioReady || announcedReadyId === currentNewsId) {
      return;
    }

    setAnnouncedReadyId(currentNewsId);
    setIsPlaying(true);
    showNotification("音声の準備ができました");
  }, [
    announcedReadyId,
    audioLoadingStates,
    audioUrls,
    currentIndex,
    newsItems,
    showNotification,
  ]);

  const currentItem = useMemo<CurrentVoiceItem | null>(() => {
    const currentNews = newsItems[currentIndex];
    if (!currentNews) {
      return null;
    }

    const description = getHatenaNewsDescription(currentNews);
    const newsId = getHatenaNewsId(currentNews, currentIndex);

    return {
      body: description,
      estimatedDuration: estimateReadingDurationSeconds(currentNews.title, description),
      newsId,
      title: currentNews.title,
    };
  }, [currentIndex, newsItems]);

  const currentAudioUrl = currentItem ? audioUrls[currentItem.newsId] ?? null : null;
  const currentAudioState = currentItem
    ? audioLoadingStates[currentItem.newsId] ?? "idle"
    : "idle";

  const handleNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, newsItems.length - 1));
  }, [newsItems.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  return {
    currentAudioState,
    currentAudioUrl,
    currentIndex,
    currentItem,
    handleNext,
    handlePrev,
    hasNext: currentIndex < newsItems.length - 1,
    hasPrev: currentIndex > 0,
    isPlaying,
    notification,
    setIsPlaying,
  };
}
