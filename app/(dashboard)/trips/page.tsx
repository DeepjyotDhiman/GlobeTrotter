"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import TripList from "@/components/trips/TripList";
import CreateTripModal from "@/components/trips/CreateTripModal";
import { getUserTrips, createTrip, deleteTripById, TripItem } from "@/lib/tripsService";
import { Map, Plus, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";

export default function TripsPage() {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchTrips = () => {
    setIsLoading(true);
    try {
      setTrips(getUserTrips());
    } catch (error) {
      showToast("Failed to load itineraries.", "error");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchTrips();
    window.addEventListener("trips_updated", fetchTrips);
    return () => window.removeEventListener("trips_updated", fetchTrips);
  }, []);

  // Add new trip handler with try/catch
  const handleCreateTrip = (newTripData: any) => {
    try {
      const created = createTrip(newTripData);
      showToast(`Trip "${created.title}" created successfully! ✈️`, "success");
    } catch (error) {
      showToast("Could not create trip. Please try again.", "error");
    }
  };

  // Delete trip handler with try/catch
  const handleDeleteTrip = (id: string) => {
    try {
      const tripToDelete = trips.find((t) => t.id === id);
      deleteTripById(id);
      if (tripToDelete) {
        showToast(`Trip "${tripToDelete.title}" removed.`, "success");
      }
    } catch (error) {
      showToast("Failed to delete trip.", "error");
    }
  };

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onPlanTripClick={() => setIsModalOpen(true)} />

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

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Itineraries</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Map className="w-7 h-7 text-cyan-400" />
              My Travel Itineraries
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, organize, and manage your upcoming adventure itineraries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Plan New Trip</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-3xl bg-slate-900 border border-slate-800 h-80 animate-pulse p-4 space-y-4">
                <div className="w-full h-44 bg-slate-800 rounded-2xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          /* Trip List Grid Component */
          <TripList
            trips={trips}
            onPlanTripClick={() => setIsModalOpen(true)}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {/* Create Trip Modal */}
        <CreateTripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateTrip={handleCreateTrip}
        />
      </main>
    </div>
  );
}
