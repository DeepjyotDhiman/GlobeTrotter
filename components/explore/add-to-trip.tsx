"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Loader2, Plus, Luggage } from "lucide-react";
import { City, Activity, Trip } from "./types";
import { TripSelector } from "./trip-selector";
import { fetchUserTrips, addCityToTrip, addActivityToTrip } from "./mock-data";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: { type: "city"; item: City } | { type: "activity"; item: Activity } | null;
  onSuccess?: () => void;
}

export function AddToTripModal({
  isOpen,
  onClose,
  targetItem,
  onSuccess,
}: AddToTripModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [loadingTrips, setLoadingTrips] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successTripTitle, setSuccessTripTitle] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setLoadingTrips(true);
      setStatus("idle");
      setErrorMessage("");
      fetchUserTrips()
        .then((data) => {
          setTrips(data);
          if (data && data.length > 0) {
            setSelectedTripId(data[0].id);
          }
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    }
  }, [isOpen]);

  if (!isOpen || !targetItem) return null;

  const isCity = targetItem.type === "city";
  const itemTitle = isCity ? (targetItem.item as City).name : (targetItem.item as Activity).name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId || isSubmitting || status === "success") return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const targetTrip = trips.find((t) => t.id === selectedTripId);
    const tripTitle = targetTrip ? targetTrip.title : "your trip";

    try {
      let result: { success: boolean; message?: string };
      if (isCity) {
        result = await addCityToTrip(selectedTripId, (targetItem.item as City).id);
      } else {
        result = await addActivityToTrip(selectedTripId, (targetItem.item as Activity).id);
      }

      if (result.success) {
        setStatus("success");
        setSuccessTripTitle(tripTitle);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setStatus("error");
        setErrorMessage(result.message || `Unable to add ${isCity ? "city" : "activity"}. Please try again.`);
      }
    } catch (_err) {
      setStatus("error");
      setErrorMessage(`Unable to add ${isCity ? "city" : "activity"}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Luggage className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Add to Trip</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
          <img
            src={targetItem.item.imageUrl}
            alt={itemTitle}
            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-800"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              {isCity ? "City Destination" : "Activity"}
            </p>
            <h4 className="text-sm font-bold text-white truncate">{itemTitle}</h4>
            <p className="text-xs text-slate-400 truncate">
              {isCity
                ? (targetItem.item as City).country
                : `${(targetItem.item as Activity).cityName} • $${(targetItem.item as Activity).estimatedCost}`}
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {status === "success" && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">
              ✓ Added to {successTripTitle}!
            </span>
          </div>
        )}

        {/* Error Alert Banner */}
        {status === "error" && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-xs font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TripSelector
            trips={trips}
            selectedTripId={selectedTripId}
            onSelectTrip={setSelectedTripId}
            isLoadingTrips={loadingTrips}
          />

          {trips.length > 0 && (
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedTripId || isSubmitting || status === "success"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Trip</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
export default AddToTripModal;
