"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Calendar, Wallet, AlertOctagon, RefreshCw } from "lucide-react";
import { BudgetSummary } from "../explore/types";
import { fetchTripBudget } from "../explore/mock-data";
import { BudgetProgress } from "./budget-progress";
import { BudgetBreakdown } from "./budget-breakdown";
import { BudgetAlert } from "./budget-alert";
import { BudgetOverviewSkeleton } from "./budget-skeleton";

interface BudgetOverviewProps {
  tripId?: string;
  initialData?: BudgetSummary;
}

export function BudgetOverview({ tripId, initialData }: BudgetOverviewProps) {
  const [budget, setBudget] = useState<BudgetSummary | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string>("");

  const loadData = async () => {
    if (!tripId && !initialData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchTripBudget(tripId || "trip-europe-2026");
      setBudget(data);
    } catch (_err) {
      setError("Unable to load budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData && tripId) {
      loadData();
    }
  }, [tripId, initialData]);

  if (loading) {
    return <BudgetOverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <p className="text-sm text-rose-400 font-semibold">{error}</p>
        <button
          onClick={loadData}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!budget) return null;

  const currency = budget.currency || "$";
  const tripDays = budget.tripDays > 0 ? budget.tripDays : 1;
  const averageDailyCost =
    budget.averageDailyCost || Math.round(budget.totalEstimatedCost / tripDays);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "₹" ? "INR" : "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <BudgetAlert
        totalEstimated={budget.totalEstimatedCost}
        budgetLimit={budget.budgetLimit}
        currency={currency}
      />

      {/* Main Budget Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              Trip Budget Summary
            </h3>
            <h2 className="text-2xl font-extrabold text-white">
              {budget.tripTitle || "European Adventure"}
            </h2>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{tripDays} Trip Days</span>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Total Estimated</span>
            <p className="text-xl font-black text-white">
              {formatCurrency(budget.totalEstimatedCost)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Avg. Daily Cost</span>
            <p className="text-xl font-black text-cyan-400">
              {formatCurrency(averageDailyCost)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Budget Limit</span>
            <p className="text-xl font-black text-slate-200">
              {formatCurrency(budget.budgetLimit)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">
              {budget.isOverBudget ? "Over Budget By" : "Remaining Budget"}
            </span>
            <p
              className={`text-xl font-black ${
                budget.isOverBudget ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {formatCurrency(
                budget.isOverBudget ? budget.overAmount : budget.remainingBudget
              )}
            </p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <BudgetProgress
          totalEstimated={budget.totalEstimatedCost}
          budgetLimit={budget.budgetLimit}
          currency={currency}
        />
      </div>

      {/* Breakdown Section */}
      <BudgetBreakdown
        categories={budget.categories}
        totalCost={budget.totalEstimatedCost}
        currency={currency}
      />
    </div>
  );
}
export default BudgetOverview;
