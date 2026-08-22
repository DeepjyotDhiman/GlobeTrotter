"use client";

import React from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  Camera,
  Utensils,
  Compass,
  Car,
  Palmtree,
  Sparkles,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

export type ActivityCategory = "Sightseeing" | "Dining" | "Transit" | "Activity" | "Relaxation";

export interface TimelineActivity {
  id: string;
  dayNumber: number;
  time: string;
  duration?: string;
  title: string;
  category: ActivityCategory;
  location?: string;
  cost?: number;
  notes?: string;
  status?: "completed" | "upcoming" | "in-progress";
}

interface TimelineItemProps {
  activity: TimelineActivity;
  isFirst?: boolean;
  isLast?: boolean;
  onEdit?: (activity: TimelineActivity) => void;
  onDelete?: (id: string) => void;
}

export default function TimelineItem({
  activity,
  isFirst = false,
  isLast = false,
  onEdit,
  onDelete,
}: TimelineItemProps) {
  // Category styling and icon configuration
  const getCategoryMeta = (cat: ActivityCategory) => {
    switch (cat) {
      case "Dining":
        return { icon: Utensils, bg: "bg-amber-500/15 text-amber-300 border-amber-500/30", dotColor: "border-amber-400 bg-amber-400/20" };
      case "Sightseeing":
        return { icon: Camera, bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dotColor: "border-emerald-400 bg-emerald-400/20" };
      case "Activity":
        return { icon: Compass, bg: "bg-teal-500/15 text-teal-300 border-teal-500/30", dotColor: "border-teal-400 bg-teal-400/20" };
      case "Transit":
        return { icon: Car, bg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", dotColor: "border-cyan-400 bg-cyan-400/20" };
      case "Relaxation":
        return { icon: Palmtree, bg: "bg-purple-500/15 text-purple-300 border-purple-500/30", dotColor: "border-purple-400 bg-purple-400/20" };
      default:
        return { icon: Sparkles, bg: "bg-slate-800 text-slate-300 border-slate-700", dotColor: "border-emerald-400 bg-emerald-400/20" };
    }
  };

  const meta = getCategoryMeta(activity.category);
  const CategoryIcon = meta.icon;

  return (
    <div className="relative pl-6 sm:pl-8 group font-sans">
      
      {/* Timeline Connecting Vertical Line */}
      {!isLast && (
        <div className="absolute left-2.5 sm:left-3.5 top-6 bottom-0 w-0.5 bg-slate-800 group-hover:bg-emerald-500/40 transition-colors" />
      )}

      {/* Timeline Dot Indicator */}
      <div className={`absolute left-0 sm:left-1 top-4 w-5 h-5 rounded-full border-2 ${meta.dotColor} flex items-center justify-center group-hover:scale-125 transition-transform z-10 bg-slate-950`}>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>

      {/* Card Content Container */}
      <div className="rounded-2xl bg-slate-900/90 border border-emerald-900/30 hover:border-emerald-500/40 p-4 sm:p-5 shadow-xl hover:shadow-emerald-900/20 transition-all duration-300 space-y-3">
        
        {/* Header Row: Time, Category Badge, Duration & Options */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {activity.time}
            </span>

            {activity.duration && (
              <span className="text-[11px] font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-800">
                ⌛ {activity.duration}
              </span>
            )}

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${meta.bg}`}>
              {activity.category}
            </span>
          </div>

          {/* Estimated Cost Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              {activity.cost && activity.cost > 0 ? `₹${activity.cost}` : "Free"}
            </span>
          </div>
        </div>

        {/* Body Row: Icon, Title & Location */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${meta.bg}`}>
              <CategoryIcon className="w-4 h-4" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-serif">
                {activity.title}
              </h4>

              {activity.location && (
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional Notes Box */}
        {activity.notes && (
          <p className="text-xs text-slate-400 italic bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
            "{activity.notes}"
          </p>
        )}

      </div>
    </div>
  );
}
