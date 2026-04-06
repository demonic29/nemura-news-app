const DEFAULT_VOICEVOX_URL = "http://localhost:50021";

export const VOICEVOX_URL = process.env.VOICEVOX_URL ?? DEFAULT_VOICEVOX_URL;

export async function synthesizeVoice(
  text: string,
  speaker: string,
): Promise<Buffer> {
  const queryResponse = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!queryResponse.ok) {
    const errorText = await queryResponse.text();
    throw new Error(
      `Failed to create a VOICEVOX audio query: ${queryResponse.status} ${errorText}`,
    );
  }

  const audioQuery = await queryResponse.json();

  const synthesisResponse = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${speaker}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(audioQuery),
    },
  );

  if (!synthesisResponse.ok) {
    const errorText = await synthesisResponse.text();
    throw new Error(
      `Failed to synthesize VOICEVOX audio: ${synthesisResponse.status} ${errorText}`,
    );
  }

  return Buffer.from(await synthesisResponse.arrayBuffer());
}
