import { NextResponse } from "next/server"
import { getSpotifyToken } from "@/lib/spotify"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const albumId = params.id

  try {
    const token = await getSpotifyToken()

    if (!token) {
      return NextResponse.json({ error: "Failed to get Spotify token" }, { status: 500 })
    }

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Error fetching album:", errorData)
      return NextResponse.json({ error: "Failed to fetch album" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in album route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

