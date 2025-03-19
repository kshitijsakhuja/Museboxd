declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    userId?: string
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

