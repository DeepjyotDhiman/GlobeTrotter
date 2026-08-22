"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { createTrip } from "@/lib/tripsService";
import {
  Users,
  Search,
  Heart,
  Bookmark,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Share2,
  Copy,
  CheckCircle2,
  Eye,
  Star,
  Globe,
} from "lucide-react";

export interface PublicTrip {
  id: string;
  title: string;
  creator: {
    name: string;
    avatarUrl: string;
    handle: string;
    verified: boolean;
  };
  location: string;
  country: string;
  days: number;
  category: "Trending" | "Backpacking" | "Luxury" | "Culture" | "Foodie";
  imageUrl: string;
  likesCount: number;
  savesCount: number;
  viewsCount: number;
  estimatedBudget: string;
  tags: string[];
  description: string;
}

const PUBLIC_TRIPS: PublicTrip[] = [
  {
    id: "comm-1",
    title: "Backpacking Northern Vietnam: Ha Giang Loop & Sapa",
    creator: {
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      handle: "@elena_travels",
      verified: true,
    },
    location: "Ha Giang & Sapa",
    country: "Vietnam",
    days: 12,
    category: "Backpacking",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    likesCount: 1420,
    savesCount: 890,
    viewsCount: 12400,
    estimatedBudget: "₹650",
    tags: ["Backpacking", "Motorbike", "Nature", "Budget"],
    description: "Conquering the dramatic mountain passes of Ha Giang on motorbike, trekking rice terraces in Sapa, and homestays with ethnic minority villages.",
  },
  {
    id: "comm-2",
    title: "Ultimate 10 Days First-Timer Tokyo & Kyoto Route",
    creator: {
      name: "Kenji Takahashi",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      handle: "@kenjixjapan",
      verified: true,
    },
    location: "Tokyo, Kyoto & Nara",
    country: "Japan",
    days: 10,
    category: "Trending",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    likesCount: 2890,
    savesCount: 1650,
    viewsCount: 24100,
    estimatedBudget: "₹1,850",
    tags: ["Culture", "Foodie", "Bullet Train", "Must-See"],
    description: "Seamless itinerary optimized for JR Pass holders covering Shibuya crossing, Fushimi Inari torii gates, Arashiyama, and Michelin ramen spots.",
  },
  {
    id: "comm-3",
    title: "Amalfi Coast Luxury Cliffside Escape",
    creator: {
      name: "Sophia Laurent",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      handle: "@sophia_luxury",
      verified: true,
    },
    location: "Positano, Capri & Ravello",
    country: "Italy",
    days: 7,
    category: "Luxury",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    likesCount: 1980,
    savesCount: 1120,
    viewsCount: 18900,
    estimatedBudget: "₹3,400",
    tags: ["Luxury", "Yachting", "Fine Dining", "Romance"],
    description: "Private yacht charter around Capri Blue Grotto, sunset cocktails at Franco's Bar, and Michelin 3-star dining in Ravello.",
  },
  {
    id: "comm-4",
    title: "Iceland Ring Road 7-Day Summer Expedition",
    creator: {
      name: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      handle: "@marcus_outdoors",
      verified: false,
    },
    location: "Reykjavik, Vik & Akureyri",
    country: "Iceland",
    days: 7,
    category: "Trending",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    tags: ["Roadtrip", "Waterfalls", "Geysers", "Campervan"],
    likesCount: 1650,
    savesCount: 940,
    viewsCount: 14200,
    estimatedBudget: "₹1,600",
    description: "Complete self-drive campervan itinerary covering Skógafoss, Diamond Beach, Black Sand Beach, and Blue Lagoon geothermal baths.",
  },
  {
    id: "comm-5",
    title: "Oaxaca Foodie Trail: Mole, Mezcal & Markets",
    creator: {
      name: "Camila Gutierrez",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      handle: "@camilafoodie",
      verified: true,
    },
    location: "Oaxaca City & Hierve el Agua",
    country: "Mexico",
    days: 5,
    category: "Foodie",
    imageUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
    likesCount: 1120,
    savesCount: 730,
    viewsCount: 9800,
    estimatedBudget: "₹750",
    tags: ["Foodie", "Culture", "Mezcal", "Markets"],
    description: "Deep dive into 7 moles of Oaxaca, artisanal mezcal palenque distillery tours, street food stalls, and Zapotec ruins.",
  },
  {
    id: "comm-6",
    title: "Sacred Valley & Inca Trail to Machu Picchu",
    creator: {
      name: "Mateo Silva",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      handle: "@mateosilva",
      verified: false,
    },
    location: "Cusco & Machu Picchu",
    country: "Peru",
    days: 8,
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    likesCount: 1840,
    savesCount: 1050,
    viewsCount: 16400,
    estimatedBudget: "₹1,250",
    tags: ["Trekking", "Inca Ruins", "History", "High Altitude"],
    description: "4-day classic Inca Trail trek via Dead Woman's Pass, sunrise arrival at Sun Gate (Inti Punku), and acclimatization in Cusco.",
  },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedTripIds, setLikedTripIds] = useState<string[]>(["comm-2"]);
  const [savedTripIds, setSavedTripIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  // Toggle Like
  const toggleLike = (id: string) => {
    setLikedTripIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle Save / Bookmark
  const toggleSave = (id: string) => {
    setSavedTripIds((prev) => {
      const isSaved = prev.includes(id);
      if (!isSaved) {
        showToast("Saved itinerary to your bookmarks! 🔖");
        return [...prev, id];
      } else {
        return prev.filter((i) => i !== id);
      }
    });
  };

  // Clone/Fork Trip to User's Own Itineraries (`lib/tripsService.ts`)
  const handleForkTrip = (trip: PublicTrip) => {
    const today = new Date();
    const futureStart = new Date(today.setDate(today.getDate() + 30)).toISOString().split("T")[0];
    const futureEnd = new Date(today.setDate(today.getDate() + trip.days)).toISOString().split("T")[0];

    const created = createTrip({
      title: `${trip.title} (Forked)`,
      location: trip.location,
      startDate: futureStart,
      endDate: futureEnd,
      dates: `${trip.days} Days Custom Trip`,
      days: trip.days,
      imageUrl: trip.imageUrl,
      tags: trip.tags,
      description: trip.description,
    });

    showToast(`Forked "${created.title}" into your trips list! ✈️`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filter public trips by Search & Category
  const filteredTrips = PUBLIC_TRIPS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.creator.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* 1. Header Banner Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Global Travel Feed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Community <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Explorer</span> 🌍
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Discover real travel itineraries, hidden spots, and budget breakdowns curated by fellow GlobeTrotter adventurers worldwide.
              </p>
            </div>

            {/* Community Stats Pills */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="block text-xl sm:text-2xl font-extrabold text-cyan-400">2,450+</span>
                <span className="text-[11px] text-slate-400 font-medium">Shared Trips</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="block text-xl sm:text-2xl font-extrabold text-emerald-400">18K+</span>
                <span className="text-[11px] text-slate-400 font-medium">Explorers</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                <span className="block text-xl sm:text-2xl font-extrabold text-amber-400">120+</span>
                <span className="text-[11px] text-slate-400 font-medium">Countries</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Search & Category Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, creators..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {["All", "Trending", "Backpacking", "Luxury", "Culture", "Foodie"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Community Trip Feed Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Public Itineraries ({filteredTrips.length})
            </h2>
            <span className="text-xs text-slate-400">Click "Fork Plan" to clone any trip to your dashboard</span>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-800 space-y-3">
              <Compass className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No community trips found</h3>
              <p className="text-xs text-slate-400">Try searching for a different destination or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const isLiked = likedTripIds.includes(trip.id);
                const isSaved = savedTripIds.includes(trip.id);

                return (
                  <div
                    key={trip.id}
                    className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-52 w-full overflow-hidden">
                        <img
                          src={trip.imageUrl}
                          alt={trip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-300 text-[11px] font-semibold">
                          {trip.category}
                        </span>

                        {/* Actions (Like & Bookmark) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleLike(trip.id)}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                              isLiked
                                ? "bg-rose-500 text-white border-rose-400"
                                : "bg-slate-900/60 text-slate-300 border-white/10 hover:text-rose-400"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSave(trip.id)}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                              isSaved
                                ? "bg-cyan-500 text-white border-cyan-400"
                                : "bg-slate-900/60 text-slate-300 border-white/10 hover:text-cyan-300"
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                          </button>
                        </div>

                        {/* Stats Bar overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-slate-300">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                              {trip.likesCount + (isLiked ? 1 : 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {(trip.viewsCount / 1000).toFixed(1)}k
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            {trip.estimatedBudget} Est.
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        {/* Creator Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={trip.creator.avatarUrl}
                              alt={trip.creator.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                                {trip.creator.name}
                                {trip.creator.verified && (
                                  <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                                )}
                              </p>
                              <p className="text-[10px] text-slate-400">{trip.creator.handle}</p>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            {trip.days} Days
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                          {trip.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{trip.location}, {trip.country}</span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {trip.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {trip.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleForkTrip(trip)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Fork Plan</span>
                      </button>

                      <Link
                        href={`/trips/1`}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>View Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
