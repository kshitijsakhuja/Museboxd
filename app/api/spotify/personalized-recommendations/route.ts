import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
//import { generateText } from "ai"
//import { openai } from "@ai-sdk/openai"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // 1. Get user's diary entries
    const diaryEntries = (await executeQuery({
      query: `
        SELECT itemId, itemType, title, artist, rating 
        FROM diary_entries 
        WHERE userId = ? 
        ORDER BY rating DESC, createdAt DESC
        LIMIT 10
      `,
      values: [session.userId],
    })) as any[]

    // 2. Get user's recently played tracks from Spotify
    const recentlyPlayedResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=20", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!recentlyPlayedResponse.ok) {
      console.error("Error fetching recently played tracks:", await recentlyPlayedResponse.text())
      // Continue with just diary entries if Spotify API fails
    }

    let recentlyPlayed: any[] = []
    if (recentlyPlayedResponse.ok) {
      const recentlyPlayedData = await recentlyPlayedResponse.json()
      recentlyPlayed = recentlyPlayedData.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(", "),
        played_at: item.played_at,
      }))
    }

    // 3. Get user's top tracks and artists
    const topTracksResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    let topTracks: any[] = []
    if (topTracksResponse.ok) {
      const topTracksData = await topTracksResponse.json()
      topTracks = topTracksData.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(", "),
        popularity: track.popularity,
      }))
    }

    const topArtistsResponse = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    let topArtists: any[] = []
    if (topArtistsResponse.ok) {
      const topArtistsData = await topArtistsResponse.json()
      topArtists = topArtistsData.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
      }))
    }

    // 4. Use AI to analyze user's music taste and generate recommendations
    const userProfile = {
      diaryEntries,
      recentlyPlayed,
      topTracks,
      topArtists,
    }

    const prompt = `
      I need personalized music recommendations for a user based on their music profile.
      
      Here is the user's music profile:
      ${JSON.stringify(userProfile, null, 2)}
      
      Based on this profile, please:
      1. Analyze their music taste (preferred genres, artists, mood preferences, etc.)
      2. Identify patterns in their listening habits
      3. Recommend 8 specific songs they might enjoy but haven't been mentioned in their profile
      4. For each recommendation, provide:
         - Song name
         - Artist name
         - A brief explanation of why this recommendation matches their taste
         - A confidence score (1-10) for how well this matches their taste
      
      Format your response as a JSON array with this structure:
      [
        {
          "name": "Song Name",
          "artist": "Artist Name",
          "reason": "Brief explanation of why this matches their taste",
          "confidence": 8
        }
      ]
      
      Only return the JSON array, nothing else.
    `

    const { text: aiRecommendations } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Parse the AI recommendations
    let recommendations
    try {
      recommendations = JSON.parse(aiRecommendations)
    } catch (error) {
      console.error("Error parsing AI recommendations:", error)
      return NextResponse.json({ error: "Failed to parse AI recommendations" }, { status: 500 })
    }

    // 5. For each recommendation, search Spotify to get the actual track data
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
            confidence: rec.confidence,
            uri: track.uri,
            previewUrl: track.preview_url,
          })
        } else {
          // If no exact match found, still include the AI recommendation
          enhancedRecommendations.push({
            id: `ai-rec-${enhancedRecommendations.length}`,
            name: rec.name,
            artist: rec.artist,
            reason: rec.reason,
            confidence: rec.confidence,
            albumArt: "/placeholder.svg?height=150&width=150",
          })
        }
      }
    }

    // 6. Save recommendations to database for future reference
    for (const rec of enhancedRecommendations) {
      if (rec.id.startsWith("ai-rec-")) continue // Skip recommendations without Spotify IDs

      try {
        await executeQuery({
          query: `
            INSERT INTO recommendations 
            (userId, trackId, trackName, artist, reason, confidence, albumArt, previewUrl) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            reason = VALUES(reason), 
            confidence = VALUES(confidence),
            createdAt = NOW()
          `,
          values: [
            session.userId,
            rec.id,
            rec.name,
            rec.artist,
            rec.reason,
            rec.confidence,
            rec.albumArt,
            rec.previewUrl || null,
          ],
        })
      } catch (error) {
        console.error("Error saving recommendation:", error)
        // Continue with other recommendations
      }
    }

    return NextResponse.json({ recommendations: enhancedRecommendations })
  } catch (error) {
    console.error("Error in personalized recommendations route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

