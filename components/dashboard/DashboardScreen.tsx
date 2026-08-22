"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getUserTrips, createTrip, TripItem } from "@/lib/tripsService";
import {
  Compass,
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  Star,
  Heart,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Search,
  X,
  Plane,
  Luggage,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Mock Data for Recommended Destinations
const RECOMMENDED_DESTINATIONS = [
  {
    id: "rec-1",
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    region: "Europe",
    rating: 4.9,
    reviews: 1240,
    price: "$1,200",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    description: "Whitewashed cliffside villas, volcanic caldera views, and unforgettable Aegean sunsets.",
  },
  {
    id: "rec-2",
    name: "Bali",
    country: "Indonesia",
    category: "Adventure",
    region: "Asia",
    rating: 4.8,
    reviews: 980,
    price: "$850",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Tropical palm beaches, lush terraced rice fields, sacred temples, and serene wellness retreats.",
  },
  {
    id: "rec-3",
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Adventure",
    region: "Europe",
    rating: 4.9,
    reviews: 840,
    price: "$1,600",
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    description: "Majestic snow-capped mountain peaks, pristine alpine lakes, scenic train rides, and skiing.",
  },
  {
    id: "rec-4",
    name: "Reykjavik",
    country: "Iceland",
    category: "Culture",
    region: "Europe",
    rating: 4.7,
    reviews: 620,
    price: "$1,400",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    description: "Dancing Northern Lights, thermal geysers, blue lagoons, and dramatic volcanic landscapes.",
  },
];

export default function DashboardScreen() {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Trip Form State
  const [newTrip, setNewTrip] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    style: "Relaxation",
  });

  // Dynamic getUserTrips Fetch Call with try/catch & loading state
  const fetchTrips = () => {
    setIsLoadingTrips(true);
    try {
      const fetched = getUserTrips();
      setTrips(fetched);
    } catch (error) {
      showToast("Failed to fetch trips. Please reload.", "error");
    } finally {
      setTimeout(() => setIsLoadingTrips(false), 300);
    }
  };

  useEffect(() => {
    fetchTrips();

    window.addEventListener("trips_updated", fetchTrips);
    return () => window.removeEventListener("trips_updated", fetchTrips);
  }, []);

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter recommended cities
  const filteredDestinations = RECOMMENDED_DESTINATIONS.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory || item.region === selectedCategory;
  });

  // Handle New Trip Form Submit with try/catch
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.title.trim() || !newTrip.location.trim()) return;

    setIsSubmitting(true);

    try {
      const formatDateRange = (s: string, e: string) => {
        if (!s || !e) return "Upcoming";
        const start = new Date(s);
        const end = new Date(e);
        const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
        return `${start.toLocaleDateString("en-US", opt)} - ${end.toLocaleDateString("en-US", opt)}`;
      };

      const daysCount = newTrip.startDate && newTrip.endDate
        ? Math.ceil(Math.abs(new Date(newTrip.endDate).getTime() - new Date(newTrip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 7;

      const createdTrip = createTrip({
        title: newTrip.title.trim(),
        location: newTrip.location.trim(),
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        dates: formatDateRange(newTrip.startDate, newTrip.endDate),
        days: daysCount,
        imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        tags: [newTrip.style, "Custom"],
      });

      setIsPlanModalOpen(false);
      setNewTrip({ title: "", location: "", startDate: "", endDate: "", style: "Relaxation" });
      showToast(`Trip "${createdTrip.title}" created successfully! 🎉`, "success");
    } catch (error) {
      showToast("Failed to create trip. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Next Upcoming Trip
  const nextTrip = trips[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar onPlanTripClick={() => setIsPlanModalOpen(true)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === "error"
              ? "bg-rose-600 border border-rose-500"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/30"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* 1. Hero / Welcome Header Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-cyan-900 border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explorer Passport Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Traveler</span> 👋
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Ready for your next journey? You have <span className="font-semibold text-cyan-300">{trips.length} active trips</span> planned. Where would you like to explore next?
              </p>

              {/* Quick Stats Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <Luggage className="w-4 h-4 text-cyan-400" />
                  <span>{trips.length} Active Trips</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>14 Cities Visited</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>85% Planned</span>
                </div>
              </div>
            </div>

            {/* Main Primary CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2.5 group"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Plan New Trip</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Upcoming Trip Countdown Highlight Widget */}
        {!isLoadingTrips && nextTrip && (
          <section className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Next Adventure Alert</span>
                <h3 className="text-base sm:text-lg font-bold text-white">{nextTrip.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{nextTrip.dates} • {nextTrip.days} Days • {nextTrip.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-initial bg-slate-800/80 px-4 py-2 rounded-xl text-center border border-slate-700">
                <span className="block text-xs text-slate-400">Itinerary</span>
                <span className="text-xs font-bold text-emerald-400">{nextTrip.progress}% Complete</span>
              </div>
              <Link
                href={`/trips/${nextTrip.id}`}
                className="py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all text-center whitespace-nowrap"
              >
                Open Itinerary →
              </Link>
            </div>
          </section>
        )}

        {/* 3. Recent Trips Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                Your Upcoming Trips
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Manage your active plans and draft travel itineraries.</p>
            </div>
            {trips.length > 0 && (
              <Link
                href="/trips"
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>View All ({trips.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Loading Skeleton Grid State */}
          {isLoadingTrips ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-slate-900 border border-slate-800 h-80 animate-pulse p-4 space-y-4">
                  <div className="w-full h-44 bg-slate-800 rounded-2xl" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            /* Empty State UI when trips.length === 0 */
            <div className="text-center py-16 px-6 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center shadow-lg">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No trips planned yet</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your passport is waiting! Create your first custom travel itinerary to start organizing your adventure.
              </p>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Trip</span>
              </button>
            </div>
          ) : (
            /* Dynamic Grid Mapping of Trip Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold">
                      {trip.status}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trip.days} Days
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{trip.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{trip.dates}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-slate-400">
                        <span>Itinerary Progress</span>
                        <span className="text-cyan-400">{trip.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${trip.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {trip.tags?.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Trip Empty Card Slot */}
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="rounded-3xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/30 hover:bg-slate-900/70 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[280px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 flex items-center justify-center transition-transform mb-3">
                  <Plus className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Start a New Itinerary</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Pick a destination, set your budget, and build your dream travel schedule.
                </p>
              </button>
            </div>
          )}
        </section>

        {/* 4. Inspiration Section (Recommended Destinations) */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Discover & Explore</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Recommended Destinations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Top trending cities curated for your next getaway.</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Beach", "Culture", "Adventure", "Europe", "Asia"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => {
              const isBookmarked = bookmarkedIds.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                      <button
                        type="button"
                        onClick={() => toggleBookmark(dest.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                          isBookmarked
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-slate-900/60 text-slate-300 border-white/10 hover:text-rose-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dest.rating}</span>
                        <span className="text-[10px] text-slate-400">({dest.reviews})</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {dest.name}, {dest.country}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Est. Budget</span>
                      <span className="text-sm font-bold text-cyan-400">{dest.price}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewTrip((prev) => ({ ...prev, title: `Trip to ${dest.name}`, location: `${dest.name}, ${dest.country}` }));
                        setIsPlanModalOpen(true);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/30 transition-all flex items-center gap-1"
                    >
                      <span>Plan Trip</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 5. Interactive "Plan New Trip" Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create New Travel Plan</h3>
                  <p className="text-xs text-slate-400">Set up your next itinerary in seconds.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Trip Name
                </label>
                <input
                  type="text"
                  required
                  value={newTrip.title}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Summer in Amalfi Coast"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Destination City / Country
                </label>
                <input
                  type="text"
                  required
                  value={newTrip.location}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Tokyo, Japan"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Travel Vibe
                </label>
                <select
                  value={newTrip.style}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, style: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Relaxation">🏖️ Beach & Relaxation</option>
                  <option value="Adventure">🏔️ Outdoor & Adventure</option>
                  <option value="Culture">⛩️ Culture & Heritage</option>
                  <option value="Food">🍷 Food & Wine Exploration</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Itinerary</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
