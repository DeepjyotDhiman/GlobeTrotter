"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { createTrip, getTripById } from "@/lib/tripsService";
import {
  Globe,
  Share2,
  Copy,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  Compass,
  Luggage,
  Eye,
  Heart,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";

interface SharedTripData {
  id: string;
  title: string;
  location: string;
  country: string;
  dates: string;
  days: number;
  imageUrl: string;
  creatorName: string;
  tags: string[];
  description: string;
  estimatedBudget: string;
  activities: {
    dayNumber: number;
    time: string;
    title: string;
    category: string;
    location?: string;
    cost?: number;
  }[];
}

const PUBLIC_SHARED_TRIPS_SAMPLE: Record<string, SharedTripData> = {
  "comm-1": {
    id: "comm-1",
    title: "Backpacking Northern Vietnam: Ha Giang Loop & Sapa",
    location: "Ha Giang & Sapa",
    country: "Vietnam",
    dates: "Oct 10 - Oct 22, 2026",
    days: 12,
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
    creatorName: "Elena Rostova",
    tags: ["Backpacking", "Motorbike", "Nature"],
    description: "Conquering the dramatic mountain passes of Ha Giang on motorbike, trekking rice terraces in Sapa, and homestays with ethnic minority villages.",
    estimatedBudget: "₹650",
    activities: [
      { dayNumber: 1, time: "09:00 AM", title: "Ha Giang City Motorbike Briefing & Departure", category: "Transit", location: "Ha Giang Hostel", cost: 20 },
      { dayNumber: 1, time: "01:00 PM", title: "Quan Ba Heaven Gate & Twin Mountains Pass", category: "Sightseeing", location: "Quan Ba Pass", cost: 0 },
      { dayNumber: 1, time: "06:30 PM", title: "Traditional Tay Homestay Dinner & Rice Wine", category: "Dining", location: "Yen Minh Village", cost: 15 },
      { dayNumber: 2, time: "08:30 AM", title: "Riding Ma Pi Leng Pass Cliffside Highway", category: "Sightseeing", location: "Ma Pi Leng Pass", cost: 0 },
      { dayNumber: 2, time: "02:00 PM", title: "Nho Que River Boat Cruise & Canyon View", category: "Activity", location: "Nho Que River", cost: 25 },
    ],
  },
  "comm-2": {
    id: "comm-2",
    title: "Ultimate 10 Days First-Timer Tokyo & Kyoto Route",
    location: "Tokyo & Kyoto",
    country: "Japan",
    dates: "Nov 01 - Nov 10, 2026",
    days: 10,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    creatorName: "Kenji Takahashi",
    tags: ["Culture", "Foodie", "Bullet Train"],
    description: "Seamless itinerary optimized for JR Pass holders covering Shibuya crossing, Fushimi Inari torii gates, Arashiyama, and Michelin ramen spots.",
    estimatedBudget: "₹1,850",
    activities: [
      { dayNumber: 1, time: "10:00 AM", title: "Sensō-ji Temple & Nakamise Shopping Street", category: "Culture", location: "Asakusa, Tokyo", cost: 10 },
      { dayNumber: 1, time: "01:00 PM", title: "Ichiran Tonkotsu Ramen Experience", category: "Dining", location: "Shinjuku, Tokyo", cost: 18 },
      { dayNumber: 1, time: "05:00 PM", title: "Shibuya Sky Observation Deck at Sunset", category: "Sightseeing", location: "Shibuya Scramble Square", cost: 22 },
      { dayNumber: 2, time: "09:00 AM", title: "Shinkansen Bullet Train from Tokyo to Kyoto", category: "Transit", location: "Tokyo Station", cost: 130 },
      { dayNumber: 2, time: "02:00 PM", title: "Fushimi Inari 10,000 Torii Gates Shrine Walk", category: "Culture", location: "Fushimi Inari, Kyoto", cost: 0 },
    ],
  },
};

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const shareId = resolvedParams.shareId;

  const [isMounted, setIsMounted] = useState(false);
  const [sharedTrip, setSharedTrip] = useState<SharedTripData | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if shareId matches public samples or local saved trips
    if (PUBLIC_SHARED_TRIPS_SAMPLE[shareId]) {
      setSharedTrip(PUBLIC_SHARED_TRIPS_SAMPLE[shareId]);
    } else {
      const localTrip = getTripById(shareId);
      if (localTrip) {
        setSharedTrip({
          id: localTrip.id,
          title: localTrip.title,
          location: localTrip.location,
          country: "Global Destination",
          dates: localTrip.dates,
          days: localTrip.days,
          imageUrl: localTrip.imageUrl,
          creatorName: "GlobeTrotter Explorer",
          tags: localTrip.tags || ["Shared"],
          description: localTrip.description || "Shared travel plan on GlobeTrotter.",
          estimatedBudget: "₹1,200",
          activities: [
            { dayNumber: 1, time: "09:00 AM", title: "Arrival & City Center Orientation Walk", category: "Sightseeing", location: localTrip.location, cost: 0 },
            { dayNumber: 1, time: "01:00 PM", title: "Local Specialty Culinary Lunch", category: "Dining", location: localTrip.location, cost: 35 },
            { dayNumber: 1, time: "04:30 PM", title: "Sunset Observation & Evening Drinks", category: "Relaxation", location: localTrip.location, cost: 25 },
          ],
        });
      } else {
        // Fallback default sample trip for any shareId preview
        setSharedTrip(PUBLIC_SHARED_TRIPS_SAMPLE["comm-1"]);
      }
    }
  }, [shareId, isMounted]);

  // Copy share URL to clipboard
  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("Share link copied to clipboard! 📋");
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Clone trip into user's own localStorage trips list
  const handleCloneTrip = () => {
    if (!sharedTrip) return;

    const today = new Date();
    const futureStart = new Date(today.setDate(today.getDate() + 14)).toISOString().split("T")[0];
    const futureEnd = new Date(today.setDate(today.getDate() + sharedTrip.days)).toISOString().split("T")[0];

    const created = createTrip({
      title: `${sharedTrip.title} (Cloned)`,
      location: sharedTrip.location,
      startDate: futureStart,
      endDate: futureEnd,
      dates: `${sharedTrip.days} Days Itinerary`,
      days: sharedTrip.days,
      imageUrl: sharedTrip.imageUrl,
      tags: sharedTrip.tags,
      description: sharedTrip.description,
    });

    showToast(`Saved "${created.title}" to your trips! ✈️`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
          <div className="h-96 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!sharedTrip) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white font-serif">Shared Trip Not Found</h2>
          <p className="text-sm text-slate-400">
            This shared itinerary does not exist or may have been set to private.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-lg"
          >
            Explore Public Community Trips
          </Link>
        </main>
      </div>
    );
  }

  // Calculate total budget
  const totalCost = sharedTrip.activities.reduce((acc, act) => acc + (act.cost || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 border border-emerald-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" suppressHydrationWarning>
        
        {/* Back Link */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </Link>

        {/* 1. Public Read-Only Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-emerald-900/40 p-6 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src={sharedTrip.imageUrl}
              alt={sharedTrip.title}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              
              {/* Public Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public Shared Itinerary</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
                  {sharedTrip.days} Days Duration
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif">
                {sharedTrip.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sharedTrip.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{sharedTrip.location}, {sharedTrip.country}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>{sharedTrip.dates}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Curated by {sharedTrip.creatorName}</span>
                </div>
              </div>
            </div>

            {/* Share & Copy Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
                <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleCloneTrip}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-900/30 border border-emerald-400/20 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Clone / Save to My Trips</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Read-Only Day-by-Day Timeline Breakdown */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-emerald-900/40">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-serif">
                <Compass className="w-5 h-5 text-emerald-400" />
                Public Day-by-Day Itinerary Schedule
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Explore scheduled activities, timings, and budget estimations.</p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Est. Total Cost: <span className="text-white font-bold">${totalCost || 120}</span></span>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-6">
            {Array.from({ length: sharedTrip.days }, (_, i) => i + 1).map((dayNum) => {
              const dayActivities = sharedTrip.activities.filter((a) => a.dayNumber === dayNum);

              return (
                <div key={dayNum} className="rounded-3xl bg-slate-900/60 border border-emerald-900/30 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                      D{dayNum}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">Day {dayNum} Overview</h3>
                      <p className="text-xs text-slate-400">{dayActivities.length} Activities</p>
                    </div>
                  </div>

                  {dayActivities.length > 0 ? (
                    <div className="space-y-3 pl-2 sm:pl-4">
                      {dayActivities.map((act, index) => (
                        <div
                          key={index}
                          className="rounded-2xl bg-slate-900 border border-slate-800/90 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                {act.time}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                                {act.category}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white font-serif">{act.title}</h4>
                            {act.location && (
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                <span>{act.location}</span>
                              </p>
                            )}
                          </div>

                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                            {act.cost ? `₹${act.cost}` : "Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No public activities scheduled for Day {dayNum}.</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
