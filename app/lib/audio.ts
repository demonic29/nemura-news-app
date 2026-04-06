import axios from "axios";

type AudioRouteResponse = {
  response?: string;
};

function decodeBase64Audio(base64Audio: string): Uint8Array {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export async function playAudio(text: string, speaker: string): Promise<void> {
  const { data } = await axios.post<AudioRouteResponse>("/api/audio", {
    text,
    speaker,
  });

  if (!data.response) {
    throw new Error("No audio data was returned from /api/audio.");
  }

  const audioBytes = decodeBase64Audio(data.response);
  const audioBuffer = new ArrayBuffer(audioBytes.byteLength);
  new Uint8Array(audioBuffer).set(audioBytes);

  const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  const revokeObjectUrl = () => URL.revokeObjectURL(audioUrl);

  audio.addEventListener("ended", revokeObjectUrl, { once: true });
  audio.addEventListener("error", revokeObjectUrl, { once: true });

  audio.volume = 1;
  await audio.play();
}
