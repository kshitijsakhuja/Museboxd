// Update the home page to include the AI-powered recommended tracks section

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FriendActivity } from "@/components/friend-activity"
import { RecentlyPlayed } from "@/components/recently-played"
//import { RecommendedTracks } from "@/components/recommended-tracks"
import { AIRecommendedTracks } from "@/components/ai-recommended-tracks"
import { Discover } from "@/components/discover"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold md:text-3xl">Home</h1>
              <Button asChild>
                <Link href="/recommendations" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  View All Recommendations
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <RecentlyPlayed />
                  <AIRecommendedTracks />
                  <Discover />
                </div>
              </div>
              <div className="hidden lg:block">
                <FriendActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

