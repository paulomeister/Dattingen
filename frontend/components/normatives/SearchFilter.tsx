"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchField: string
  setSearchField: (field: string) => void
}

export function SearchFilter({ searchQuery, setSearchQuery }: SearchFilterProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="relative w-full md:w-auto md:flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder=""
          className="pl-10 pr-4 border-primary border-opacity-20 focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


    </div>
  )
}