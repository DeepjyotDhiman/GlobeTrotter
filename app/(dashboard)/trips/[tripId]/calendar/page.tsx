"use client";

import React, { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import CalendarView from "@/components/calendar/calendar-view";
import { ChevronLeft } from "lucide-react";

interface TripCalendarPageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripCalendarPage({ params }: TripCalendarPageProps) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

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

        <section className="space-y-6">
          <CalendarView tripId={tripId} />
        </section>
      </main>
    </div>
  );
}
