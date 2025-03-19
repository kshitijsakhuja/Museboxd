import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createDiaryEntry, getDiaryEntriesByUserId } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["itemId", "itemType", "title", "artist", "imageUrl", "rating"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create diary entry
    const entry = {
      userId: session.userId as string,
      itemId: data.itemId,
      itemType: data.itemType,
      title: data.title,
      artist: data.artist,
      imageUrl: data.imageUrl,
      rating: data.rating,
      review: data.review || "",
    }

    const result = await createDiaryEntry(entry)

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("Error creating diary entry:", error)
    return NextResponse.json({ error: "Failed to create diary entry" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const entries = await getDiaryEntriesByUserId(session.userId as string)
    return NextResponse.json(entries)
  } catch (error) {
    console.error("Error fetching diary entries:", error)
    return NextResponse.json({ error: "Failed to fetch diary entries" }, { status: 500 })
  }
}

