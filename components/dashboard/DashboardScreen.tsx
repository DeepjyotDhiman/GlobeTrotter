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
  Globe,
  ArrowLeft,
  Home,
  Palmtree,
} from "lucide-react";

// Mock Data for Recommended Destination Inspiration
const RECOMMENDED_DESTINATIONS = [
  {
    id: "rec-1",
    name: "Paris",
    country: "France",
    category: "Culture",
    region: "Europe",
    rating: 4.9,
    reviews: 2450,
    price: "₹1,450",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Iconic Eiffel Tower views, world-class Louvre museums, romantic Seine cruises, and Parisian bistros.",
  },
  {
    id: "rec-2",
    name: "Tokyo",
    country: "Japan",
    category: "Culture",
    region: "Asia",
    rating: 4.9,
    reviews: 3120,
    price: "₹1,850",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic Shibuya crossings, ancient Senso-ji shrines, bullet trains, and Michelin ramen spots.",
  },
  {
    id: "rec-3",
    name: "Dubai",
    country: "United Arab Emirates",
    category: "Luxury",
    region: "Middle East",
    rating: 4.8,
    reviews: 1890,
    price: "₹1,950",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "Towering Burj Khalifa skyscrapers, luxury desert dune safaris, mega shopping malls, and beach clubs.",
  },
  {
    id: "rec-4",
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    region: "Europe",
    rating: 4.9,
    reviews: 1240,
    price: "₹1,200",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    description: "Whitewashed cliffside villas, volcanic caldera views, and unforgettable Aegean sunsets.",
  },
  {
    id: "rec-5",
    name: "Bali",
    country: "Indonesia",
    category: "Adventure",
    region: "Asia",
    rating: 4.8,
    reviews: 980,
    price: "₹850",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Tropical palm beaches, lush terraced rice fields, sacred temples, and serene wellness retreats.",
  },
  {
    id: "rec-6",
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Adventure",
    region: "Europe",
    rating: 4.9,
    reviews: 840,
    price: "₹1,600",
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    description: "Majestic snow-capped mountain peaks, pristine alpine lakes, scenic train rides, and skiing.",
  },
];

