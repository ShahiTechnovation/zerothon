"use client"

import { useState } from "react"
import { Search, Filter, SortDesc } from "lucide-react"

export function TemplateSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "tokens", name: "Tokens" },
    { id: "nft", name: "NFTs" },
    { id: "defi", name: "DeFi" },
    { id: "dao", name: "DAO" },
    { id: "gaming", name: "Gaming" },
    { id: "utility", name: "Utility" },
  ]

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "recent", name: "Recently Added" },
    { id: "rating", name: "Highest Rated" },
    { id: "downloads", name: "Most Downloaded" },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-3">
          <SortDesc className="w-5 h-5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-slate-400">Active filters:</span>
          {selectedCategory !== "all" && (
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
          {searchQuery && (
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
              "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  )
}
