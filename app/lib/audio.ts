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
