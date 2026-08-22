"use client";

import React, { useState } from "react";
import TripCard from "./TripCard";
import { TripData } from "./CreateTripModal";
import { Search, SlidersHorizontal, Plus, Compass, Frown } from "lucide-react";

interface TripListProps {
  trips: TripData[];
  onPlanTripClick: () => void;
  onDeleteTrip: (id: string) => void;
}

export default function TripList({
  trips,
  onPlanTripClick,
  onDeleteTrip,
}: TripListProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filterTabs = ["All", "Upcoming", "Planning", "Completed", "Draft"];

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    // Tab filter
    if (activeTab !== "All" && trip.status !== activeTab) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = trip.title.toLowerCase().includes(q);
      const matchLocation = trip.location.toLowerCase().includes(q);
      const matchTag = trip.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchLocation || matchTag;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab} {tab === "All" ? `(${trips.length})` : ""}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, city, tag..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDeleteTrip={onDeleteTrip} />
          ))}

          {/* Create Trip Slot Card */}
          <button
            type="button"
            onClick={onPlanTripClick}
            className="rounded-3xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/30 hover:bg-slate-900/70 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[340px] group"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center transition-transform mb-3">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Start a New Itinerary</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Pick a destination, set your dates, and build your dream travel schedule.
            </p>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Trips Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No itineraries matching "${searchQuery}". Try searching for another city or clear filters.`
              : `You don't have any ${activeTab.toLowerCase()} trips right now.`}
          </p>
          <button
            type="button"
            onClick={onPlanTripClick}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </button>
        </div>
      )}
    </div>
  );
}
