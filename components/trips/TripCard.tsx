"use client";

import React from "react";
import Link from "next/link";
import { TripData } from "./CreateTripModal";
import { MapPin, Calendar, Clock, ArrowRight, Trash2, Tag, CheckCircle2 } from "lucide-react";

interface TripCardProps {
  trip: TripData;
  onDeleteTrip?: (id: string) => void;
}

export default function TripCard({ trip, onDeleteTrip }: TripCardProps) {
  // Status Color Helper
  const getStatusBadge = (status: TripData["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Planning":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "Completed":
        return "bg-slate-700/60 text-slate-300 border-slate-600";
      case "Draft":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Cover Image & Badges */}
      <div>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

          {/* Status Badge */}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md border text-[11px] font-semibold ${getStatusBadge(trip.status)}`}>
            {trip.status}
          </span>

          {/* Duration Badge */}
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {trip.days} {trip.days === 1 ? "Day" : "Days"}
          </span>

          {/* Optional Delete Button */}
          {onDeleteTrip && (
            <button
              type="button"
              onClick={() => onDeleteTrip(trip.id)}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-rose-600 text-slate-400 hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100"
              title="Delete Trip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
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

          {/* Description Snippet if present */}
          {trip.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
              "{trip.description}"
            </p>
          )}

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span>Itinerary Progress</span>
              <span className="text-cyan-400 font-semibold">{trip.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${trip.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0 border-t border-slate-800/60 mt-3 flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {trip.tags?.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-medium">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="py-1.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all flex items-center gap-1"
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
