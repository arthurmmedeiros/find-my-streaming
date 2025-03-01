"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Search } from "lucide-react"

const SearchBar = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("query", query)
    } else {
      params.delete("query")
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" /> */}
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          className="pl-10 py-6 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}        
        />
      </div>
      <button 
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 px-4"
        disabled={isPending || !query.trim()}>
        {isPending ? "Searching..." : "Search"}
      </button>
    </form>
  )
}

export default SearchBar;
