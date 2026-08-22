import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Globe, Search, Star, Heart, MapPin } from "lucide-react";

export default function ExplorePage() {
  const destinations = [
    {
      name: "Santorini, Greece",
      rating: 4.9,
      category: "Beach & Luxury",
      price: "$1,200",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Bali, Indonesia",
      rating: 4.8,
      category: "Nature & Retreat",
      price: "$850",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Swiss Alps, Switzerland",
      rating: 4.9,
      category: "Adventure & Skiing",
      price: "$1,600",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Reykjavik, Iceland",
      rating: 4.7,
      category: "Glaciers & Lights",
      price: "$1,400",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-cyan-400" />
            Explore Destinations
          </h1>
          <p className="text-sm text-slate-400">Discover handpicked destinations and top-rated travel spots world-wide.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div key={dest.name} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="h-48 relative">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-base">{dest.name}</h3>
                <p className="text-xs text-slate-400">{dest.category}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-400">{dest.price} avg</span>
                  <button type="button" className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-all">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
