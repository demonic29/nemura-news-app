import { NextRequest, NextResponse } from "next/server";

import { synthesizeVoice } from "@/app/lib/config/voicevox";

type AudioRequestBody = {
  speaker?: string;
  text?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { text, speaker } = (await req.json()) as AudioRequestBody;

    if (!text || !speaker) {
      return NextResponse.json(
        { error: "Both text and speaker are required." },
        { status: 400 },
      );
    }

    const audioBuffer = await synthesizeVoice(text, speaker);
    const base64Data = audioBuffer.toString("base64");

    return NextResponse.json({ response: base64Data });
  } catch (error) {
    console.error("Failed to synthesize voice preview:", error);
    return NextResponse.json(
      { error: "Failed to generate audio preview." },
      { status: 500 },
    );
  }
}
