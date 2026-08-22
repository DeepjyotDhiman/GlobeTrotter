"use client";

import React from "react";
import TimelineItem, { TimelineActivity } from "./timeline-item";

interface TimelineProps {
  activities: TimelineActivity[];
  onEditActivity?: (activity: TimelineActivity) => void;
  onDeleteActivity?: (id: string) => void;
}

export default function Timeline({
  activities,
  onEditActivity,
  onDeleteActivity,
}: TimelineProps) {
  // Sort activities by time (e.g. 09:00 AM, 11:30 AM, 02:00 PM)
  const sortedActivities = [...activities].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="relative space-y-6 font-sans">
      {sortedActivities.map((activity, index) => (
        <TimelineItem
          key={activity.id}
          activity={activity}
          isFirst={index === 0}
          isLast={index === sortedActivities.length - 1}
          onEdit={onEditActivity}
          onDelete={onDeleteActivity}
        />
      ))}
    </div>
  );
}
