"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getNewReleases } from "@/lib/spotify"

interface Album {
  id: string
  name: string
  artists: Array<{ name: string }>
  images: Array<{ url: string }>
  album_type: string
  external_urls: {
    spotify: string
  }
}

export function Discover() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const data = await getNewReleases()
        if (data && data.albums && data.albums.items) {
          setAlbums(data.albums.items)
        }
      } catch (err) {
        setError("Failed to load new releases")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewReleases()
  }, [])

  const fallbackData = [
    {
      id: "1",
      name: "Currents",
      artists: [{ name: "Tame Impala" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Psychedelic Pop",
      external_urls: { spotify: "#" },
    },
    {
      id: "2",
      name: "Blonde",
      artists: [{ name: "Frank Ocean" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "R&B",
      external_urls: { spotify: "#" },
    },
    {
      id: "3",
      name: "To Pimp a Butterfly",
      artists: [{ name: "Kendrick Lamar" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Hip-Hop",
      external_urls: { spotify: "#" },
    },
    {
      id: "4",
      name: "Norman F*cking Rockwell",
      artists: [{ name: "Lana Del Rey" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Alternative",
      external_urls: { spotify: "#" },
    },
    {
      id: "5",
      name: "Random Access Memories",
      artists: [{ name: "Daft Punk" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Electronic",
      external_urls: { spotify: "#" },
    },
    {
      id: "6",
      name: "Fetch the Bolt Cutters",
      artists: [{ name: "Fiona Apple" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Alternative",
      external_urls: { spotify: "#" },
    },
  ]

  const displayData = albums.length > 0 ? albums : fallbackData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover</CardTitle>
        <CardDescription>New Releases</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-4">
            {displayData.map((item) => (
              <div key={item.id} className="w-[150px] space-y-2">
                <a
                  href={item.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={item.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                      alt={`${item.name} by ${item.artists[0]?.name}`}
                      className="aspect-square h-auto w-full object-cover transition-all group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium leading-none group-hover:underline">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.album_type}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button variant="outline" className="mt-4 w-full">
          View More Recommendations
        </Button>
      </CardContent>
    </Card>
  )
}
