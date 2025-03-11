import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Get all users who have logged in recently (last 7 days)
    const recentlyActiveUsers = await prisma.user.findMany({
      where: {
        lastActivity: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        id: {
          not: session.userId as string, // Exclude current user
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        lastActivity: true,
        listeningHistory: {
          orderBy: {
            playedAt: "desc",
          },
          take: 1,
          select: {
            trackName: true,
            artistName: true,
            albumImage: true,
            playedAt: true,
          },
        },
      },
      orderBy: {
        lastActivity: "desc",
      },
      take: 10,
    })

    // Format the data for the frontend
    const friendActivity = recentlyActiveUsers
      .filter((user) => user.listeningHistory.length > 0) // Only include users with listening history
      .map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.image || "/placeholder.svg?height=40&width=40",
        song: user.listeningHistory[0].trackName,
        artist: user.listeningHistory[0].artistName,
        time: formatTimeAgo(user.listeningHistory[0].playedAt),
      }))

    return NextResponse.json(friendActivity)
  } catch (error) {
    console.error("Error in friend activity route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return `${diffSecs}s ago`
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return `${diffDays}d ago`
  }
}

