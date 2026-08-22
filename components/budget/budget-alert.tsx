import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

interface BudgetAlertProps {
  totalEstimated: number;
  budgetLimit: number;
  currency?: string;
  className?: string;
}

export function BudgetAlert({
  totalEstimated,
  budgetLimit,
  currency = "$",
  className = "",
}: BudgetAlertProps) {
  if (!budgetLimit || budgetLimit <= 0) return null;

  const ratio = totalEstimated / budgetLimit;
  const isOver = totalEstimated > budgetLimit;
  const overAmount = Math.max(0, totalEstimated - budgetLimit);
  const isNear = !isOver && ratio >= 0.85;

  const formattedOverAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "₹" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(overAmount);

  if (isOver) {
    return (
      <div
        className={`p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-center gap-3 animate-fade-in ${className}`}
      >
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Over Budget Alert
          </h4>
          <p className="text-sm font-semibold text-rose-100">
            ⚠ Your trip is over budget by {formattedOverAmount}.
          </p>
        </div>
      </div>
    );
  }

  if (isNear) {
    return (
      <div
        className={`p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-center gap-3 animate-fade-in ${className}`}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Budget Warning
          </h4>
          <p className="text-sm font-semibold text-amber-100">
            ⚠ You are close to your budget limit ({Math.round(ratio * 100)}% used).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 flex items-center gap-3 animate-fade-in ${className}`}
    >
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Healthy Budget
        </h4>
        <p className="text-sm font-semibold text-emerald-100">
          ✓ You are within your budget limit.
        </p>
      </div>
    </div>
  );
}
export default BudgetAlert;
