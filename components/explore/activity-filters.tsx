"use client";

import React from "react";
import { Filter, RotateCcw, Clock, DollarSign, Tag } from "lucide-react";
import { ActivityFilterState, ActivityCategory, DurationFilter } from "./types";

interface ActivityFiltersProps {
  filters: ActivityFilterState;
  onFilterChange: (newFilters: ActivityFilterState) => void;
  onClearFilters: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "all" },
  { label: "Sightseeing", value: "Sightseeing" },
  { label: "Food & Culinary", value: "Food" },
  { label: "Adventure", value: "Adventure" },
  { label: "Culture & Art", value: "Culture" },
  { label: "Nature & Parks", value: "Nature" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Shopping", value: "Shopping" },
];

const COST_OPTIONS = [
  { label: "All Costs", value: "all" },
  { label: "Low ($)", value: "low" },
  { label: "Medium ($$)", value: "medium" },
  { label: "High ($$$)", value: "high" },
];

const DURATION_OPTIONS: { label: string; value: DurationFilter }[] = [
  { label: "Any Duration", value: "any" },
  { label: "< 1 hour", value: "short" },
  { label: "1–3 hours", value: "medium" },
  { label: "3+ hours", value: "long" },
];

export function ActivityFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: ActivityFiltersProps) {
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.cost !== "all" ||
    filters.duration !== "any" ||
    filters.searchQuery !== "";

  const handleChange = (key: keyof ActivityFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter Activities</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              Active
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            type="button"
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Category Filter */}
        <div className="space-y-1">
          <label htmlFor="activity-category-filter" className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            Activity Type
          </label>
          <select
            id="activity-category-filter"
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Filter */}
        <div className="space-y-1">
          <label htmlFor="activity-cost-filter" className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Estimated Cost
          </label>
          <select
            id="activity-cost-filter"
            value={filters.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-500 focus:outline-none"
          >
            {COST_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="space-y-1">
          <label htmlFor="activity-duration-filter" className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Duration
          </label>
          <select
            id="activity-duration-filter"
            value={filters.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs border border-slate-800 rounded-xl px-3 py-2 focus:border-cyan-500 focus:outline-none"
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
export default ActivityFilters;
