import React from "react";

export function BudgetOverviewSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-4 bg-slate-800 rounded w-28" />
          <div className="h-8 bg-slate-800 rounded w-44" />
        </div>
        <div className="h-6 bg-slate-800 rounded-full w-24" />
      </div>

      <div className="h-4 bg-slate-800/60 rounded-full w-full" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/40 rounded-2xl p-3" />
        ))}
      </div>
    </div>
  );
}

export function BudgetBreakdownSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-slate-800 rounded w-36" />
      <div className="space-y-3 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
