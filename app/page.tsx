// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User exists, check if onboarding is completed
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          if (userData?.onboardingCompleted) {
            router.replace("/home");
          } else {
            // User exists but didn't complete onboarding
            router.replace("/welcome");
          }
        } catch (error) {
          console.error("Error checking user data:", error);
          router.replace("/welcome");
        }
      } else {
        // No user, show welcome
        router.replace("/welcome");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white-soft">読み込み中...</p>
        </div>
      </div>
    );
  }

  return null;
}