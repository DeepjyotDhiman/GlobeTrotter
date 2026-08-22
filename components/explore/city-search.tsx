"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface CitySearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function CitySearch({
  value,
  onChange,
  placeholder = "Search cities, countries, regions...",
}: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync internal state with external prop change if reset externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce input change by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-2xl group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search cities, countries, or regions"
        className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/90 text-white placeholder-slate-400 border border-slate-800 focus:border-cyan-500/60 focus:ring-4 focus:ring-cyan-500/10 focus:outline-none transition-all shadow-inner text-sm md:text-base"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <div className="p-1 rounded-full bg-slate-800 hover:bg-slate-700">
            <X className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  );
}
export default CitySearch;
