import { getSearchResults } from "@/lib/tmdb"
import Image from "next/image"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Tv, Film } from "lucide-react"
import StreamingProviders from "@/components/streaming-providers"

export default async function SearchResults({ query }: { query: string }) {
  const results = await getSearchResults(query)

  if (results.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg">No results found for &quot;{query}&quot;</p>
        <p className="text-muted-foreground">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Results for &quot;{query}&quot;</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <div key={item.id} className="overflow-hidden">
            <div className="relative aspect-[2/3] w-full">
              {item.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name || 'img'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            <div className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg line-clamp-1">{item.title || item.name}</h3>
                <div  className="ml-2 shrink-0">
                  {/* {item.media_type === "tv" ? <Tv className="h-3 w-3 mr-1" /> : <Film className="h-3 w-3 mr-1" />} */}
                  {item.media_type === "tv" ? "TV" : "Movie"}
                </div>
              </div>
              {/* <p className="text-sm text-muted-foreground">
                {item.release_date || item.first_air_date
                  ? new Date(item.release_date || item.first_air_date).getFullYear()
                  : "Unknown year"}
              </p> */}
            </div>
            <div>
              <StreamingProviders mediaType={item.media_type} id={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

