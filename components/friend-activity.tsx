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

  // ✅ Expanded Friend Activity List (Indian Names + Songs)
  const mockFriendActivity: FriendActivityItem[] = [
    {
      id: "1",
      name: "Rahul Sharma",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      song: "Kesariya",
      artist: "Arijit Singh",
      time: "2m ago",
    },
    {
      id: "2",
      name: "Priya Singh",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
      song: "Ranjha",
      artist: "B Praak",
      time: "12m ago",
    },
    {
      id: "3",
      name: "Arjun Mehta",
      avatar: "https://randomuser.me/api/portraits/men/20.jpg",
      song: "Chaleya",
      artist: "Arijit Singh",
      time: "30m ago",
    },
    {
      id: "4",
      name: "Sneha Gupta",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
      song: "Pasoori",
      artist: "Ali Sethi, Shae Gill",
      time: "1h ago",
    },
    {
      id: "5",
      name: "Amit Patel",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      song: "Apna Bana Le",
      artist: "Arijit Singh",
      time: "2h ago",
    },
    {
      id: "6",
      name: "Nikita Verma",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg",
      song: "Galliyan Returns",
      artist: "Ankit Tiwari",
      time: "3h ago",
    },
    {
      id: "7",
      name: "Vikram Khanna",
      avatar: "https://randomuser.me/api/portraits/men/27.jpg",
      song: "Namo Namo",
      artist: "Amit Trivedi",
      time: "4h ago",
    },
    {
      id: "8",
      name: "Anjali Sharma",
      avatar: "https://randomuser.me/api/portraits/women/30.jpg",
      song: "Raataan Lambiyan",
      artist: "Jubin Nautiyal",
      time: "5h ago",
    },
    {
      id: "9",
      name: "Rohan Gupta",
      avatar: "https://randomuser.me/api/portraits/men/30.jpg",
      song: "Lut Gaye",
      artist: "Jubin Nautiyal",
      time: "6h ago",
    },
    {
      id: "10",
      name: "Simran Kaur",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      song: "Tera Yaar Hoon Main",
      artist: "Arijit Singh",
      time: "7h ago",
    },
    {
      id: "11",
      name: "Kunal Rajput",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      song: "O Bedardeya",
      artist: "Arijit Singh",
      time: "8h ago",
    },
    {
      id: "12",
      name: "Shruti Tiwari",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      song: "Jhoome Jo Pathaan",
      artist: "Arijit Singh",
      time: "9h ago",
    },
    {
      id: "13",
      name: "Rajesh Malhotra",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      song: "Gallan Goodiyan",
      artist: "Diljit Dosanjh",
      time: "10h ago",
    },
    {
      id: "14",
      name: "Meera Sharma",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      song: "Kesariya",
      artist: "Arijit Singh",
      time: "11h ago",
    },
    {
      id: "15",
      name: "Ayaan Khan",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      song: "Heeriye",
      artist: "Jasleen Royal",
      time: "12h ago",
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
            {mockFriendActivity.map((friend, index) => (
              <div
                key={friend.id}
                className="flex items-start gap-3 hover:bg-gray-100 p-2 rounded-lg transition duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Friend Activity Info */}
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {index % 2 === 0 ? (
                      <>Listening to <span className="font-medium">{friend.song}</span> by {friend.artist}</>
                    ) : (
                      <>Listened to <span className="font-medium">{friend.song}</span> by {friend.artist}</>
                    )}
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
