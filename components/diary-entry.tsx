"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { formatDistanceToNow } from "date-fns"
import { Disc, Album, MoreHorizontal, Edit, Trash2, Flag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DiaryEntryProps {
  id: string
  type: "track" | "album"
  title: string
  artist: string
  imageUrl: string
  rating: number
  review: string
  date: Date
  username: string
  userImage?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  explicitFilter?: boolean
}

// List of words to filter if explicit filter is on
const explicitWords = [
  "fuck",
  "shit",
  "ass",
  "damn",
  "bitch",
  "cunt",
  "dick",
  "cock",
  "pussy",
  "asshole",
  "bastard",
  "motherfucker",
]

export function DiaryEntry({
  id,
  type,
  title,
  artist,
  imageUrl,
  rating,
  review,
  date,
  username,
  userImage,
  onEdit,
  onDelete,
  explicitFilter = false,
}: DiaryEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter explicit content if needed
  const filteredReview = explicitFilter
    ? review
        .split(" ")
        .map((word) => {
          const lowerWord = word.toLowerCase().replace(/[^\w]/g, "")
          return explicitWords.includes(lowerWord) ? word.replace(/\w/g, "*") : word
        })
        .join(" ")
    : review

  const formattedDate = formatDistanceToNow(date, { addSuffix: true })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage || "/placeholder.svg?height=32&width=32"} alt={username} />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem>
                <Flag className="mr-2 h-4 w-4" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0">
        <div className="flex gap-3">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={imageUrl || "/placeholder.svg?height=96&width=96"}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {type === "track" ? (
                <Disc className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Album className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground capitalize">{type}</span>
            </div>

            <h3 className="font-medium mt-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>

            <div className="mt-2">
              <StarRating initialRating={rating} readOnly size="sm" />
            </div>
          </div>
        </div>

        {review && (
          <div className="mt-3">
            <p className={cn("text-sm", !isExpanded && "line-clamp-3")}>{filteredReview}</p>
            {review.length > 180 && (
              <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3">
        <div className="flex w-full justify-between items-center">
          <Button variant="ghost" size="sm" className="h-8">
            <Disc className="mr-2 h-4 w-4" />
            Listen on Spotify
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

