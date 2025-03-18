import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const limit = searchParams.get("limit") || "50"
  const offset = searchParams.get("offset") || "0"

  if (!limit) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const url = `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Error searching Spotify:", errorData)
      return NextResponse.json({ error: "Failed to search Spotify" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in search route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
