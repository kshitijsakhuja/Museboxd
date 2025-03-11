"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // User settings
  const [username, setUsername] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [filterExplicit, setFilterExplicit] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login")
    }

    // Simulate loading user settings
    if (status === "authenticated") {
      setTimeout(() => {
        setUsername(session?.user?.name || "")
        // In a real app, we would fetch these settings from an API
        setIsPrivate(false)
        setFilterExplicit(false)
        setEmailNotifications(true)
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router, session])

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1500)
  }

  const handleSavePrivacy = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been updated successfully.",
      })
    }, 1500)
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
            <div className="flex items-center gap-2 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your profile information and account settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={session?.user?.image || "/placeholder.svg?height=80&width=80"}
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>{username.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{session?.user?.name}</h3>
                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={session?.user?.email || ""} disabled />
                        <p className="text-xs text-muted-foreground">Your email is managed by your Spotify account</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Manage your privacy settings and content filters.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="private-account">Private Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Only approved followers can see your diary entries
                        </p>
                      </div>
                      <Switch id="private-account" checked={isPrivate} onCheckedChange={setIsPrivate} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="filter-explicit">Filter Explicit Content</Label>
                        <p className="text-sm text-muted-foreground">Hide explicit language in reviews and comments</p>
                      </div>
                      <Switch id="filter-explicit" checked={filterExplicit} onCheckedChange={setFilterExplicit} />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      {filterExplicit ? (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        {filterExplicit
                          ? "Explicit content will be filtered in reviews and comments"
                          : "Explicit content will be shown in reviews and comments"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSavePrivacy} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email notifications about activity</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Preferences</h3>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-followers">New followers</Label>
                        <Switch id="new-followers" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="comments">Comments on your entries</Label>
                        <Switch id="comments" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="mentions">Mentions</Label>
                        <Switch id="mentions" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveNotifications} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

