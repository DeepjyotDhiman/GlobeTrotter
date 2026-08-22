"use client";

import React from "react";
import CalendarView from "./calendar-view";

export default function TripCalendar() {
  return <CalendarView />;
}

export { default as CalendarView } from "./calendar-view";
export { default as Timeline } from "./timeline";
export { default as TimelineItem } from "./timeline-item";
export { default as CalendarEmptyState } from "./calendar-empty-state";
export { default as CalendarSkeleton } from "./calendar-skeleton";
