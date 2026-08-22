"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  User,
  Mail,
  MapPin,
  Sparkles,
  Compass,
  Globe,
  CheckCircle2,
  Save,
  Loader2,
  Bookmark,
  Trash2,
  DollarSign,
  Heart,
  Luggage,
  Shield,
  Bell,
  Sliders,
  Utensils,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  travelStyle: string;
  currency: string;
  language: string;
  dietary: string;
}

interface SavedDestination {
  id: string;
  name: string;
  country: string;
  category: string;
  imageUrl: string;
}

const DEFAULT_SAVED_DESTINATIONS: SavedDestination[] = [
  {
    id: "saved-1",
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "saved-2",
    name: "Tokyo",
    country: "Japan",
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "saved-3",
    name: "Paris",
    country: "France",
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "preferences" | "saved">("personal");

  // Profile Form State
  const [profile, setProfile] = useState<UserProfile>({
    name: "pethe om",
    email: "petheom05@gmail.com",
    bio: "Avid backpacker, coffee lover, and street food enthusiast exploring the globe.",
    location: "San Francisco, CA",
    travelStyle: "Backpacking",
    currency: "INR (₹)",
    language: "English",
    dietary: "None",
  });

  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>(DEFAULT_SAVED_DESTINATIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setIsMounted(true);

    // Read stored user from localStorage
    const storedUser = localStorage.getItem("globetrotter_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          bio: parsed.bio || prev.bio,
          location: parsed.location || prev.location,
          travelStyle: parsed.travelStyle || prev.travelStyle,
          currency: parsed.currency || prev.currency,
          language: parsed.language || prev.language,
          dietary: parsed.dietary || prev.dietary,
        }));
      } catch {}
    }
  }, []);

  // Compute initials (e.g. "pethe om" -> "PO")
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "PO";

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Remove saved destination
  const handleRemoveSaved = (id: string) => {
    const dest = savedDestinations.find((d) => d.id === id);
    setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
    if (dest) {
      showToast(`Removed ${dest.name} from saved destinations.`);
    }
  };

  // Submit Profile Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Save to localStorage and dispatch storage event
      const updatedUser = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        bio: profile.bio.trim(),
        location: profile.location.trim(),
        travelStyle: profile.travelStyle,
        currency: profile.currency,
        language: profile.language,
        dietary: profile.dietary,
      };

      localStorage.setItem("globetrotter_user", JSON.stringify(updatedUser));
      localStorage.setItem("globetrotter_is_logged_in", "true");
      window.dispatchEvent(new Event("storage"));

      showToast("✓ Profile updated successfully!");
    }, 800);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
          <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
          <div className="h-96 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
      {/* Top Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 border border-emerald-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" suppressHydrationWarning>

        {/* 1. Profile Header Hero Card */}
        <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-emerald-900/40 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold flex items-center justify-center text-3xl shadow-xl shadow-emerald-900/40 border-2 border-white/20">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center" title="Online Active">
                <CheckCircle2 className="w-4 h-4 text-slate-950 fill-emerald-400" />
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize font-serif">
                  {profile.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explorer Pro ✨
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Stats Summary Widget */}
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/30">
                <span className="block text-lg font-extrabold text-emerald-400">8</span>
                <span className="text-[10px] text-slate-400">Trips</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/30">
                <span className="block text-lg font-extrabold text-teal-400">14</span>
                <span className="text-[10px] text-slate-400">Countries</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/30">
                <span className="block text-lg font-extrabold text-amber-400">{savedDestinations.length}</span>
                <span className="text-[10px] text-slate-400">Saved</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Navigation Tabs Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "personal"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-900 border border-emerald-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "preferences"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-900 border border-emerald-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Travel Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "saved"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                : "bg-slate-900 border border-emerald-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Destinations ({savedDestinations.length})</span>
          </button>
        </div>

        {/* 3. Tab Contents */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* TAB 1: Personal Information */}
          {activeTab === "personal" && (
            <div className="rounded-3xl bg-slate-900/80 border border-emerald-900/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                  <User className="w-5 h-5 text-emerald-400" />
                  Personal Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage your display name, bio, and contact details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Home Location / City
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Traveler Bio / Headline
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell fellow travelers about your favorite destinations and travel passions..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Travel Preferences */}
          {activeTab === "preferences" && (
            <div className="rounded-3xl bg-slate-900/80 border border-emerald-900/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  Travel Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize your preferred currency, travel style, and dietary needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Travel Style
                  </label>
                  <select
                    name="travelStyle"
                    value={profile.travelStyle}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Backpacking">🎒 Backpacking & Budget</option>
                    <option value="Relaxation">🏖️ Beach & Relaxation</option>
                    <option value="Luxury">🥂 Luxury & Fine Dining</option>
                    <option value="Culture">⛩️ Culture & Heritage</option>
                    <option value="Foodie">🍷 Food & Wine Exploration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Display Currency
                  </label>
                  <select
                    name="currency"
                    value={profile.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="JPY (¥)">JPY (¥)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Language
                  </label>
                  <select
                    name="language"
                    value={profile.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="English">English (US)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Dietary Requirements
                  </label>
                  <select
                    name="dietary"
                    value={profile.dietary}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="None">No Dietary Restrictions</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Halal">Halal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Saved Destinations */}
          {activeTab === "saved" && (
            <div className="rounded-3xl bg-slate-900/80 border border-emerald-900/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                    <Bookmark className="w-5 h-5 text-emerald-400" />
                    Saved Destinations ({savedDestinations.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Destinations you bookmarked for future travel itineraries.</p>
                </div>
              </div>

              {savedDestinations.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-800/40 border border-dashed border-slate-800 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-white font-serif">No saved destinations</p>
                  <p className="text-xs text-slate-400">Explore the community or dashboard feed to bookmark destinations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {savedDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="group rounded-2xl bg-slate-900 border border-emerald-900/30 hover:border-emerald-500/40 overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-40 w-full overflow-hidden">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(dest.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 backdrop-blur-md transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-emerald-300 text-[10px] font-semibold backdrop-blur-md">
                          {dest.category}
                        </span>
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white font-serif">{dest.name}</h4>
                          <p className="text-xs text-slate-400">{dest.country}</p>
                        </div>
                        <Link
                          href="/trips/new"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all"
                        >
                          Plan Trip
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Bar: Save Profile Button */}
          {activeTab !== "saved" && (
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-semibold text-sm shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          )}

        </form>

      </main>
    </div>
  );
}
