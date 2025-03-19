"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPlaylist, getPlaylistTracks } from "@/lib/spotify"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Playlist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
  }
  duration_ms: number
}

export default function PlaylistPage() {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlaylistData() {
      try {
        const playlistData = await getPlaylist(id as string)
        setPlaylist(playlistData)

        const tracksData = await getPlaylistTracks(id as string)
        setTracks(tracksData.items.map((item: any) => item.track))
      } catch (error) {
        console.error("Failed to fetch playlist data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylistData()
  }, [id])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <TopBar />
          <div className="container mx-auto p-4 md:p-6">
            {loading ? (
              <p>Loading playlist...</p>
            ) : playlist ? (
              <>
                <div className="mb-6 flex items-center gap-6">
                  <div className="h-40 w-40 overflow-hidden rounded-md">
                    <img
                      src={playlist.images[0]?.url || "/placeholder.svg?height=160&width=160"}
                      alt={playlist.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{playlist.name}</h1>
                    <p className="mt-2 text-muted-foreground">{playlist.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{playlist.tracks.total} tracks</p>
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Tracks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Album</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tracks.map((track) => (
                          <TableRow key={track.id}>
                            <TableCell>{track.name}</TableCell>
                            <TableCell>{track.artists.map((a) => a.name).join(", ")}</TableCell>
                            <TableCell>{track.album.name}</TableCell>
                            <TableCell>{formatDuration(track.duration_ms)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p>Playlist not found</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

