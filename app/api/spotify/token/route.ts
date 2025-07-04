import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Spotify credentials" }, { status: 500 })
  }

  try {
    const authString = `${clientId}:${clientSecret}`
    const authBase64 = Buffer.from(authString).toString("base64")

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authBase64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Error fetching token:", errorData)
      return NextResponse.json({ error: "Failed to fetch token" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({ access_token: data.access_token })
  } catch (error) {
    console.error("Error in token route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

