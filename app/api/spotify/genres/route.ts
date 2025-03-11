import { NextResponse } from "next/server"
import { getSpotifyToken } from "@/lib/spotify"

export async function GET() {
  try {
    const token = await getSpotifyToken()

    if (!token) {
      return NextResponse.json({ error: "Failed to get Spotify token" }, { status: 500 })
    }

    const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Error fetching genres:", errorData)
      return NextResponse.json({ error: "Failed to fetch genres" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in genres route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

