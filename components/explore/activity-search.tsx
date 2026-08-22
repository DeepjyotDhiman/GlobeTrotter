"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface ActivitySearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function ActivitySearch({
  value,
  onChange,
  placeholder = "Search activities, tours, experiences...",
}: ActivitySearchProps) {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-xl group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search activities or experiences"
        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-400 border border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 focus:outline-none transition-all text-xs md:text-sm"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
export default ActivitySearch;
