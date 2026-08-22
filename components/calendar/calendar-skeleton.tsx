"use client";

import React from "react";

export default function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="relative pl-6 sm:pl-8">
          <div className="absolute left-0 sm:left-1 top-4 w-5 h-5 rounded-full bg-slate-800 animate-pulse" />
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-24 h-5 bg-slate-800 rounded-lg" />
              <div className="w-16 h-5 bg-slate-800 rounded-lg" />
            </div>
            <div className="w-3/4 h-5 bg-slate-800 rounded-lg" />
            <div className="w-1/2 h-4 bg-slate-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
