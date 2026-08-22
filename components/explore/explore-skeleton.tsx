import React from "react";

export function CityCardSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-xl animate-pulse">
      <div className="h-52 bg-slate-800/60 relative" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-800/70 rounded-md w-3/4" />
            <div className="h-4 bg-slate-800/40 rounded-md w-1/2" />
          </div>
          <div className="h-6 bg-slate-800/70 rounded-full w-12" />
        </div>
        <div className="h-10 bg-slate-800/40 rounded-lg w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-slate-800/50 rounded-full w-16" />
          <div className="h-5 bg-slate-800/50 rounded-full w-16" />
        </div>
        <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
          <div className="h-5 bg-slate-800/60 rounded w-20" />
          <div className="h-9 bg-slate-800/80 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-lg animate-pulse flex flex-col md:flex-row">
      <div className="md:w-48 h-44 bg-slate-800/60 shrink-0" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="h-5 bg-slate-800/70 rounded w-2/3" />
            <div className="h-5 bg-slate-800/60 rounded-full w-16 shrink-0" />
          </div>
          <div className="h-4 bg-slate-800/40 rounded w-1/3" />
          <div className="h-8 bg-slate-800/30 rounded w-full" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
          <div className="h-5 bg-slate-800/60 rounded w-24" />
          <div className="h-8 bg-slate-800/80 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export function CityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CityCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ActivityListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CityDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-80 md:h-96 rounded-3xl bg-slate-800/60 relative overflow-hidden" />
      <div className="space-y-4">
        <div className="h-8 bg-slate-800/80 rounded w-1/3" />
        <div className="h-4 bg-slate-800/50 rounded w-1/4" />
        <div className="h-16 bg-slate-800/30 rounded w-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-900/80 border border-slate-800 rounded-2xl p-4" />
        ))}
      </div>
    </div>
  );
}
