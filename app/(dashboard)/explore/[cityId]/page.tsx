"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { CityDetails } from "@/components/explore/city-details";
import { AddToTripModal } from "@/components/explore/add-to-trip";
import { CityDetailsSkeleton } from "@/components/explore/explore-skeleton";
import { City, Activity } from "@/components/explore/types";
import { fetchCityById } from "@/components/explore/mock-data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CityDetailsPage() {
  const params = useParams();
  const cityId = (params?.cityId as string) || "";

  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Add to Trip modal state
  const [modalTarget, setModalTarget] = useState<
    { type: "city"; item: City } | { type: "activity"; item: Activity } | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (cityId) {
      setLoading(true);
      setError("");
      fetchCityById(cityId)
        .then((data) => {
          if (data) {
            setCity(data);
          } else {
            setError("City not found.");
          }
        })
        .catch(() => setError("Unable to load city details."))
        .finally(() => setLoading(false));
    }
  }, [cityId]);

  const handleAddCityToTrip = (c: City) => {
    setModalTarget({ type: "city", item: c });
    setIsModalOpen(true);
  };

  const handleAddActivityToTrip = (a: Activity) => {
    setModalTarget({ type: "activity", item: a });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <CityDetailsSkeleton />
        ) : error || !city ? (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
            <h2 className="text-xl font-bold text-slate-100">Destination Not Found</h2>
            <p className="text-xs text-slate-400">
              The city destination you requested could not be found or has been removed.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Explore</span>
            </Link>
          </div>
        ) : (
          <CityDetails
            city={city}
            onAddCityToTrip={handleAddCityToTrip}
            onAddActivityToTrip={handleAddActivityToTrip}
          />
        )}
      </main>

      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={modalTarget}
      />
    </div>
  );
}
