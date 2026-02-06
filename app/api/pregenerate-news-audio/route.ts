import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase/supabase"

const VOICEVOX_URL = process.env.VOICEVOX_URL || "http://localhost:50021"

export async function POST(req: NextRequest) {
  try {
    const { newsId, title, description, speaker } = await req.json()

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
    const audioBuffer = await generateAudioWithVoiceVox(fullText, speaker)
    
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

  } catch (error: any) {
    console.error("Error generating audio:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate audio",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

async function generateAudioWithVoiceVox(text: string, speaker: string): Promise<Buffer> {
  try {
    console.log(`Querying VoiceVox at ${VOICEVOX_URL}...`)
    
    // Query audio
    const queryResponse = await fetch(
      `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    
    if (!queryResponse.ok) {
      const errorText = await queryResponse.text()
      console.error("VoiceVox query error:", queryResponse.status, errorText)
      throw new Error(`Failed to query audio from VoiceVox: ${queryResponse.status} - ${errorText}`)
    }

    const audioQuery = await queryResponse.json()
    console.log("Audio query successful, synthesizing...")

    // Synthesize audio
    const synthesisResponse = await fetch(
      `${VOICEVOX_URL}/synthesis?speaker=${speaker}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audioQuery)
      }
    )

    if (!synthesisResponse.ok) {
      const errorText = await synthesisResponse.text()
      console.error("VoiceVox synthesis error:", synthesisResponse.status, errorText)
      throw new Error(`Failed to synthesize audio from VoiceVox: ${synthesisResponse.status} - ${errorText}`)
    }

    console.log("Audio synthesis successful")
    return Buffer.from(await synthesisResponse.arrayBuffer())
    
  } catch (error: any) {
    console.error("VoiceVox generation error:", error)
    throw new Error(`VoiceVox error: ${error.message}`)
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