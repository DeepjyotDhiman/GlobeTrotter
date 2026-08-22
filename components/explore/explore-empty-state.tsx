import React from "react";
import { SearchX, RotateCcw, Compass } from "lucide-react";

interface ExploreEmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  icon?: "search" | "compass";
}

export function ExploreEmptyState({
  title = "No matches found",
  description = "We couldn't find any destinations matching your filters. Try clearing your filters or adjusting your search term.",
  onResetFilters,
  icon = "search",
}: ExploreEmptyStateProps) {
  return (
    <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-10 text-center flex flex-col items-center justify-center space-y-4 my-6">
      <div className="w-16 h-16 rounded-full bg-slate-800/80 text-cyan-400 flex items-center justify-center ring-4 ring-slate-800/30">
        {icon === "search" ? (
          <SearchX className="w-8 h-8 stroke-[1.5]" />
        ) : (
          <Compass className="w-8 h-8 stroke-[1.5]" />
        )}
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      {onResetFilters && (
        <button
          onClick={onResetFilters}
          type="button"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-semibold transition-all border border-cyan-500/20 hover:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Filters & Search
        </button>
      )}
    </div>
  );
}
