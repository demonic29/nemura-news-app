"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";

import Background from "@/components/Background";
import LottiePlayer from "@/components/LottiePlayer";

import {
  ArrowRightIcon,
  AddCircleIcon,
  RemoveCircleIcon
} from "@/assets/icons";

import smileJson from "@/assets/animations/smile-nemura.json";

// firebase
import { auth, db } from "@/app/lib/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TopicSelectionPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chooseTopics, setChooseTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/hatena?type=popular")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setChooseTopics(data);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = async () => {
    if (selectedTopics.length === 0) {
      setError("最低1つ選んでください");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create anonymous user
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Save user data with topics
      await setDoc(doc(db, "users", user.uid), {
        onboardingCompleted: true,
        topics: selectedTopics,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.replace("/welcome/choose-voice");
    } catch (e) {
      console.error("Error:", e);
      setError("保存に失敗しました");
      setSubmitting(false);
    }
  };

  const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();

  const uniqueTopics = Array.from(
    new Map(
      chooseTopics
        .flatMap((t) => {
          const subject = t["dc:subject"];
          const subjects = Array.isArray(subject) ? subject : [subject];
          return subjects
            .filter((s) => typeof s === "string")
            .map((s) => [normalize(s), { ...t, "dc:subject": s }]);
        })
    ).values()
  );

  return (
    <Background>
      <div className="relative w-full h-[100dvh] flex flex-col items-center overflow-hidden">
        <div className="mt-[50%] w-full px-8 space-y-2 z-10">
          <h1 className="text-white-soft text-[20px] font-bold tracking-tight leading-tight text-left drop-shadow-white-glow-str">
            あなたが気になる話題はなんですか？
          </h1>
          <p className="text-white-soft text-[15px] text-left">
            あとから設定で変えられます
          </p>
        </div>

        {error && (
          <div className="mt-4 px-6 w-full max-w-[420px] z-10">
            <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-4 rounded-lg">
              {error}
            </p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-3 w-full px-6 max-w-[420px] z-10">
          {loading ? (
            <p className="text-white-soft col-span-2 text-center">読み込み中...</p>
          ) : (
            uniqueTopics.slice(0, 8).map((topic) => {
              const isSelected = selectedTopics.includes(topic["dc:subject"]);
              return (
                <button
                  key={topic["dc:subject"]}
                  onClick={() => toggleTopic(topic["dc:subject"])}
                  disabled={submitting}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 active:scale-95
                    ${isSelected
                      ? "bg-button text-white-soft border-transparent drop-shadow-white-glow"
                      : "bg-white-soft text-gray-soft border-transparent"}
                    ${submitting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isSelected ? (
                    <RemoveCircleIcon className=" shrink-0" />
                  ) : (
                    <AddCircleIcon className=" shrink-0 text-gray-soft" />
                  )}
                  <span className="text-[15px] font-bold truncate">
                    {topic["dc:subject"]}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-10 w-full px-8 flex justify-between items-center z-20">
          <button
            onClick={() => router.push("/welcome?index=4")}
            disabled={submitting}
            className={`
              flex items-center gap-1 text-white-soft bg-button backdrop-blur-md border border-white/0 px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 drop-shadow-white-glow
              ${submitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ArrowRightIcon className="rotate-180" />
            <span className="text-[16px]">もどる</span>
          </button>

          <button
            onClick={handleNext}
            disabled={selectedTopics.length === 0 || submitting}
            className={`
              flex items-center gap-1 px-6 py-2.5 rounded-full font-bold transition-all
              ${selectedTopics.length === 0 || submitting
                ? "opacity-50 cursor-not-allowed bg-button"
                : "text-white-soft bg-button active:scale-95 drop-shadow-white-glow"
              }
            `}
          >
            <span className="text-[16px]">
              {submitting ? "保存中..." : "次へ"}
            </span>
            {!submitting && <ArrowRightIcon />}
          </button>
        </div>

        <div className="absolute bottom-[-100px] w-full flex justify-center pointer-events-none z-0">
          <LottiePlayer data={smileJson} width={360} height={360} />
        </div>
      </div>
    </Background>
  );
}