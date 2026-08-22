"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Heart,
  Luggage,
  DollarSign,
  Share2,
  CheckCircle2,
  Quote,
  TrendingUp,
} from "lucide-react";

interface HeroSlide {
  id: number;
  badgeIcon: any;
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    badgeIcon: Sparkles,
    badgeText: "Next-Gen AI Travel Companion",
    title: "Dream. Design.",
    titleHighlight: "Discover the World.",
    description: "Your ultimate AI-powered travel planner. Create multi-city itineraries, manage budgets, discover hidden spots, and organize dream trips effortlessly.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 2,
    badgeIcon: Compass,
    badgeText: "Tailored City-by-City Journeys",
    title: "Explore Hidden Gems",
    titleHighlight: "& Custom Itineraries.",
    description: "Uncover secret scenic spots, local bistros, and curated daily schedules tailored perfectly to your travel vibe and pace.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 3,
    badgeIcon: Users,
    badgeText: "Community & Social Travel",
    title: "Collaborate & Share",
    titleHighlight: "Your Adventures.",
    description: "Share your public travel itineraries with friends, family, and global explorers. Fork top community plans with a single click.",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 4,
    badgeIcon: Globe,
    badgeText: "All-in-One Travel OS",
    title: "Your Ultimate",
    titleHighlight: "Travel Companion.",
    description: "Budget tracking, interactive day timelines, destination inspiration, and personalized profiles all under one elegant roof.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
  },
];

// Popular Destinations Grid
const POPULAR_DESTINATIONS = [
  {
    id: "dest-1",
    name: "Kankaria Lake",
    city: "Ahmedabad",
    country: "India",
    rating: 4.8,
    reviews: 1840,
    price: "₹450",
    category: "Heritage & Lake",
    imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80",
    description: "Historic circular lake, vibrant night lights, toy train rides, and authentic Gujarati street food delicacies.",
  },
  {
    id: "dest-2",
    name: "Paris",
    city: "Paris",
    country: "France",
    rating: 4.9,
    reviews: 3250,
    price: "₹1,450",
    category: "Culture & Romance",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Eiffel Tower views, Louvre masterpiece galleries, romantic Seine cruises, and Parisian sidewalk cafes.",
  },
  {
    id: "dest-3",
    name: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    rating: 4.9,
    reviews: 4120,
    price: "₹1,850",
    category: "Metropolis & Shrines",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Shibuya crossings, ancient Senso-ji temples, high-speed bullet trains, and Michelin ramen experiences.",
  },
  {
    id: "dest-4",
    name: "Santorini",
    city: "Thira",
    country: "Greece",
    rating: 4.9,
    reviews: 2190,
    price: "₹1,200",
    category: "Caldera Views",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    description: "Iconic blue-domed churches, whitewashed cliffside suites, volcanic beaches, and Aegean sunsets.",
  },
];

// Why Choose Features
const FEATURES = [
  {
    id: "feat-1",
    icon: Sparkles,
    title: "AI-Powered Smart Itineraries",
    description: "Generate multi-day travel plans in seconds with day-by-day activity timelines optimized for your pace and interests.",
  },
  {
    id: "feat-2",
    icon: DollarSign,
    title: "Real-Time Budget Tracking",
    description: "Keep trip costs under control with automatic expense accumulators and activity budget estimators.",
  },
  {
    id: "feat-3",
    icon: MapPin,
    title: "Multi-Stop Route Optimization",
    description: "Organize cities, transit connections, and daily stops effortlessly without geographical bottlenecks.",
  },
  {
    id: "feat-4",
    icon: Share2,
    title: "One-Click Community Sharing",
    description: "Share your travel memories or clone top-rated community itineraries directly to your personal passport.",
  },
];

// Traveler Testimonials
const TESTIMONIALS = [
  {
    id: "test-1",
    name: "Aarav Patel",
    location: "Ahmedabad, India",
    role: "Adventure Enthusiast",
    avatar: "AP",
    rating: 5,
    quote: "GlobeTrotter made planning our Europe tour effortless. The day-by-day timeline kept our family perfectly organized without any stress!",
  },
  {
    id: "test-2",
    name: "Sophia Martinez",
    location: "Barcelona, Spain",
    role: "Solo Backpacker",
    avatar: "SM",
    rating: 5,
    quote: "The public share feature is amazing! I cloned a 10-day Japan itinerary from the community feed and tailored it in under 5 minutes.",
  },
  {
    id: "test-3",
    name: "Liam O'Connor",
    location: "London, UK",
    role: "Travel Blogger",
    avatar: "LO",
    rating: 5,
    quote: "The dark forest-green aesthetic and budget tracker are top notch. By far the cleanest travel app I've used this year.",
  },
];

