"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  DollarSign,
  TrendingUp,
  Plus,
  Compass,
  Calendar,
  Sparkles,
} from "lucide-react";
import { City, Activity, ActivityFilterState } from "./types";
import { ActivityCard } from "./activity-card";
import { ActivitySearch } from "./activity-search";
import { ActivityFilters } from "./activity-filters";
import { ExploreEmptyState } from "./explore-empty-state";
import { ActivityListSkeleton } from "./explore-skeleton";
import { fetchActivities } from "./mock-data";

interface CityDetailsProps {
  city: City;
  onAddCityToTrip: (city: City) => void;
  onAddActivityToTrip: (activity: Activity) => void;
}

const DEFAULT_ACTIVITY_FILTERS: ActivityFilterState = {
  searchQuery: "",
  category: "all",
  cost: "all",
  duration: "any",
};

export function CityDetails({
  city,
  onAddCityToTrip,
  onAddActivityToTrip,
}: CityDetailsProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [filters, setFilters] = useState<ActivityFilterState>(DEFAULT_ACTIVITY_FILTERS);

  useEffect(() => {
    setLoadingActivities(true);
    fetchActivities(city.id, filters)
      .then((data) => setActivities(data))
      .finally(() => setLoadingActivities(false));
  }, [city.id, filters]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_ACTIVITY_FILTERS);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="h-72 md:h-96 relative">
          <img
            src={city.imageUrl}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              {city.country} • {city.region}
            </span>

            <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-300 text-sm font-bold flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{city.rating.toFixed(1)} Rating</span>
            </div>
          </div>

          {/* Bottom Hero Content */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                {city.name}
              </h1>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed drop-shadow">
                {city.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAddCityToTrip(city)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 active:scale-95 transition-all shadow-xl shrink-0"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add City to Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Cost Level
          </span>
          <p className="text-sm font-bold text-slate-100 capitalize">
            {city.costIndex}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Popularity
          </span>
          <p className="text-sm font-bold text-slate-100 capitalize">
            {city.popularity}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Est. Daily Cost
          </span>
          <p className="text-sm font-bold text-cyan-400">
            ${city.averageCostPerDay || 150} / day
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            Featured Activities
          </span>
          <p className="text-sm font-bold text-slate-100">
            {city.featuredActivitiesCount || activities.length || 10}+ Experiences
          </p>
        </div>
      </div>

      {/* Activities Section */}
      <div className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              Things to Do in {city.name}
            </h2>
            <p className="text-xs text-slate-400">
              Browse top activities, tours, and culinary experiences.
            </p>
          </div>

          <ActivitySearch
            value={filters.searchQuery}
            onChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
          />
        </div>

        <ActivityFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Activity List */}
        {loadingActivities ? (
          <ActivityListSkeleton count={4} />
        ) : activities.length === 0 ? (
          <ExploreEmptyState
            title="No activities found"
            description={`We couldn't find any activities matching your filters in ${city.name}.`}
            onResetFilters={handleClearFilters}
            icon="compass"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onAddToTrip={onAddActivityToTrip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default CityDetails;
