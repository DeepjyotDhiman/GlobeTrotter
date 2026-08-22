"use client";

import React from "react";
import { CalendarX, Plus, Sparkles } from "lucide-react";

interface CalendarEmptyStateProps {
  dayNumber: number;
  cityName?: string;
  onAddActivityClick?: () => void;
}

export default function CalendarEmptyState({
  dayNumber,
  cityName = "Destination",
  onAddActivityClick,
}: CalendarEmptyStateProps) {
  return (
    <div className="text-center py-12 px-6 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-4 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center shadow-md">
        <CalendarX className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-bold text-white">
          No activities planned for Day {dayNumber} ({cityName})
        </h3>
        <p className="text-xs text-slate-400">
          Your schedule for this day is completely open. Add sightseeing, dining, or relax!
        </p>
      </div>

      {onAddActivityClick && (
        <button
          type="button"
          onClick={onAddActivityClick}
          className="py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity to Day {dayNumber}</span>
        </button>
      )}
    </div>
  );
}
