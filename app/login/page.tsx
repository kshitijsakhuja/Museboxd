"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Music2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await signIn("spotify", { callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Music2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Museboxd</CardTitle>
          <CardDescription>Connect with artists and discover music across platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Sign in with your Spotify account to continue</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Connecting..." : "Sign in with Spotify"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

