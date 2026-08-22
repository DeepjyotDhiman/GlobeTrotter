import React from "react";
import Link from "next/link";
import {
  Globe,
  Compass,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  Plane,
  Layers,
  Users,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      
      {/* Background Hero Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Inspiring Travel Background"
          className="w-full h-full object-cover opacity-35 scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Dark Ocean Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-blue-950/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
            <Globe className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-45" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-1.5">
            GlobeTrotter
            <Sparkles className="w-4 h-4 text-cyan-400 inline" />
          </span>
        </Link>

        {/* User Actions (Right): Sign In & Sign Up */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all border border-cyan-500/20"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all border border-white/15 hover:border-white/30 flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-12 text-center flex flex-col items-center justify-center">
        
        {/* Floating AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-xl backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen AI Travel Companion</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none max-w-4xl">
          Dream. Design. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Discover the World.
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
          Your ultimate AI-powered travel planner. Create multi-city itineraries, manage budgets, discover hidden spots, and organize dream trips effortlessly.
        </p>

        {/* Primary & Secondary Call To Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          {/* Primary CTA */}
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-base shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5 text-cyan-400" />
            <span>Create Account</span>
          </Link>
        </div>

        {/* Trust Badges / Stats Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="block text-xl sm:text-2xl font-extrabold text-cyan-400">140+</span>
            <span className="text-xs text-slate-300 font-medium">Curated Destinations</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="block text-xl sm:text-2xl font-extrabold text-emerald-400">4.9 ★</span>
            <span className="text-xs text-slate-300 font-medium">Top Traveler Rating</span>
          </div>
          <div className="col-span-2 md:col-span-1 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="block text-xl sm:text-2xl font-extrabold text-amber-400">100%</span>
            <span className="text-xs text-slate-300 font-medium">Custom Itineraries</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} GlobeTrotter Inc. Smart Travel Planning Reimagined.</p>
        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link>
          <Link href="/register" className="hover:text-cyan-400 transition-colors">Sign Up</Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          <Link href="/trips" className="hover:text-cyan-400 transition-colors">My Trips</Link>
        </div>
      </footer>

    </div>
  );
}
