"use client";

import React, { useState, useEffect } from "react";
import {
  getTripActivities,
  addTripActivity,
  updateTripActivity,
  removeTripActivity,
  reorderTripActivities,
  ActivityItem,
  getTripStops,
  StopItem,
} from "@/lib/tripsService";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Utensils,
  Camera,
  Compass,
  Car,
  Palmtree,
  X,
  CheckCircle2,
  Sparkles,
  Edit2,
} from "lucide-react";

export type ActivityCategory = "Sightseeing" | "Dining" | "Transit" | "Activity" | "Relaxation";

interface ItineraryBuilderProps {
  tripId?: string;
  totalDays?: number;
}

export default function ItineraryBuilder({ tripId = "1", totalDays = 5 }: ItineraryBuilderProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stops, setStops] = useState<StopItem[]>([]);
  const [activeModalDay, setActiveModalDay] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // New/Edit Activity Form State
  const [formData, setFormData] = useState({
    title: "",
    time: "10:00 AM",
    category: "Sightseeing" as ActivityCategory,
    location: "",
    cost: "",
    notes: "",
  });

  const [formError, setFormError] = useState("");

  // Fetch Activities & Stops for this specific tripId
  const fetchActivitiesData = () => {
    const fetched = getTripActivities(tripId);
    setActivities(fetched);
    setStops(getTripStops(tripId));
  };

  useEffect(() => {
    fetchActivitiesData();

    const eventName = `activities_updated_${tripId}`;
    window.addEventListener(eventName, fetchActivitiesData);
    return () => window.removeEventListener(eventName, fetchActivitiesData);
  }, [tripId]);

  // Helper Category Meta Icon & Color Badge
  const getCategoryMeta = (cat: ActivityCategory) => {
    switch (cat) {
      case "Dining":
        return { icon: Utensils, bg: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
      case "Sightseeing":
        return { icon: Camera, bg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" };
      case "Activity":
        return { icon: Compass, bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
      case "Transit":
        return { icon: Car, bg: "bg-blue-500/15 text-blue-300 border-blue-500/30" };
      case "Relaxation":
        return { icon: Palmtree, bg: "bg-purple-500/15 text-purple-300 border-purple-500/30" };
      default:
        return { icon: Sparkles, bg: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  // Reordering Logic: Move Up or Down
  const moveActivity = (dayNum: number, activityId: string, direction: "up" | "down") => {
    const dayActivities = activities.filter((a) => a.dayNumber === dayNum);
    const index = dayActivities.findIndex((a) => a.id === activityId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dayActivities.length) return;

    // Swap items in local day list
    const newDayList = [...dayActivities];
    const temp = newDayList[index];
    newDayList[index] = newDayList[targetIndex];
    newDayList[targetIndex] = temp;

    // Reconstruct global activities list
    const otherActivities = activities.filter((a) => a.dayNumber !== dayNum);
    const updatedGlobal = [...otherActivities, ...newDayList];

    setActivities(updatedGlobal);
    reorderTripActivities(tripId, updatedGlobal);
    showToast("Activity order updated! 🔄");
  };

  // Delete Activity
  const handleDeleteActivity = (activityId: string) => {
    removeTripActivity(tripId, activityId);
    showToast("Activity removed from itinerary.");
  };

  // Open Edit Modal
  const openEditModal = (act: ActivityItem) => {
    setEditingActivity(act);
    setActiveModalDay(act.dayNumber);
    setFormData({
      title: act.title,
      time: act.time,
      category: act.category,
      location: act.location || "",
      cost: act.cost ? act.cost.toString() : "",
      notes: act.notes || "",
    });
    setFormError("");
  };

  // Save Activity Form Submit (Create or Update)
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Activity title is required.");
      return;
    }

    if (editingActivity) {
      // Update existing activity
      updateTripActivity(tripId, editingActivity.id, {
        title: formData.title.trim(),
        time: formData.time.trim() || "10:00 AM",
        category: formData.category,
        location: formData.location.trim(),
        cost: parseFloat(formData.cost) || 0,
        notes: formData.notes.trim(),
      });
      showToast(`Updated "${formData.title}"! ✨`);
    } else if (activeModalDay !== null) {
      // Create new activity
      addTripActivity(tripId, {
        dayNumber: activeModalDay,
        time: formData.time.trim() || "10:00 AM",
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        cost: parseFloat(formData.cost) || 0,
        notes: formData.notes.trim(),
      });
      showToast(`Added "${formData.title}" to Day ${activeModalDay}! ✨`);
    }

    setActiveModalDay(null);
    setEditingActivity(null);
    setFormData({ title: "", time: "10:00 AM", category: "Sightseeing", location: "", cost: "", notes: "" });
    setFormError("");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Compute Total Trip Budget
  const totalTripCost = activities.reduce((acc, act) => acc + (act.cost || 0), 0);

  // Group activities by Day Number (1 to maxDays)
  const maxDays = Math.max(totalDays, ...activities.map((a) => a.dayNumber), 3);
  const dayNumbers = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Map day numbers to city stop name if available
  const getCityForDay = (dayNum: number) => {
    if (stops.length === 0) return "Positano";
    const stopIndex = Math.min(Math.floor((dayNum - 1) / 2), stops.length - 1);
    return stops[stopIndex]?.cityName || stops[0]?.cityName || "Destination";
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Day-by-Day Detailed Itinerary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Organize daily activities, schedule times, and adjust sequence.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Total Estimated Cost: <span className="text-white font-bold">${totalTripCost}</span></span>
          </div>
        </div>
      </div>

      {/* Days Breakdown List */}
      <div className="space-y-8">
        {dayNumbers.map((dayNum) => {
          const dayActivities = activities.filter((a) => a.dayNumber === dayNum);
          const dayCost = dayActivities.reduce((acc, act) => acc + (act.cost || 0), 0);
          const cityName = getCityForDay(dayNum);

          return (
            <div key={dayNum} className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-5 shadow-xl">
              
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    D{dayNum}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Day {dayNum} • {cityName}
                    </h3>
                    <p className="text-xs text-slate-400">{dayActivities.length} {dayActivities.length === 1 ? "Activity" : "Activities"} Planned</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    Day Budget: <span className="text-emerald-400 font-bold">${dayCost}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingActivity(null);
                      setActiveModalDay(dayNum);
                      setFormData({ title: "", time: "10:00 AM", category: "Sightseeing", location: "", cost: "", notes: "" });
                      setFormError("");
                    }}
                    className="py-1.5 px-3.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>

              {/* Day Activities Timeline List */}
              {dayActivities.length > 0 ? (
                <div className="relative pl-4 sm:pl-6 space-y-4 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {dayActivities.map((act, index) => {
                    const meta = getCategoryMeta(act.category);
                    const CategoryIcon = meta.icon;
                    const isFirst = index === 0;
                    const isLast = index === dayActivities.length - 1;

                    return (
                      <div key={act.id} className="relative group">
                        
                        {/* Timeline Bullet Dot */}
                        <div className="absolute -left-4 sm:-left-6 top-4 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all z-10" />

                        {/* Activity Card */}
                        <div className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-4 shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          
                          {/* Activity Details */}
                          <div className="flex items-start gap-3.5 flex-1">
                            <div className={`p-2.5 rounded-xl border flex-shrink-0 ${meta.bg}`}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  {act.time}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${meta.bg}`}>
                                  {act.category}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {act.title}
                              </h4>

                              {act.location && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-cyan-400" />
                                  <span>{act.location}</span>
                                </p>
                              )}

                              {act.notes && (
                                <p className="text-xs text-slate-400 italic bg-slate-800/50 p-2 rounded-lg mt-1 border border-slate-800/80">
                                  "{act.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Controls: Cost & Edit/Delete/Reorder Actions */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                            
                            {/* Cost Pill */}
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                              {act.cost > 0 ? `$${act.cost}` : "Free"}
                            </span>

                            {/* Reordering Up / Down Arrows */}
                            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => moveActivity(dayNum, act.id, "up")}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => moveActivity(dayNum, act.id, "down")}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() => openEditModal(act)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                              title="Edit Activity"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Day Activities Placeholder */
                <div className="text-center py-6 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-2">
                  <p className="text-xs text-slate-400">No activities scheduled for Day {dayNum} yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingActivity(null);
                      setActiveModalDay(dayNum);
                      setFormData({ title: "", time: "10:00 AM", category: "Sightseeing", location: "", cost: "", notes: "" });
                      setFormError("");
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    + Add Activity to Day {dayNum}
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Add / Edit Activity Modal Dialog */}
      {activeModalDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  {editingActivity ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingActivity ? `Edit Activity (Day ${activeModalDay})` : `Add Activity to Day ${activeModalDay}`}
                  </h3>
                  <p className="text-xs text-slate-400">Specify details for your scheduled activity.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModalDay(null);
                  setEditingActivity(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sunset Drinks at Franco's Bar"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                {formError && <p className="mt-1 text-xs text-rose-500">{formError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Time / Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 09:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as ActivityCategory }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Sightseeing">📸 Sightseeing</option>
                    <option value="Dining">🍽️ Dining & Drinks</option>
                    <option value="Activity">🏔️ Outdoor & Activity</option>
                    <option value="Transit">🚗 Transport</option>
                    <option value="Relaxation">🏖️ Relaxation & Beach</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Positano Main Pier"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Est. Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 45"
                    value={formData.cost}
                    onChange={(e) => setFormData((p) => ({ ...p, cost: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notes / Tips (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add dress code, reservation details, or ticket notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalDay(null);
                    setEditingActivity(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {editingActivity ? "Update Activity" : "Save Activity"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
