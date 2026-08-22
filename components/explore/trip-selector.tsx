"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Calendar, MapPin } from "lucide-react";
import { Trip } from "./types";

interface TripSelectorProps {
  trips: Trip[];
  selectedTripId: string;
  onSelectTrip: (tripId: string) => void;
  isLoadingTrips?: boolean;
}

export function TripSelector({
  trips,
  selectedTripId,
  onSelectTrip,
  isLoadingTrips = false,
}: TripSelectorProps) {
  if (isLoadingTrips) {
    return (
      <div className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 animate-pulse space-y-2">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-10 bg-slate-800 rounded w-full" />
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
        <p className="text-sm text-slate-300 font-medium">No trips available yet.</p>
        <p className="text-xs text-slate-400">Create your first trip itinerary before adding destinations.</p>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md mt-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create a Trip</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor="trip-select-dropdown" className="text-xs font-medium text-slate-300 block">
        Select Destination Trip
      </label>
      <div className="relative">
        <select
          id="trip-select-dropdown"
          value={selectedTripId}
          onChange={(e) => onSelectTrip(e.target.value)}
          className="w-full bg-slate-950 text-slate-100 text-sm border border-slate-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none appearance-none"
        >
          <option value="" disabled>
            -- Select a trip --
          </option>
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.destination})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>

      {selectedTripId && (
        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3">
          {(() => {
            const current = trips.find((t) => t.id === selectedTripId);
            if (!current) return null;
            return (
              <>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {current.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {current.totalDays || 7} days
                </span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
export default TripSelector;
