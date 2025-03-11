"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { DiaryEntry } from "@/components/diary-entry"
import { DiaryEntryForm } from "@/components/diary-entry-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, CalendarDays, BookOpen, Disc, Album } from "lucide-react"
import { format } from "date-fns"

// Mock data for diary entries
const mockDiaryEntries = [
  {
    id: "1",
    type: "track" as const,
    title: "Blinding Lights",
    artist: "The Weeknd",
    imageUrl: "/placeholder.svg?height=96&width=96",
    rating: 4.5,
    review:
      "This track has an amazing 80s vibe that I can't get enough of. The synths are perfect and the vocals are incredible. Definitely one of my favorite songs from The Weeknd.",
    date: new Date(2023, 5, 15),
    username: "User",
    userImage: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    type: "album" as const,
    title: "Rumours",
    artist: "Fleetwood Mac",
    imageUrl: "/placeholder.svg?height=96&width=96",
    rating: 5,
    review:
      "A classic album that never gets old. Every song is a masterpiece and the production is timeless. The harmonies and songwriting are just perfect. I can listen to this album on repeat for days.",
    date: new Date(2023, 4, 28),
    username: "User",
    userImage: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    type: "track" as const,
    title: "Bad Guy",
    artist: "Billie Eilish",
    imageUrl: "/placeholder.svg?height=96&width=96",
    rating: 4,
    review:
      "Such a unique sound and vibe. Billie's voice is haunting and the production is so minimal yet effective. The bass line is infectious!",
    date: new Date(2023, 4, 20),
    username: "User",
    userImage: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    type: "album" as const,
    title: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    imageUrl: "/placeholder.svg?height=96&width=96",
    rating: 5,
    review:
      "A masterpiece that blends jazz, funk, and hip-hop seamlessly. The lyrics are profound and the production is incredible. This album is a work of art that will be studied for generations.",
    date: new Date(2023, 3, 15),
    username: "User",
    userImage: "/placeholder.svg?height=32&width=32",
  },
]

export default function DiaryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [entries, setEntries] = useState(mockDiaryEntries)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [explicitFilter, setExplicitFilter] = useState(false)

  // Group entries by date
  const entriesByDate = entries.reduce(
    (acc, entry) => {
      const dateKey = format(entry.date, "yyyy-MM-dd")
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(entry)
      return acc
    },
    {} as Record<string, typeof entries>,
  )

  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  useEffect(() => {
    // Simulate loading user settings
    const timer = setTimeout(() => {
      // In a real app, we would fetch user settings here
      setExplicitFilter(false)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleAddEntry = (values: any) => {
    const newEntry = {
      id: Date.now().toString(),
      type: values.itemType,
      title: values.title,
      artist: values.artist,
      imageUrl: values.imageUrl,
      rating: values.rating,
      review: values.review,
      date: new Date(),
      username: session?.user?.name || "User",
      userImage: session?.user?.image || "/placeholder.svg?height=32&width=32",
    }

    setEntries([newEntry, ...entries])
    setIsAddDialogOpen(false)
  }

  const handleEditEntry = (id: string) => {
    setEditingEntry(id)
  }

  const handleUpdateEntry = (values: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === editingEntry
          ? {
              ...entry,
              type: values.itemType,
              title: values.title,
              artist: values.artist,
              imageUrl: values.imageUrl,
              rating: values.rating,
              review: values.review,
            }
          : entry,
      ),
    )
    setEditingEntry(null)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold md:text-3xl">Your Music Diary</h1>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Entries</TabsTrigger>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="albums">Albums</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-8">
                {sortedDates.length > 0 ? (
                  sortedDates.map((dateKey) => (
                    <div key={dateKey} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-medium">{format(new Date(dateKey), "MMMM d, yyyy")}</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {entriesByDate[dateKey].map((entry) => (
                          <DiaryEntry
                            key={entry.id}
                            {...entry}
                            onEdit={handleEditEntry}
                            onDelete={handleDeleteEntry}
                            explicitFilter={explicitFilter}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your diary is empty</h3>
                    <p className="text-muted-foreground mb-4">Start logging your favorite music to build your diary</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Entry
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tracks" className="mt-4 space-y-8">
                {entries.filter((e) => e.type === "track").length > 0 ? (
                  sortedDates
                    .filter((dateKey) => entriesByDate[dateKey].some((e) => e.type === "track"))
                    .map((dateKey) => (
                      <div key={dateKey} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-medium">{format(new Date(dateKey), "MMMM d, yyyy")}</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                          {entriesByDate[dateKey]
                            .filter((e) => e.type === "track")
                            .map((entry) => (
                              <DiaryEntry
                                key={entry.id}
                                {...entry}
                                onEdit={handleEditEntry}
                                onDelete={handleDeleteEntry}
                                explicitFilter={explicitFilter}
                              />
                            ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <Disc className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tracks in your diary</h3>
                    <p className="text-muted-foreground mb-4">Add some tracks to your diary to see them here</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Track
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="albums" className="mt-4 space-y-8">
                {entries.filter((e) => e.type === "album").length > 0 ? (
                  sortedDates
                    .filter((dateKey) => entriesByDate[dateKey].some((e) => e.type === "album"))
                    .map((dateKey) => (
                      <div key={dateKey} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-medium">{format(new Date(dateKey), "MMMM d, yyyy")}</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                          {entriesByDate[dateKey]
                            .filter((e) => e.type === "album")
                            .map((entry) => (
                              <DiaryEntry
                                key={entry.id}
                                {...entry}
                                onEdit={handleEditEntry}
                                onDelete={handleDeleteEntry}
                                explicitFilter={explicitFilter}
                              />
                            ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <Album className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No albums in your diary</h3>
                    <p className="text-muted-foreground mb-4">Add some albums to your diary to see them here</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Album
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DiaryEntryForm onSubmit={handleAddEntry} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {editingEntry && (
            <DiaryEntryForm
              onSubmit={handleUpdateEntry}
              onCancel={() => setEditingEntry(null)}
              initialValues={entries.find((e) => e.id === editingEntry)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

