import React from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface BudgetProgressProps {
  totalEstimated: number;
  budgetLimit: number;
  currency?: string;
}

export function BudgetProgress({
  totalEstimated,
  budgetLimit,
  currency = "$",
}: BudgetProgressProps) {
  const percentage = budgetLimit > 0 ? (totalEstimated / budgetLimit) * 100 : 0;
  const clampedPercentage = Math.min(100, percentage);
  const isOver = totalEstimated > budgetLimit;
  const isNear = !isOver && percentage >= 85;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "₹" ? "INR" : "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getBarColor = () => {
    if (isOver) return "bg-gradient-to-r from-rose-500 to-red-600";
    if (isNear) return "bg-gradient-to-r from-amber-400 to-amber-500";
    return "bg-gradient-to-r from-cyan-500 to-emerald-400";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline text-xs">
        <span className="text-slate-400 font-medium">Budget Progress</span>
        <span className={`font-bold ${isOver ? "text-rose-400" : isNear ? "text-amber-400" : "text-cyan-400"}`}>
          {percentage.toFixed(1)}% Used
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {/* Numerical comparison */}
      <div className="flex justify-between items-center text-xs pt-1">
        <div>
          <span className="text-slate-400">Budget: </span>
          <span className="font-semibold text-slate-200">{formatCurrency(budgetLimit)}</span>
        </div>

        <div>
          <span className="text-slate-400">Estimated: </span>
          <span className={`font-bold ${isOver ? "text-rose-400" : "text-slate-100"}`}>
            {formatCurrency(totalEstimated)}
          </span>
        </div>
      </div>

      {/* Over budget callout text */}
      {isOver && (
        <div className="pt-1 text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>⚠ Over budget by {formatCurrency(totalEstimated - budgetLimit)}</span>
        </div>
      )}
    </div>
  );
}
export default BudgetProgress;
