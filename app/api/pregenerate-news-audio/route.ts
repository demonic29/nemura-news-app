// api / pregenerate-news-audio / route.ts

import { NextRequest, NextResponse } from "next/server"

import { supabase } from "@/app/lib/config/supabase"
import { synthesizeVoice } from "@/app/lib/config/voicevox"

type PregenerateNewsAudioBody = {
  description?: string
  newsId?: string
  speaker?: string
  title?: string
}

type AppError = Error & {
  stack?: string
}

export async function POST(req: NextRequest) {
  try {
    const { newsId, title, description, speaker } =
      (await req.json()) as PregenerateNewsAudioBody

    // Validate required fields
    if (!title || !description || !speaker) {
      console.error("Missing required fields:", { newsId, title, description, speaker })
      return NextResponse.json(
        { error: "Missing required fields: title, description, and speaker are required" },
        { status: 400 }
      )
    }

    // Validate description length
    if (description.trim().length < 10) {
      console.error("Description too short:", description)
      return NextResponse.json(
        { error: "Description must be at least 10 characters long" },
        { status: 400 }
      )
    }

    // Use newsId or generate a fallback
    const effectiveNewsId = newsId || `news-${Date.now()}`
    const fullText = `${title}。${description}`
    const textHash = hashText(fullText)

    console.log("Processing audio generation:", {
      newsId: effectiveNewsId,
      speaker,
      textLength: fullText.length,
      textHash
    })

    // Check if audio already exists in cache
    const { data: existing, error: fetchError } = await supabase
      .from("news_audio_cache")
      .select("audio_url, id")
      .eq("text_hash", textHash)
      .eq("speaker", speaker)
      .maybeSingle()

    if (fetchError) {
      console.error("Error checking cache:", fetchError)
    }

    if (existing?.audio_url) {
      console.log("Found cached audio:", existing.audio_url)
      return NextResponse.json({
        success: true,
        audioUrl: existing.audio_url,
        cached: true
      })
    }

    // Generate audio with VoiceVox
    console.log("Generating new audio with VoiceVox...")
    const audioBuffer = await synthesizeVoice(fullText, speaker)
    
    // Upload to Supabase Storage
    const fileName = `${effectiveNewsId}-${speaker}-${Date.now()}.wav`
    console.log("Uploading to Supabase Storage:", fileName)
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("news-audio")
      .upload(fileName, audioBuffer, {
        contentType: "audio/wav",
        upsert: true
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error(`Failed to upload audio: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("news-audio")
      .getPublicUrl(fileName)

    console.log("Audio uploaded successfully:", publicUrl)

    // Store in cache table
    const { error: insertError } = await supabase
      .from("news_audio_cache")
      .insert({
        news_id: effectiveNewsId,
        text_hash: textHash,
        speaker: speaker,
        audio_url: publicUrl,
        title: title,
        description: description
      })

    if (insertError) {
      console.error("Cache insert error:", insertError)
      // Don't fail the request if cache insert fails
    }

    return NextResponse.json({
      success: true,
      audioUrl: publicUrl,
      cached: false
    })

  } catch (error) {
    const appError = error as AppError
    console.error("Error generating audio:", error)
    return NextResponse.json(
      { 
        error: appError.message || "Failed to generate audio",
        details: process.env.NODE_ENV === 'development' ? appError.stack : undefined
      },
      { status: 500 }
    )
  }
}

function hashText(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
