"use client";

import React, { useState } from "react";
import { Filter, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { CityFilterState } from "./types";

interface CityFiltersProps {
  filters: CityFilterState;
  onFilterChange: (newFilters: CityFilterState) => void;
  onClearFilters: () => void;
  availableCountries?: string[];
  availableRegions?: string[];
}

const DEFAULT_COUNTRIES = ["France", "Japan", "Indonesia", "Italy", "Iceland", "South Africa", "United States", "Australia", "Egypt"];
const DEFAULT_REGIONS = ["Europe", "Asia", "Africa", "Americas", "Oceania"];

export function CityFilters({
  filters,
  onFilterChange,
  onClearFilters,
  availableCountries = DEFAULT_COUNTRIES,
  availableRegions = DEFAULT_REGIONS,
}: CityFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.country !== "all" ||
    filters.region !== "all" ||
    filters.costIndex !== "all" ||
    filters.popularity !== "all" ||
    filters.searchQuery !== "";

  const handleSelectChange = (key: keyof CityFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
      {/* Header for mobile filter toggle & Desktop overview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Cities</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              type="button"
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          {/* Mobile expand button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            type="button"
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle filters"
          >
            {isMobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isMobileOpen ? "block" : "hidden md:grid"}`}>
        {/* Country Filter */}
        <div className="space-y-1.5">
          <label htmlFor="filter-country" className="text-xs font-medium text-slate-400">
            Country
          </label>
          <select
            id="filter-country"
            value={filters.country}
            onChange={(e) => handleSelectChange("country", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm border border-slate-800 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Countries</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="space-y-1.5">
          <label htmlFor="filter-region" className="text-xs font-medium text-slate-400">
            Region
          </label>
          <select
            id="filter-region"
            value={filters.region}
            onChange={(e) => handleSelectChange("region", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm border border-slate-800 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Index Filter */}
        <div className="space-y-1.5">
          <label htmlFor="filter-cost" className="text-xs font-medium text-slate-400">
            Cost Index
          </label>
          <select
            id="filter-cost"
            value={filters.costIndex}
            onChange={(e) => handleSelectChange("costIndex", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm border border-slate-800 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">Any Cost</option>
            <option value="budget">Budget ($)</option>
            <option value="moderate">Moderate ($$)</option>
            <option value="expensive">Expensive ($$$)</option>
          </select>
        </div>

        {/* Popularity Filter */}
        <div className="space-y-1.5">
          <label htmlFor="filter-popularity" className="text-xs font-medium text-slate-400">
            Popularity
          </label>
          <select
            id="filter-popularity"
            value={filters.popularity}
            onChange={(e) => handleSelectChange("popularity", e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm border border-slate-800 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Popularity</option>
            <option value="high">High Popularity</option>
            <option value="medium">Medium Popularity</option>
            <option value="low">Low Popularity</option>
          </select>
        </div>
      </div>
    </div>
  );
}
export default CityFilters;
