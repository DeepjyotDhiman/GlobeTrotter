"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Search,
  Sparkles,
  AlertCircle,
  Plus,
  FileText,
  CheckCircle2,
  Compass,
} from "lucide-react";

export interface CityStopData {
  id: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  notes?: string;
  imageUrl?: string;
  activities?: string[];
}

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (newStop: CityStopData) => void;
  tripStartDate?: string;
}

// Popular City Suggestions
const CITY_SUGGESTIONS = [
  {
    cityName: "Positano",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Capri",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1568849676085-51415703900f?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Kyoto",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Tokyo",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Rome",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Santorini",
    country: "Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    cityName: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AddStopModal({
  isOpen,
  onClose,
  onAddStop,
  tripStartDate = "",
}: AddStopModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(CITY_SUGGESTIONS[0]);
  const [customCityName, setCustomCityName] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [arrivalDate, setArrivalDate] = useState(tripStartDate || "");
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Filter suggestions
  const filteredSuggestions = CITY_SUGGESTIONS.filter(
    (c) =>
      c.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    const finalCityName = customCityName.trim() || selectedCity.cityName;

    if (!finalCityName) {
      newErrors.cityName = "City name is required.";
    }

    if (!arrivalDate) {
      newErrors.arrivalDate = "Arrival date is required.";
    }

    if (!departureDate) {
      newErrors.departureDate = "Departure date is required.";
    } else if (arrivalDate && new Date(departureDate) < new Date(arrivalDate)) {
      newErrors.departureDate = "Departure date cannot be earlier than arrival date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate nights
  const calculateNights = (arr: string, dep: string) => {
    if (!arr || !dep) return 1;
    const diffTime = Math.abs(new Date(dep).getTime() - new Date(arr).getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const name = customCityName.trim() || selectedCity.cityName;
    const country = customCountry.trim() || selectedCity.country;

    const newStop: CityStopData = {
      id: Date.now().toString(),
      cityName: name,
      country: country,
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      nights: calculateNights(arrivalDate, departureDate),
      notes: notes.trim(),
      imageUrl: selectedCity.imageUrl,
      activities: [],
    };

    onAddStop(newStop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                Add Destination Stop
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400">Add a city or destination stop to your trip itinerary timeline.</p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* City Search / Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Search or Pick Destination City *
            </label>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search popular cities (e.g. Positano, Kyoto, Paris)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Suggestions Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filteredSuggestions.map((c) => {
                const isSelected = selectedCity.cityName === c.cityName && !customCityName;
                return (
                  <button
                    key={c.cityName}
                    type="button"
                    onClick={() => {
                      setSelectedCity(c);
                      setCustomCityName("");
                      setCustomCountry("");
                      if (errors.cityName) setErrors((p) => ({ ...p, cityName: "" }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ring-1 ring-cyan-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{c.cityName}, {c.country}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or Custom City Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom City Name
              </label>
              <input
                type="text"
                placeholder="e.g. Florence"
                value={customCityName}
                onChange={(e) => {
                  setCustomCityName(e.target.value);
                  if (errors.cityName) setErrors((p) => ({ ...p, cityName: "" }));
                }}
                className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border ${
                  errors.cityName ? "border-rose-500" : "border-slate-700"
                } text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
              />
              {errors.cityName && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cityName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Country / Region
              </label>
              <input
                type="text"
                placeholder="e.g. Italy"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Arrival & Departure Date Inputs (Validation: Arrival <= Departure) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Arrival Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => {
                    setArrivalDate(e.target.value);
                    if (errors.arrivalDate) setErrors((p) => ({ ...p, arrivalDate: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border ${
                    errors.arrivalDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  } text-white focus:outline-none`}
                />
              </div>
              {errors.arrivalDate && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.arrivalDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Departure Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => {
                    setDepartureDate(e.target.value);
                    if (errors.departureDate) setErrors((p) => ({ ...p, departureDate: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border ${
                    errors.departureDate ? "border-rose-500" : "border-slate-700 focus:border-cyan-500"
                  } text-white focus:outline-none`}
                />
              </div>
              {errors.departureDate && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.departureDate}
                </p>
              )}
            </div>
          </div>

          {/* Notes / Must-See Activities */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stop Highlights / Activities (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Visit Blue Grotto, sunset dinner at Il San Pietro, hiking Path of the Gods..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
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
              <span>Add Stop to Itinerary</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
