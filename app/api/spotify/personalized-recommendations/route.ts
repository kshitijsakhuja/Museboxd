const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const recentlyPlayedResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!recentlyPlayedResponse.ok) {
      const errorData = await recentlyPlayedResponse.text()
      console.error("Error fetching recently played tracks:", errorData)
      return NextResponse.json(
        { error: "Failed to fetch recently played tracks" },
        { status: recentlyPlayedResponse.status },
      )
    }

    const recentlyPlayedData = await recentlyPlayedResponse.json()
    const recentTracks = recentlyPlayedData.items.map((item: any) => ({
      name: item.track.name,
      artist: item.track.artists.map((a: any) => a.name).join(", "),
      album: item.track.album.name,
      popularity: item.track.popularity,
      id: item.track.id,
    }))

    const trackIds = recentTracks.map((track: any) => track.id).join(",")
    const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!audioFeaturesResponse.ok) {
      console.error("Error fetching audio features:", await audioFeaturesResponse.text())
    } else {
      const audioFeaturesData = await audioFeaturesResponse.json()
      if (audioFeaturesData.audio_features) {
        audioFeaturesData.audio_features.forEach((features: any, index: number) => {
          if (features && recentTracks[index]) {
            recentTracks[index].features = {
              danceability: features.danceability,
              energy: features.energy,
              tempo: features.tempo,
              valence: features.valence,
            }
          }
        })
      }
    }

    const prompt = `
      I need music recommendations based on a user's recently played tracks.
      Here are the user's recently played tracks:
      ${JSON.stringify(recentTracks, null, 2)}
      Based on these tracks, identify patterns in the user's music taste (genres, moods, artists, etc.) 
      and recommend 8 specific songs that they might enjoy but haven't listened to recently.
      For each recommendation, provide:
      1. Song name
      2. Artist name
      3. A brief reason why they might like it based on their listening history
      Format your response as a JSON array with this structure:
      [
        {
          "name": "Song Name",
          "artist": "Artist Name",
          "reason": "Brief reason for recommendation"
        }
      ]
      Only return the JSON array, nothing else.
    `

    // Call the Gemini model to get recommendations
    const aiRecommendations = await model.generate({ prompt, temperature: 0.7, maxTokens: 1000 });

    let recommendations
    try {
      recommendations = JSON.parse(aiRecommendations.text);
    } catch (error) {
      console.error("Error parsing AI recommendations:", error)
      return NextResponse.json({ error: "Failed to parse AI recommendations" }, { status: 500 })
    }

    const enhancedRecommendations = []

    for (const rec of recommendations) {
      const searchQuery = `track:${rec.name} artist:${rec.artist}`
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      )

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        if (searchData.tracks && searchData.tracks.items.length > 0) {
          const track = searchData.tracks.items[0]
          enhancedRecommendations.push({
            id: track.id,
            name: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            albumArt: track.album.images[0]?.url,
            reason: rec.reason,
            uri: track.uri,
          })
        } else {
          enhancedRecommendations.push({
            id: `ai-rec-${enhancedRecommendations.length}`,
            name: rec.name,
            artist: rec.artist,
            reason: rec.reason,
            albumArt: "/placeholder.svg?height=150&width=150",
          })
        }
      }
    }

    return NextResponse.json({ recommendations: enhancedRecommendations })
  } catch (error) {
    console.error("Error in AI recommendations route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}