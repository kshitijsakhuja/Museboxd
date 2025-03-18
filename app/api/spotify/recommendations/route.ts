[/*import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // First, get the user's recently played tracks
    const recentlyPlayedResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
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

    // Extract track IDs, artist IDs, and genres for seed data
    const trackIds = recentlyPlayedData.items
      .slice(0, 2)
      .map((item: any) => item.track.id)
      .join(",")

    const artistIds = recentlyPlayedData.items
      .slice(0, 2)
      .map((item: any) => item.track.artists[0].id)
      .join(",")

    // Get recommendations based on these seeds
    const recommendationsUrl = `https://api.spotify.com/v1/recommendations?seed_tracks=${trackIds}&seed_artists=${artistIds}&limit=10`

    const recommendationsResponse = await fetch(recommendationsUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!recommendationsResponse.ok) {
      const errorData = await recommendationsResponse.text()
      console.error("Error fetching recommendations:", errorData)
      return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: recommendationsResponse.status })
    }

    const recommendationsData = await recommendationsResponse.json()
    return NextResponse.json(recommendationsData)
  } catch (error) {
    console.error("Error in recommendations route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
/*} 
