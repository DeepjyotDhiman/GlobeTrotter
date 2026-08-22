"use client";

import React, { useState, useEffect } from "react";
import Timeline from "./timeline";
import TimelineItem, { TimelineActivity } from "./timeline-item";
import CalendarEmptyState from "./calendar-empty-state";
import CalendarSkeleton from "./calendar-skeleton";
import { getTripActivities, getTripStops, StopItem } from "@/lib/tripsService";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

interface CalendarViewProps {
  tripId?: string;
  totalDays?: number;
  onAddActivityClick?: (dayNumber: number) => void;
}

// Sample fallback mock data for initial render
const SAMPLE_ACTIVITIES: TimelineActivity[] = [
  {
    id: "act-1",
    dayNumber: 1,
    time: "09:00 AM",
    duration: "2 hours",
    title: "Eiffel Tower Summit & Trocadero Views",
    category: "Sightseeing",
    location: "Champ de Mars, Paris",
    cost: 35,
    notes: "Pre-booked skip-the-line elevator tickets.",
  },
  {
    id: "act-2",
    dayNumber: 1,
    time: "01:00 PM",
    duration: "1.5 hours",
    title: "French Bistro Lunch at Le Marais",
    category: "Dining",
    location: "Le Marais District",
    cost: 45,
    notes: "Try the duck confit and fresh baguettes.",
  },
  {
    id: "act-3",
    dayNumber: 1,
    time: "04:00 PM",
    duration: "3 hours",
    title: "Louvre Museum Guided Masterpieces Tour",
    category: "Sightseeing",
    location: "Musée du Louvre",
    cost: 65,
    notes: "Mona Lisa and Venus de Milo gallery.",
  },
  {
    id: "act-4",
    dayNumber: 2,
    time: "10:00 AM",
    duration: "2 hours",
    title: "Seine River Sightseeing Cruise",
    category: "Relaxation",
    location: "Pont Neuf Pier",
    cost: 25,
  },
  {
    id: "act-5",
    dayNumber: 2,
    time: "08:00 PM",
    duration: "2.5 hours",
    title: "Michelin Star Tasting Dinner",
    category: "Dining",
    location: "Septime, Paris",
    cost: 140,
  },
];

export default function CalendarView({
  tripId = "1",
  totalDays = 5,
  onAddActivityClick,
}: CalendarViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activities, setActivities] = useState<TimelineActivity[]>(SAMPLE_ACTIVITIES);
  const [stops, setStops] = useState<StopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch activities dynamically from tripsService
  const loadTripData = () => {
    setIsLoading(true);
    try {
      const fetchedActivities = getTripActivities(tripId);
      if (fetchedActivities && fetchedActivities.length > 0) {
        setActivities(fetchedActivities as TimelineActivity[]);
      } else {
        setActivities(SAMPLE_ACTIVITIES);
      }

      const fetchedStops = getTripStops(tripId);
      setStops(fetchedStops);
    } catch {
      setActivities(SAMPLE_ACTIVITIES);
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    loadTripData();

    const eventName = `activities_updated_${tripId}`;
    window.addEventListener(eventName, loadTripData);
    return () => window.removeEventListener(eventName, loadTripData);
  }, [tripId, isMounted]);

  // Filter activities by selected day
  const dayActivities = activities.filter((a) => a.dayNumber === selectedDay);

  // Calculate day total cost
  const dayCost = dayActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  // Get City Name for day
  const getCityForDay = (dayNum: number) => {
    if (stops.length === 0) return "Paris";
    const stopIndex = Math.min(Math.floor((dayNum - 1) / 2), stops.length - 1);
    return stops[stopIndex]?.cityName || stops[0]?.cityName || "Destination";
  };

  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);

  if (!isMounted) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Day Selector Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {dayNumbers.map((dayNum) => {
          const isSelected = selectedDay === dayNum;
          const count = activities.filter((a) => a.dayNumber === dayNum).length;
          const city = getCityForDay(dayNum);

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setSelectedDay(dayNum)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isSelected
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                  : "bg-slate-900 border border-emerald-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <span>Day {dayNum}</span>
              <span className="text-[10px] opacity-75">({city})</span>
              {count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Selected Day Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-emerald-900/40 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Itinerary Timeline</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
            Day {selectedDay} • {getCityForDay(selectedDay)}
          </h3>
          <p className="text-xs text-slate-400">
            {dayActivities.length} {dayActivities.length === 1 ? "Activity" : "Activities"} Scheduled
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Day Est. Cost: <span className="text-white font-bold">₹{dayCost}</span></span>
          </div>
        </div>
      </div>

      {/* 3. Timeline or Empty State */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : dayActivities.length > 0 ? (
        <Timeline activities={dayActivities} />
      ) : (
        <CalendarEmptyState
          dayNumber={selectedDay}
          cityName={getCityForDay(selectedDay)}
          onAddActivityClick={onAddActivityClick ? () => onAddActivityClick(selectedDay) : undefined}
        />
      )}

    </div>
  );
}
