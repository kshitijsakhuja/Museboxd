"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface FriendActivityItem {
  id: string
  name: string
  avatar: string
  song: string
  artist: string
  time: string
}

export function FriendActivity() {
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock data for friend activity
  const mockFriendActivity: FriendActivityItem[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      song: "Starlight",
      artist: "Muse",
      time: "2m ago",
    },
    {
      id: "2",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      song: "Levitating",
      artist: "Dua Lipa",
      time: "15m ago",
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      song: "Circles",
      artist: "Post Malone",
      time: "32m ago",
    },
    {
      id: "4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      song: "Watermelon Sugar",
      artist: "Harry Styles",
      time: "1h ago",
    },
    {
      id: "5",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      song: "Blinding Lights",
      artist: "The Weeknd",
      time: "2h ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Friend Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : mockFriendActivity.length > 0 ? (
          <div className="space-y-4">
            {mockFriendActivity.map((friend) => (
              <div key={friend.id} className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Listening to <span className="font-medium">{friend.song}</span> by {friend.artist}
                  </p>
                  <p className="text-xs text-muted-foreground">{friend.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No friend activity to show</p>
        )}
      </CardContent>
    </Card>
  )
}

