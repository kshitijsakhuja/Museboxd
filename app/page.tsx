import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { FriendActivity } from "@/components/friend-activity"
import { RecentlyPlayed } from "@/components/recently-played"
import { Discover } from "@/components/discover"

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
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">Home</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <RecentlyPlayed />
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

