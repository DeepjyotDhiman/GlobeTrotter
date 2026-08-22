"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import AddStopModal from "@/components/itinerary/AddStopModal";
import TimelineStopList from "@/components/itinerary/TimelineStopList";
import ItineraryBuilder from "@/components/itinerary/ItineraryBuilder";
import {
  getTripById,
  getTripStops,
  addTripStop,
  removeTripStop,
  reorderTripStops,
  TripItem,
  StopItem,
} from "@/lib/tripsService";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Compass,
  CheckCircle2,
  Sparkles,
  Luggage,
  SunMedium,
  Layers,
  ListOrdered,
} from "lucide-react";

interface TripDetailsPageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripDetailsPage({ params }: TripDetailsPageProps) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  // Hydration Mounted Flag
  const [isMounted, setIsMounted] = useState(false);

  // View Mode: 'timeline' or 'builder'
  const [viewMode, setViewMode] = useState<"timeline" | "builder">("builder");

  // State
  const [trip, setTrip] = useState<TripItem | null>(null);
  const [stops, setStops] = useState<StopItem[]>([]);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Ensure hydration synchronization
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Trip & Stops dynamically
  const fetchTripData = () => {
    const fetchedTrip = getTripById(tripId);
    if (fetchedTrip) {
      setTrip(fetchedTrip);
    } else {
      setTrip({
        id: tripId,
        title: "Custom Travel Itinerary",
        location: "Global Destination",
        startDate: "2026-08-01",
        endDate: "2026-08-10",
        dates: "Aug 01 - Aug 10, 2026",
        days: 10,
        progress: 50,
        status: "Planning",
        imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        tags: ["Custom"],
      });
    }

    const fetchedStops = getTripStops(tripId);
    setStops(fetchedStops);
  };

  useEffect(() => {
    if (!isMounted) return;
    fetchTripData();

    const eventName = `stops_updated_${tripId}`;
    window.addEventListener(eventName, fetchTripData);
    return () => window.removeEventListener(eventName, fetchTripData);
  }, [tripId, isMounted]);

  // Add stop handler
  const handleAddStop = (newStopData: any) => {
    const created = addTripStop(tripId, newStopData);
    showToast(`Added ${created.cityName} to your itinerary timeline! ✈️`);
  };

  // Remove stop handler
  const handleRemoveStop = (stopId: string) => {
    const stopToRemove = stops.find((s) => s.id === stopId);
    removeTripStop(tripId, stopId);
    if (stopToRemove) {
      showToast(`Removed ${stopToRemove.cityName} from itinerary.`);
    }
  };

  // Reorder stop handler
  const handleMoveStop = (index: number, direction: "up" | "down") => {
    const newStops = [...stops];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    setStops(newStops);
    reorderTripStops(tripId, newStops);
    showToast("Reordered itinerary stops!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Calculated totals
  const totalNights = stops.reduce((acc, curr) => acc + curr.nights, 0);

  // Return SSR hydration skeleton until component mounts on client
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" suppressHydrationWarning>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" suppressHydrationWarning>
          <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
          <div className="h-96 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white" suppressHydrationWarning>
      {/* Top Navbar */}
      <Navbar onPlanTripClick={() => setIsAddStopOpen(true)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" suppressHydrationWarning>
        
        {/* Back Link */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </Link>

        {/* 1. Trip Header Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img
              src={trip?.imageUrl || "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80"}
              alt={trip?.title || "Trip Hero"}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  {trip?.status || "Upcoming Trip"}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                  {totalNights || trip?.days || 7} Days Duration
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {trip?.title || "Trip Details"}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{trip?.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{trip?.dates}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setIsAddStopOpen(true)}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span>Add Destination Stop</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Mode Selector Bar (Route Timeline vs Day-by-Day Activities) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-2 sm:p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode("builder")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                viewMode === "builder"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Day-by-Day Activities</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                viewMode === "timeline"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Route Timeline ({stops.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden md:inline">
            Use arrow controls to reorder daily activities and destination stops.
          </span>
        </div>

        {/* 3. Two-Column Layout (Itinerary View & Sidebar Widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Itinerary Content Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {viewMode === "builder" ? (
              <ItineraryBuilder tripId={tripId} totalDays={trip?.days || 5} />
            ) : (
              <TimelineStopList
                stops={stops}
                onRemoveStop={handleRemoveStop}
                onAddStopClick={() => setIsAddStopOpen(true)}
                onMoveStop={handleMoveStop}
              />
            )}
          </div>

          {/* Trip Summary Sidebar Widget (30%) */}
          <div className="space-y-6">
            
            {/* Trip Stats Card */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Luggage className="w-5 h-5 text-cyan-400" />
                Trip Summary
              </h3>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                  <span className="block text-2xl font-extrabold text-cyan-400">{stops.length}</span>
                  <span className="text-[11px] text-slate-400 font-medium">Destination Stops</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                  <span className="block text-2xl font-extrabold text-emerald-400">{totalNights || trip?.days || 0}</span>
                  <span className="text-[11px] text-slate-400 font-medium">Total Nights Stay</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Itinerary Readiness</span>
                  <span className="text-cyan-400">{trip?.progress || 75}% Complete</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${trip?.progress || 75}%` }}
                  />
                </div>
              </div>

              {/* Weather Forecast Preview */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <SunMedium className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Weather Forecast</p>
                    <p className="text-slate-400">Sunny • 26°C / 78°F</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Ideal
                </span>
              </div>
            </div>

            {/* Quick Inspiration Tip Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-cyan-500/20 p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Travel Tip</span>
              </div>
              <h4 className="text-sm font-bold text-white">Local Transportation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Book train and ferry connections between stops early to secure preferred departure times and group seating.
              </p>
            </div>

          </div>

        </div>

        {/* Add Stop Modal */}
        <AddStopModal
          isOpen={isAddStopOpen}
          onClose={() => setIsAddStopOpen(false)}
          onAddStop={handleAddStop}
          tripStartDate={trip?.startDate || "2026-07-14"}
        />

      </main>
    </div>
  );
}
