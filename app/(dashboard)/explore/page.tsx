"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Globe, Compass, Sparkles, Wallet, Flame } from "lucide-react";
import { City, Activity, CityFilterState } from "@/components/explore/types";
import { CitySearch } from "@/components/explore/city-search";
import { CityFilters } from "@/components/explore/city-filters";
import { CityCard } from "@/components/explore/city-card";
import { AddToTripModal } from "@/components/explore/add-to-trip";
import { ExploreEmptyState } from "@/components/explore/explore-empty-state";
import { CityGridSkeleton } from "@/components/explore/explore-skeleton";
import { BudgetOverview } from "@/components/budget/budget-overview";
import { fetchCities, MOCK_CITIES } from "@/components/explore/mock-data";

const DEFAULT_FILTERS: CityFilterState = {
  searchQuery: "",
  country: "all",
  region: "all",
  costIndex: "all",
  popularity: "all",
};

export default function ExplorePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<CityFilterState>(DEFAULT_FILTERS);

  // Add to Trip Modal State
  const [modalTarget, setModalTarget] = useState<
    { type: "city"; item: City } | { type: "activity"; item: Activity } | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Active view tab: "destinations" | "budget"
  const [activeTab, setActiveTab] = useState<"destinations" | "budget">("destinations");

  const loadCities = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchCities(filters);
      setCities(data);

      // Set popular cities (top 3 highest rated)
      const popular = [...(data.length > 0 ? data : MOCK_CITIES)]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setPopularCities(popular);
    } catch (_err) {
      setError("Unable to load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, [filters]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleOpenAddToTrip = (city: City) => {
    setModalTarget({ type: "city", item: city });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>GlobeTrotter Discovery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Explore the World
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-xl">
              Discover top global destinations, handpicked activities, and estimate travel budgets seamlessly.
            </p>
          </div>

          {/* Navigation Tabs (Explore vs Trip Budget) */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("destinations")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "destinations"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Destinations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("budget")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "budget"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Budget Planner</span>
            </button>
          </div>
        </div>

        {activeTab === "destinations" ? (
          <>
            {/* Search Bar */}
            <div className="flex justify-center">
              <CitySearch
                value={filters.searchQuery}
                onChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
              />
            </div>

            {/* Filter Panel */}
            <CityFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Popular Destinations Highlight (Shown when no search term is typed) */}
            {!filters.searchQuery && filters.country === "all" && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Popular Destinations
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularCities.map((city) => (
                    <CityCard
                      key={`popular-${city.id}`}
                      city={city}
                      onAddToTrip={handleOpenAddToTrip}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Destinations / Search Results */}
            <section className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  {filters.searchQuery ? "Search Results" : "All Cities & Destinations"}
                </h2>

                <span className="text-xs text-slate-400 font-medium">
                  {cities.length} {cities.length === 1 ? "destination" : "destinations"} found
                </span>
              </div>

              {/* Loading Grid */}
              {loading ? (
                <CityGridSkeleton count={6} />
              ) : error ? (
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                  <p className="text-sm font-semibold text-rose-400">{error}</p>
                  <button
                    onClick={loadCities}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold hover:bg-slate-700 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : cities.length === 0 ? (
                <ExploreEmptyState
                  title="No cities found"
                  description="No destinations match your search query or filter options. Try clearing your filters or typing another search term."
                  onResetFilters={handleClearFilters}
                  icon="search"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities.map((city) => (
                    <CityCard
                      key={city.id}
                      city={city}
                      onAddToTrip={handleOpenAddToTrip}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Budget Tab View */
          <section className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">Trip Budget & Cost Overview</h2>
              <p className="text-xs text-slate-400">
                Track your estimated trip expenses, average daily costs, category distribution, and budget limits.
              </p>
            </div>

            <BudgetOverview tripId="trip-europe-2026" />
          </section>
        )}
      </main>

      {/* Add to Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={modalTarget}
      />
    </div>
  );
}
