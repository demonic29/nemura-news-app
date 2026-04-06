import axios from "axios";

export const playAudio = async (text: string, speaker: string) => {
    try {
        const responseAudio = await axios.post("/api/audio", {
            text,
            speaker,
        });

        const base64Audio = responseAudio?.data?.response;

        // Convert base64 → Blob (browser-safe)
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        const audioBlob = new Blob([bytes], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.volume = 1;
        await audio.play();
    } catch (e) {
        console.error("playAudio error:", e);
    }
};


// lib/ audio.ts
export const VOICES = [
    { id: "electronic", label: "電子的な声", speaker: "54", word: "電子的な声です" },
    { id: "cool", label: "冷静な声", speaker: "47", word: "冷静な声" },
    { id: "child", label: "子どもの声", speaker: "42", word: "子どもの声" },
    { id: "low", label: "低音な声", speaker: "13", word: "低音な声" },
    { id: "warm", label: "あたたかい声", speaker: "24", word: "あたたかい声" },
];