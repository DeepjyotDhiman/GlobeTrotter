"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Plus, ArrowRight, DollarSign, TrendingUp } from "lucide-react";
import { City } from "./types";

interface CityCardProps {
  city: City;
  onAddToTrip: (city: City) => void;
}

export function CityCard({ city, onAddToTrip }: CityCardProps) {
  const [imgSrc, setImgSrc] = useState(city.imageUrl);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      // Fallback unsplash travel image
      setImgSrc("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80");
    }
  };

  const getCostBadge = (cost: City["costIndex"]) => {
    switch (cost) {
      case "budget":
        return { label: "$ • Budget", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
      case "moderate":
        return { label: "$$ • Moderate", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
      case "expensive":
        return { label: "$$$ • Luxury", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
      default:
        return { label: "$$ • Moderate", color: "text-slate-400 border-slate-700 bg-slate-800" };
    }
  };

  const costBadge = getCostBadge(city.costIndex);

  return (
    <div className="group rounded-3xl bg-slate-900 border border-slate-800/90 overflow-hidden shadow-xl hover:shadow-cyan-950/20 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
      {/* Card Header & Image */}
      <div>
        <div className="h-52 relative overflow-hidden bg-slate-950">
          <img
            src={imgSrc}
            alt={`${city.name}, ${city.country}`}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {city.region}
            </span>

            <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-amber-300 text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{city.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bottom City Title inside image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {city.name}
            </h3>
            <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
              <span>{city.country}</span>
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {city.description}
          </p>

          {/* Indicators */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${costBadge.color}`}>
              {costBadge.label}
            </span>

            <span className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-800/60 text-slate-300 text-[11px] font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span className="capitalize">{city.popularity} Popularity</span>
            </span>
          </div>

          {/* Tags */}
          {city.tags && city.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {city.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-3">
        <Link
          href={`/explore/${city.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link py-2"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={() => onAddToTrip(city)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add to Trip</span>
        </button>
      </div>
    </div>
  );
}
export default CityCard;
