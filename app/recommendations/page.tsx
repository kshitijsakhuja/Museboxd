"use client"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { AIRecommendedTracks } from "@/components/ai-recommended-tracks"
import { RecommendedTracks } from "@/components/recommended-tracks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedBackground } from "@/components/animated-background"
import { Brain, Sparkles, Music } from "lucide-react"

export default function RecommendationsPage() {
  return (
    <AnimatedBackground>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6">
              <h1 className="text-2xl font-bold md:text-3xl mb-6">Music Recommendations</h1>

              <Tabs defaultValue="personalized" className="mb-6">
                <TabsList>
                  <TabsTrigger value="personalized" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span>Personalized</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Powered</span>
                  </TabsTrigger>
                  <TabsTrigger value="spotify" className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    <span>Spotify</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personalized" className="mt-4">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      These recommendations are personalized based on your listening history and diary entries. We
                      analyze your music taste to find songs you'll love.
                    </p>
                    <PersonalizedRecommendations />
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      AI-powered recommendations based on your recently played tracks.
                    </p>
                    <AIRecommendedTracks />
                  </div>
                </TabsContent>

                <TabsContent value="spotify" className="mt-4">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Recommendations from Spotify based on your listening history.
                    </p>
                    <RecommendedTracks />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AnimatedBackground>
  )
}

