import { NextResponse } from "next/server"
import { getSpotifyToken } from "@/lib/spotify"

export async function GET(request: Request, { params }: { params: { genre: string } }) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") || "20"
  const offset = searchParams.get("offset") || "0"
  const genre = params.genre

  try {
    const token = await getSpotifyToken()

    if (!token) {
      return NextResponse.json({ error: "Failed to get Spotify token" }, { status: 500 })
    }

    // First, get recommendations for the genre to find artists
    const recommendationsUrl = `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=100`
    const recommendationsResponse = await fetch(recommendationsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!recommendationsResponse.ok) {
      const errorData = await recommendationsResponse.text()
      console.error("Error fetching genre recommendations:", errorData)
      return NextResponse.json(
        { error: "Failed to fetch genre recommendations" },
        { status: recommendationsResponse.status },
      )
    }

    const recommendationsData = await recommendationsResponse.json()

    // Extract unique artist IDs from recommendations
    const artistIds = [
      ...new Set(recommendationsData.tracks.flatMap((track: any) => track.artists.map((artist: any) => artist.id))),
    ]

    // If we have artist IDs, get detailed artist info
    if (artistIds.length > 0) {
      // Spotify API allows up to 50 IDs in a single request
      const artistIdsChunk = artistIds.slice(0, 50).join(",")
      const artistsUrl = `https://api.spotify.com/v1/artists?ids=${artistIdsChunk}`

      const artistsResponse = await fetch(artistsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!artistsResponse.ok) {
        const errorData = await artistsResponse.text()
        console.error("Error fetching artists:", errorData)
        return NextResponse.json({ error: "Failed to fetch artists" }, { status: artistsResponse.status })
      }

      const artistsData = await artistsResponse.json()

      // Apply pagination to the results
      const limitNum = Number.parseInt(limit)
      const offsetNum = Number.parseInt(offset)
      const paginatedArtists = artistsData.artists.slice(offsetNum, offsetNum + limitNum)

      return NextResponse.json({
        artists: {
          items: paginatedArtists,
          total: artistsData.artists.length,
          limit: limitNum,
          offset: offsetNum,
        },
      })
    }

    // Fallback to search if no artists found in recommendations
    const searchUrl = `https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=${limit}&offset=${offset}`
    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!searchResponse.ok) {
      const errorData = await searchResponse.text()
      console.error("Error searching for genre artists:", errorData)
      return NextResponse.json({ error: "Failed to search for genre artists" }, { status: searchResponse.status })
    }

    const searchData = await searchResponse.json()
    return NextResponse.json(searchData)
  } catch (error) {
    console.error("Error in genre artists route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

