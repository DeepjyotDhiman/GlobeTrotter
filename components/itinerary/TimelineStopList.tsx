"use client";

import React from "react";
import { CityStopData } from "./AddStopModal";
import {
  MapPin,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Compass,
  FileText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface TimelineStopListProps {
  stops: CityStopData[];
  onRemoveStop: (id: string) => void;
  onAddStopClick: () => void;
  onMoveStop?: (index: number, direction: "up" | "down") => void;
}

export default function TimelineStopList({
  stops,
  onRemoveStop,
  onAddStopClick,
  onMoveStop,
}: TimelineStopListProps) {
  if (stops.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
          <Compass className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">No Destination Stops Added Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Start building your itinerary timeline by adding city stops, arrival dates, and travel plans.
        </p>
        <button
          type="button"
          onClick={onAddStopClick}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add First City Stop</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Itinerary Route ({stops.length} {stops.length === 1 ? "Stop" : "Stops"})
          </h2>
          <p className="text-xs text-slate-400">Sequential timeline of destination stops and stay durations.</p>
        </div>

        <button
          type="button"
          onClick={onAddStopClick}
          className="py-2 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-600 before:to-slate-800">
        {stops.map((stop, index) => (
          <div key={stop.id} className="relative group">
            
            {/* Timeline Node Badge */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 font-bold text-[10px] flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-125 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all z-10">
              {index + 1}
            </div>

            {/* Stop Content Card */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
              
              {/* Photo Thumbnail */}
              {stop.imageUrl && (
                <div className="relative w-full sm:w-40 h-32 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800">
                  <img
                    src={stop.imageUrl}
                    alt={stop.cityName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-cyan-300 border border-white/10">
                    Stop #{index + 1}
                  </span>
                </div>
              )}

              {/* Stop Info */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Destination {index + 1}
                    </span>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                      {stop.cityName}, {stop.country}
                    </h3>
                  </div>

                  {/* Reorder and Delete Actions */}
                  <div className="flex items-center gap-1">
                    {onMoveStop && (
                      <>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => onMoveStop(index, "up")}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-all"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === stops.length - 1}
                          onClick={() => onMoveStop(index, "down")}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-all"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveStop(stop.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all ml-1"
                      title="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dates & Duration Pills */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{stop.arrivalDate} → {stop.departureDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{stop.nights} {stop.nights === 1 ? "Night Stay" : "Nights Stay"}</span>
                  </div>
                </div>

                {/* Notes & Highlights */}
                {stop.notes && (
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{stop.notes}</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
