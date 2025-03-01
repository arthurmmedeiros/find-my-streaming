import SearchBar from "@/components/search-bar"
import { Suspense } from "react"
import SearchResults from "@/components/search-results"

export default function Home({
  searchParams,
}: {
  searchParams: { query?: string }
}) {
  // const query = searchParams.query || ""

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Streaming Service Finder</h1>
        <p className="text-center text-muted-foreground mb-8">
          Find where to watch your favorite movies and TV shows across streaming platforms
        </p>

        <SearchBar initialQuery={searchParams.query ?? ''} />

        {/* {query && (
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        )} */}
      </div>
    </main>
  )
}

function SearchSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-[2/3] bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-full mt-4 animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

