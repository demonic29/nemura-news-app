import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/app/lib/config/firebase";
import { getVoiceOption, VoiceOption } from "@/app/lib/voices";

export async function saveUserVoicePreference(
  userId: string,
  voiceId: string,
): Promise<VoiceOption> {
  const voice = getVoiceOption(voiceId);

  await setDoc(
    doc(db, "users", userId),
    {
      voice: voice.id,
      speaker: voice.speaker,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return voice;
}

export function cacheVoicePreference(voice: VoiceOption): void {
  sessionStorage.setItem("selectedVoice", voice.id);
  sessionStorage.setItem("selectedSpeaker", voice.speaker);
}