export default function Home() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    if (!isMounted) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isMounted]);

  const currentSlide = HERO_SLIDES[currentSlideIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b1a17] text-[#f4f1ea] font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 w-full bg-[#0b1a17]/90 backdrop-blur-2xl border-b border-[#1d3d36] text-[#f4f1ea] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Brand Logo (Left) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-500 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 group-hover:scale-105 transition-transform duration-300">
              <Globe className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-45" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#0b1a17]" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#f4f1ea] via-emerald-100 to-amber-200 bg-clip-text text-transparent flex items-center gap-1.5 font-serif">
              GlobeTrotter
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
            </span>
          </Link>

          {/* User Actions (Right): Dashboard, Sign In & Sign Up */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-[#f4f1ea] hover:bg-[#142e29] transition-all border border-emerald-500/30"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#d1e0d7] hover:text-white hover:bg-white/10 backdrop-blur-md transition-all border border-white/15 hover:border-white/30 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1: Multi-Slide Hero Carousel Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Background Hero Image Slides with Dark Forest Gradient Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlideIndex ? "opacity-30 scale-105" : "opacity-0 scale-100 pointer-events-none"
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-1000"
              />
            </div>
          ))}
          {/* Dark Forest Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1a17]/90 via-[#0d1d1a]/85 to-[#0b1a17]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Slide Next/Prev Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#122723]/80 hover:bg-[#183630] border border-[#244b43] text-emerald-300 hover:text-white transition-all shadow-xl backdrop-blur-md z-20"
          title="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#122723]/80 hover:bg-[#183630] border border-[#244b43] text-emerald-300 hover:text-white transition-all shadow-xl backdrop-blur-md z-20"
          title="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dynamic Slide Content */}
        <div key={currentSlideIndex} className="relative z-10 max-w-5xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16342e] border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-xl backdrop-blur-md">
            <BadgeIcon className="w-4 h-4 text-amber-400" />
            <span>{currentSlide.badgeText}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#f4f1ea] leading-tight max-w-4xl font-serif">
            {currentSlide.title} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
              {currentSlide.titleHighlight}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#c7d6c3] max-w-2xl font-medium leading-relaxed font-sans">
            {currentSlide.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-base shadow-2xl shadow-emerald-950/60 transition-all duration-300 flex items-center justify-center gap-2.5 group"
            >
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl backdrop-blur-md bg-[#132a25]/80 hover:bg-[#183630] border border-[#244b43] text-[#f4f1ea] font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Carousel Slide Dot Indicators */}
          <div className="mt-10 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlideIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlideIndex
                    ? "w-8 bg-gradient-to-r from-emerald-400 to-amber-300 shadow-md shadow-emerald-500/20"
                    : "w-2.5 bg-[#1f423a] hover:bg-[#2b594f]"
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: Popular Destinations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[#1d3d36]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Discover Inspired Places</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f1ea] font-serif">
            Explore Popular Destinations
          </h2>
          <p className="text-sm sm:text-base text-[#a8bba2] leading-relaxed">
            Handpicked global highlights featuring iconic landmarks, serene lakes, and culturally rich cities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-3xl glass-card-3d overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f221e] via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0b1a17]/85 backdrop-blur-md border border-white/10 text-emerald-300 text-[10px] font-semibold">
                    {dest.category}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0b1a17]/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dest.rating}</span>
                    <span className="text-[10px] text-[#a8bba2]">({dest.reviews})</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#f4f1ea] group-hover:text-emerald-300 transition-colors font-serif">
                      {dest.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#a8bba2] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{dest.city}, {dest.country}</span>
                  </p>
                  <p className="text-xs text-[#c7d6c3] line-clamp-2 leading-relaxed pt-1">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#1d3d36] mt-2">
                <div>
                  <span className="text-[10px] text-[#819989] block">Est. Budget</span>
                  <span className="text-sm font-bold text-emerald-400">{dest.price}</span>
                </div>

                <Link
                  href="/trips/new"
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/30 transition-all flex items-center gap-1"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Why Choose GlobeTrotter? Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[#1d3d36]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Intelligent Travel Platform</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f1ea] font-serif">
            Why Choose GlobeTrotter?
          </h2>
          <p className="text-sm sm:text-base text-[#a8bba2] leading-relaxed">
            Everything you need to plan, budget, and experience your dream journeys under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-3xl glass-card-3d p-6 space-y-4 shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#183a33] border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f4f1ea] font-serif">{feat.title}</h3>
                <p className="text-xs text-[#a8bba2] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: What Travelers Say Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[#1d3d36]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Global Traveler Community</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f1ea] font-serif">
            What Travelers Say
          </h2>
          <p className="text-sm sm:text-base text-[#a8bba2] leading-relaxed">
            Read reviews from explorers who built their dream journeys using GlobeTrotter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl glass-card-3d p-6 space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-emerald-500/40" />
                <p className="text-xs sm:text-sm text-[#c7d6c3] italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1d3d36] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#f4f1ea] font-serif">{review.name}</h4>
                    <p className="text-[11px] text-[#a8bba2]">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Minimalist Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#1d3d36] text-xs text-[#a8bba2] font-sans">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-md">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#f4f1ea] font-serif">GlobeTrotter</span>
            </Link>
            <span className="hidden sm:inline text-[#1d3d36]">|</span>
            <p className="text-xs text-[#a8bba2]">© {new Date().getFullYear()} GlobeTrotter Inc. Smart Travel Planning Reimagined.</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#d1e0d7]">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
