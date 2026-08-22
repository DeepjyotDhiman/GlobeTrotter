"use client";

import React, { useState } from "react";
import {
  X,
  Compass,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Check,
  CheckCircle2,
  FileText,
  Tag,
} from "lucide-react";

export interface TripData {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  dates: string;
  days: number;
  progress: number;
  status: "Upcoming" | "Planning" | "Draft" | "Completed";
  imageUrl: string;
  tags: string[];
  description?: string;
}

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (newTrip: TripData) => void;
}

// Preset Cover Images
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

export default function CreateTripModal({
  isOpen,
  onClose,
  onCreateTrip,
}: CreateTripModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    category: "Beach & Relaxation",
    description: "",
    imageUrl: PRESET_IMAGES[0].url,
    customImageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Trip name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Destination location is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date cannot be earlier than start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to format date string
  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "TBD";
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${startDateObj.toLocaleDateString("en-US", options)} - ${endDateObj.toLocaleDateString("en-US", options)}`;
  };

  // Calculate day difference
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedImage = formData.customImageUrl.trim() || formData.imageUrl;
    const totalDays = calculateDays(formData.startDate, formData.endDate);

    const newTrip: TripData = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      location: formData.location.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      dates: formatDateRange(formData.startDate, formData.endDate),
      days: totalDays,
      progress: 10,
      status: "Upcoming",
      imageUrl: selectedImage,
      tags: [formData.category, "Custom"],
      description: formData.description.trim(),
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                Plan a New Trip
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400">Specify trip details to start building your custom itinerary.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Trip Name & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trip Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Summer in Amalfi Coast"
                value={formData.title}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, title: e.target.value }));
                  if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                }}
                className={`w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border ${
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
                  placeholder="e.g., Positano, Italy"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, location: e.target.value }));
                    if (errors.location) setErrors((p) => ({ ...p, location: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, startDate: e.target.value }));
                    if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800/80 border ${
                    errors.startDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  } text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all`}
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
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, endDate: e.target.value }));
                    if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800/80 border ${
                    errors.endDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  } text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all`}
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

          {/* Category & Vibe Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Travel Category / Vibe
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Beach & Relaxation">🏖️ Beach & Relaxation</option>
                <option value="Adventure & Outdoor">🏔️ Adventure & Outdoor</option>
                <option value="Culture & Heritage">⛩️ Culture & Heritage</option>
                <option value="City Break">🏙️ City Break & Shopping</option>
                <option value="Food & Wine">🍷 Food & Culinary Tour</option>
              </select>
            </div>
          </div>

          {/* Cover Photo Presets Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Cover Image Preset
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img) => {
                const isSelected = formData.imageUrl === img.url && !formData.customImageUrl;
                return (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, imageUrl: img.url, customImageUrl: "" }))}
                    className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-95" : "border-slate-800 opacity-70 hover:opacity-100"
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

          {/* Optional Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add bucket list spots, budget notes, or travel companions..."
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Create Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