export default function DashboardScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Traveler");
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

  useEffect(() => {
    setIsMounted(true);

    // Read stored user name from localStorage
    const storedUser = localStorage.getItem("globetrotter_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) {
          const firstName = parsed.name.split(" ")[0];
          setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
        }
      } catch {}
    }
  }, []);

  // Dynamic getUserTrips Fetch Call
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
    if (!isMounted) return;
    fetchTrips();

    window.addEventListener("trips_updated", fetchTrips);
    return () => window.removeEventListener("trips_updated", fetchTrips);
  }, [isMounted]);

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

  // Handle New Trip Form Submit
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
    <div className="min-h-screen bg-[#0b1a17] text-[#f4f1ea] font-sans selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
      {/* Top Navigation */}
      <Navbar onPlanTripClick={() => setIsPlanModalOpen(true)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === "error"
              ? "bg-rose-600 border border-rose-500"
              : "bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 border border-emerald-400/40"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" suppressHydrationWarning>

        {/* Back to Public Landing Page Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Landing Page</span>
        </Link>

        {/* 1. Hero / Welcome Header Section (Luxurious Dark Forest Green #0f221e Wanderly Theme) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f221e] via-[#142b26] to-[#0d1d1a] border border-[#22443d] p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183630] border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Explorer Passport Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f4f1ea] font-serif leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">{userName}</span> 👋
              </h1>
              <p className="text-[#c7d6c3] text-sm sm:text-base leading-relaxed font-sans">
                Ready for your next adventure? You have <span className="font-semibold text-emerald-300">{trips.length} active trips</span> planned. Where would you like to explore next?
              </p>

              {/* Quick Stats Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-[#f4f1ea]">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#122622]/90 border border-[#22443d] backdrop-blur-md">
                  <Luggage className="w-4 h-4 text-emerald-400" />
                  <span>{trips.length} Active Trips</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#122622]/90 border border-[#22443d] backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>14 Cities Visited</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#122622]/90 border border-[#22443d] backdrop-blur-md">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>85% Planned</span>
                </div>
              </div>
            </div>

            {/* Main Primary Action Button [ + Plan New Trip ] */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/trips/new"
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-[#f4f1ea] font-semibold text-sm sm:text-base shadow-xl shadow-emerald-950/50 hover:shadow-emerald-950/70 border border-emerald-400/30 transition-all duration-200 flex items-center justify-center gap-2.5 group"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>+ Plan New Trip</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Upcoming Trip Countdown Highlight Widget */}
        {isMounted && !isLoadingTrips && nextTrip && (
          <section className="bg-gradient-to-r from-[#122924] via-[#0f221e] to-[#0f221e] border border-[#244b43] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a3d36] border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6 animate-bounce text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Next Adventure Alert</span>
                <h3 className="text-base sm:text-lg font-bold text-[#f4f1ea] font-serif">{nextTrip.title}</h3>
                <p className="text-xs text-[#a8bba2] mt-0.5">{nextTrip.dates} • {nextTrip.days} Days • {nextTrip.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-initial bg-[#142c27] px-4 py-2 rounded-xl text-center border border-[#244b43]">
                <span className="block text-xs text-[#a8bba2]">Itinerary</span>
                <span className="text-xs font-bold text-emerald-400">{nextTrip.progress}% Complete</span>
              </div>
              <Link
                href={`/trips/${nextTrip.id}`}
                className="py-2.5 px-4 rounded-xl bg-[#1a3a34] hover:bg-[#204740] text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition-all text-center whitespace-nowrap"
              >
                Open Itinerary →
              </Link>
            </div>
          </section>
        )}

        {/* 3. Recent / Upcoming Trips Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f4f1ea] flex items-center gap-2 font-serif">
                <Compass className="w-5 h-5 text-emerald-400" />
                Your Upcoming Trips
              </h2>
              <p className="text-xs sm:text-sm text-[#a8bba2]">Manage your active plans and draft travel itineraries.</p>
            </div>
            {trips.length > 0 && (
              <Link
                href="/trips"
                className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>View All ({trips.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Loading Skeleton Grid State */}
          {!isMounted || isLoadingTrips ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-[#122723] border border-[#22443d] h-80 animate-pulse p-4 space-y-4">
                  <div className="w-full h-44 bg-[#183630] rounded-2xl" />
                  <div className="h-4 bg-[#183630] rounded w-3/4" />
                  <div className="h-3 bg-[#183630] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            /* Empty State UI when trips.length === 0 */
            <div className="text-center py-16 px-6 rounded-3xl bg-[#0f221e]/80 border-2 border-dashed border-[#244b43] space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-[#183a33] border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <Compass className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-[#f4f1ea] font-serif">No trips planned yet</h3>
              <p className="text-sm text-[#a8bba2] max-w-md mx-auto">
                Your passport is waiting! Create your first custom travel itinerary to start organizing your adventure.
              </p>
              <Link
                href="/trips/new"
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Trip</span>
              </Link>
            </div>
          ) : (
            /* Dynamic Grid Mapping of Trip Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="group relative rounded-3xl glass-card-3d overflow-hidden shadow-xl flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f221e] via-[#0f221e]/30 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0b1a17]/85 backdrop-blur-md border border-white/10 text-[#f4f1ea] text-[11px] font-semibold">
                      {trip.status}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {trip.days} Days
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#f4f1ea] group-hover:text-emerald-300 transition-colors font-serif">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#a8bba2]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{trip.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#a8bba2]">
                        <Calendar className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                        <span>{trip.dates}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-[#a8bba2]">
                        <span>Itinerary Progress</span>
                        <span className="text-emerald-400 font-bold">{trip.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a3832] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${trip.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1d3d36] flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {trip.tags?.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-[#183630] text-[10px] text-[#c7d6c3] font-medium border border-[#22443d]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Trip Empty Card Slot */}
              <Link
                href="/trips/new"
                className="rounded-3xl border-2 border-dashed border-[#244b43] hover:border-emerald-500/50 bg-[#0f221e]/50 hover:bg-[#132a25] p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[280px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 flex items-center justify-center transition-transform mb-3">
                  <Plus className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#f4f1ea] group-hover:text-emerald-400 transition-colors font-serif">+ Plan New Trip</h3>
                <p className="text-xs text-[#a8bba2] mt-1 max-w-xs">
                  Pick a destination, set your dates, and build your dream travel schedule.
                </p>
              </Link>
            </div>
          )}
        </section>

        {/* 4. Destination Inspiration Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Discover & Explore</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f4f1ea] flex items-center gap-2 font-serif">
                <Globe className="w-5 h-5 text-emerald-400" />
                Destination Inspiration
              </h2>
              <p className="text-xs sm:text-sm text-[#a8bba2]">Handpicked top cities including Paris, Tokyo, Dubai & Bali.</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Culture", "Luxury", "Beach", "Adventure", "Europe", "Asia"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                      : "bg-[#122723] border border-[#22443d] text-[#a8bba2] hover:text-[#f4f1ea] hover:bg-[#183630]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => {
              const isBookmarked = bookmarkedIds.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  className="group rounded-3xl bg-[#132a25]/90 border border-[#22443d] hover:border-emerald-500/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f221e] via-transparent to-transparent" />

                      <button
                        type="button"
                        onClick={() => toggleBookmark(dest.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                          isBookmarked
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-[#0b1a17]/70 text-[#d1e0d7] border-white/10 hover:text-rose-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0b1a17]/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dest.rating}</span>
                        <span className="text-[10px] text-[#a8bba2]">({dest.reviews})</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#f4f1ea] group-hover:text-emerald-300 transition-colors font-serif">
                          {dest.name}, {dest.country}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#183832] text-emerald-300 text-[10px] font-semibold border border-[#244b43]">
                          {dest.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#a8bba2] line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-[#1d3d36] mt-2">
                    <div>
                      <span className="text-[10px] text-[#819989] block">Est. Budget</span>
                      <span className="text-sm font-bold text-emerald-400">{dest.price}</span>
                    </div>

                    <Link
                      href="/trips/new"
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/30 transition-all flex items-center gap-1"
                    >
                      <span>Plan Trip</span>
                      <Plus className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Interactive "Plan New Trip" Quick Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1a17]/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f221e] border border-[#244b43] p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1d3d36] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#f4f1ea] font-serif">Create New Travel Plan</h3>
                  <p className="text-xs text-[#a8bba2]">Set up your next itinerary in seconds.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#16322b] text-[#a8bba2] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d1e0d7] mb-1.5">
                  Trip Name
                </label>
                <input
                  type="text"
                  required
                  value={newTrip.title}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Summer in Amalfi Coast"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#16322b] border border-[#244b43] text-[#f4f1ea] placeholder-[#728c7b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d1e0d7] mb-1.5">
                  Destination City / Country
                </label>
                <input
                  type="text"
                  required
                  value={newTrip.location}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Tokyo, Japan"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#16322b] border border-[#244b43] text-[#f4f1ea] placeholder-[#728c7b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#d1e0d7] mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#16322b] border border-[#244b43] text-[#f4f1ea] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#d1e0d7] mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#16322b] border border-[#244b43] text-[#f4f1ea] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d1e0d7] mb-1.5">
                  Travel Vibe
                </label>
                <select
                  value={newTrip.style}
                  onChange={(e) => setNewTrip((prev) => ({ ...prev, style: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#16322b] border border-[#244b43] text-[#f4f1ea] focus:outline-none focus:border-emerald-500"
                >
                  <option value="Relaxation">🏖️ Beach & Relaxation</option>
                  <option value="Adventure">🏔️ Outdoor & Adventure</option>
                  <option value="Culture">⛩️ Culture & Heritage</option>
                  <option value="Food">🍷 Food & Wine Exploration</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1d3d36]">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#16322b] hover:bg-[#1c3f36] text-[#d1e0d7] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 disabled:opacity-50"
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
