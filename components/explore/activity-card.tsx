"use client";

import React, { useState } from "react";
import { Star, Clock, MapPin, Plus, Tag } from "lucide-react";
import { Activity } from "./types";

interface ActivityCardProps {
  activity: Activity;
  onAddToTrip: (activity: Activity) => void;
}

export function ActivityCard({ activity, onAddToTrip }: ActivityCardProps) {
  const [imgSrc, setImgSrc] = useState(activity.imageUrl);

  const handleImageError = () => {
    setImgSrc("https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80");
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800/90 overflow-hidden shadow-lg hover:border-slate-700 transition-all duration-200 flex flex-col md:flex-row justify-between">
      {/* Image Container */}
      <div className="md:w-48 h-44 relative bg-slate-950 shrink-0 overflow-hidden">
        <img
          src={imgSrc}
          alt={activity.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />

        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
          {activity.category}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-slate-100 text-sm md:text-base leading-snug group-hover:text-cyan-300 transition-colors">
              {activity.name}
            </h4>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold shrink-0 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{activity.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {activity.cityName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatDuration(activity.durationHours)}
            </span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-cyan-400">
            ${activity.estimatedCost} <span className="text-[10px] font-normal text-slate-400">est. cost</span>
          </div>

          <button
            type="button"
            onClick={() => onAddToTrip(activity)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs transition-all border border-cyan-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ActivityCard;
