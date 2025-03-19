import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getDiaryEntryById, updateDiaryEntry, deleteDiaryEntry } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const id = Number.parseInt(params.id)
    const entry = await getDiaryEntryById(id)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Check if the entry belongs to the user
    if (entry.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching diary entry:", error)
    return NextResponse.json({ error: "Failed to fetch diary entry" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const id = Number.parseInt(params.id)
    const entry = await getDiaryEntryById(id)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Check if the entry belongs to the user
    if (entry.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    await updateDiaryEntry(id, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating diary entry:", error)
    return NextResponse.json({ error: "Failed to update diary entry" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const id = Number.parseInt(params.id)
    const entry = await getDiaryEntryById(id)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Check if the entry belongs to the user
    if (entry.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await deleteDiaryEntry(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting diary entry:", error)
    return NextResponse.json({ error: "Failed to delete diary entry" }, { status: 500 })
  }
}

