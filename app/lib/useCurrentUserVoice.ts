'use client'

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/app/lib/config/firebase";
import { DEFAULT_VOICE, getVoiceOption, VoiceOption } from "@/app/lib/voices";

type CurrentUserVoiceState = {
  loading: boolean;
  voice: VoiceOption;
};

export function useCurrentUserVoice() {
  const [state, setState] = useState<CurrentUserVoiceState>({
    loading: true,
    voice: DEFAULT_VOICE,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, voice: DEFAULT_VOICE });
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userVoiceId =
          userDoc.data()?.aiVoice ||
          userDoc.data()?.voice ||
          userDoc.data()?.selectedVoice;

        setState({
          loading: false,
          voice: getVoiceOption(userVoiceId),
        });
      } catch (error) {
        console.error("Failed to load the current user's voice:", error);
        setState({ loading: false, voice: DEFAULT_VOICE });
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    loading: state.loading,
    selectedVoice: state.voice.id,
    selectedSpeaker: state.voice.speaker,
    voiceOption: state.voice,
  };
}
