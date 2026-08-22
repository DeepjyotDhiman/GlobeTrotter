"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getTripById, getTripActivities } from "@/lib/tripsService";
import {
  ChevronLeft,
  DollarSign,
  PieChart,
  TrendingUp,
  CreditCard,
  Plus,
  Compass,
} from "lucide-react";

interface TripBudgetPageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripBudgetPage({ params }: TripBudgetPageProps) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const [isMounted, setIsMounted] = useState(false);
  const [tripTitle, setTripTitle] = useState("Trip Itinerary");
  const [totalBudget, setTotalBudget] = useState(1500);
  const [activitiesCost, setActivitiesCost] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const trip = getTripById(tripId);
    if (trip) {
      setTripTitle(trip.title);
    }
    const activities = getTripActivities(tripId);
    const sum = activities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    setActivitiesCost(sum || 320);
  }, [tripId]);

  const remainingBudget = totalBudget - activitiesCost;
  const percentageUsed = Math.min(Math.round((activitiesCost / totalBudget) * 100), 100);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white" suppressHydrationWarning>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" suppressHydrationWarning>
        <Link
          href={`/trips/${tripId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Trip Details</span>
        </Link>

        {/* Hero Budget Banner */}
        <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Financial Overview</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{tripTitle} • Budget Tracker</h1>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Target Budget: ₹{totalBudget}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Total Target Budget</span>
              <p className="text-2xl font-extrabold text-white">₹{totalBudget}</p>
            </div>

            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Planned Spent</span>
              <p className="text-2xl font-extrabold text-cyan-400">₹{activitiesCost}</p>
            </div>

            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Remaining Budget</span>
              <p className={`text-2xl font-extrabold ${remainingBudget >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                ₹{remainingBudget}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>Budget Consumption ({percentageUsed}%)</span>
              <span className="text-cyan-400">₹{activitiesCost} / ₹{totalBudget}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
