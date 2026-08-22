"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { createTrip } from "@/lib/tripsService";
import {
  ArrowLeft,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";

const PRESET_IMAGES = [
  {
    name: "Amalfi Coast",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kyoto",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Paris",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Santorini",
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bali",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Swiss Alps",
    url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
  },
];

export default function NewTripPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Beach & Relaxation");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  // Status States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Date Formatting Helper
  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "TBD";
    const s = new Date(start);
    const e = new Date(end);
    const opt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${s.toLocaleDateString("en-US", opt)} - ${e.toLocaleDateString("en-US", opt)}`;
  };

  // Day Difference Helper
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 7;
    const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Trip name is required.";
    }

    if (!location.trim()) {
      newErrors.location = "Destination location is required.";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date cannot be earlier than start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler with try/catch & smooth redirect
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const created = createTrip({
        title: title.trim(),
        location: location.trim(),
        startDate,
        endDate,
        dates: formatDateRange(startDate, endDate),
        days: calculateDays(startDate, endDate),
        imageUrl,
        tags: [category, "Custom"],
        description: description.trim(),
      });

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Itinerary Creation</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-cyan-400" />
            Plan a New Trip
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Fill out your trip details below to generate your custom travel schedule.
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-600/20 border border-rose-500 text-rose-300 flex items-center gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Trip Created Successfully!</p>
              <p className="text-xs text-emerald-400/80">Redirecting to your Dashboard...</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Trip Title & Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Trip Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer in Amalfi Coast"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                  }}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border ${
                    errors.title ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Destination (City, Country) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., Positano & Capri, Italy"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors((p) => ({ ...p, location: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800 border ${
                      errors.location ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Dates Grid (Start Date < End Date Validation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border ${
                      errors.startDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                    } text-white focus:outline-none transition-all`}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border ${
                      errors.endDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                    } text-white focus:outline-none transition-all`}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Travel Vibe Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Travel Category / Vibe
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Beach & Relaxation">🏖️ Beach & Relaxation</option>
                  <option value="Adventure & Outdoor">🏔️ Outdoor & Adventure</option>
                  <option value="Culture & Heritage">⛩️ Culture & Heritage</option>
                  <option value="City Break">🏙️ City Break & Shopping</option>
                  <option value="Food & Wine">🍷 Food & Culinary Tour</option>
                </select>
              </div>
            </div>

            {/* Preset Cover Photo Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Destination Cover Image Preset
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_IMAGES.map((img) => {
                  const isSelected = imageUrl === img.url;
                  return (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-95"
                          : "border-slate-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description / Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add travel notes, bucket list spots, or companions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Trip...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Create Trip</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}
