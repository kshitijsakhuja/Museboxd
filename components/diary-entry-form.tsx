"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResults {
  tracks: { items: any[] };
  albums: { items: any[] };
}

export function DiaryEntryForm() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    tracks: { items: [] },
    albums: { items: [] },
  });
  const [selectedItem, setSelectedItem] = useState<{ item: any; type: string } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    setSearchResults(data);
  };

  const handleSelectItem = (item: any, type: string) => {
    setSelectedItem({ item, type });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for a track or album..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Search Results */}
      <Tabs defaultValue="tracks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>

        {/* Tracks Tab */}
        <TabsContent value="tracks" className="mt-2">
          <ScrollArea className="h-[300px]">
            {searchResults.tracks?.items?.length > 0 ? (
              <div className="space-y-2">
                {searchResults.tracks.items.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectItem(track, "track")}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                        alt={track.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {track.name} - {track.artists.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">Track</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No tracks found</div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums" className="mt-2">
          <ScrollArea className="h-[300px]">
            {searchResults.albums?.items?.length > 0 ? (
              <div className="space-y-2">
                {searchResults.albums.items.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectItem(album, "album")}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                        alt={album.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {album.name} - {album.artists.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">Album</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No albums found</div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Selected Item Summary */}
      {selectedItem && (
        <div className="p-4 bg-muted rounded-md">
          <p className="font-medium">Selected {selectedItem.type === "track" ? "Track" : "Album"}:</p>
          <p className="text-sm">
            {selectedItem.item.name} - {selectedItem.item.artists.map((a: any) => a.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
