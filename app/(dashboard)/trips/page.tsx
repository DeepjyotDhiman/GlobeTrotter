import React from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Map, Plus, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

export default function TripsPage() {
  const trips = [
    {
      id: "1",
      title: "Summer in Amalfi Coast",
      location: "Positano & Capri, Italy",
      dates: "Jul 14 - Jul 24, 2026",
      days: 10,
      progress: 85,
      status: "Upcoming",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "2",
      title: "Kyoto Autumn Leaves",
      location: "Kyoto & Tokyo, Japan",
      dates: "Oct 05 - Oct 15, 2026",
      days: 10,
      progress: 40,
      status: "Planning",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "3",
      title: "Paris Weekend Getaway",
      location: "Paris, France",
      dates: "Nov 20 - Nov 23, 2026",
      days: 4,
      progress: 20,
      status: "Draft",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Map className="w-7 h-7 text-cyan-400" />
              My Travel Itineraries
            </h1>
            <p className="text-sm text-slate-400">All your saved trips and adventure plans in one place.</p>
          </div>
          <Link
            href="/dashboard"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Trip</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="h-44 relative">
                <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold">
                  {trip.status}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-white">{trip.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{trip.dates}</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Itinerary ({trip.progress}% Ready)</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
