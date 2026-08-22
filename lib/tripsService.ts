export interface TripItem {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  dates: string;
  days: number;
  progress: number;
  status: "Upcoming" | "Planning" | "Draft" | "Completed";
  imageUrl: string;
  tags: string[];
  description?: string;
}

export interface StopItem {
  id: string;
  tripId: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  notes?: string;
  imageUrl?: string;
}

export interface ActivityItem {
  id: string;
  tripId: string;
  dayNumber: number;
  time: string;
  title: string;
  category: "Sightseeing" | "Dining" | "Transit" | "Activity" | "Relaxation";
  location: string;
  cost: number;
  notes?: string;
}

const STORAGE_KEY = "globetrotter_trips";
const STOPS_STORAGE_PREFIX = "globetrotter_stops_";
const ACTIVITIES_STORAGE_PREFIX = "globetrotter_activities_";

// Initial Default Seed Trips
const DEFAULT_TRIPS: TripItem[] = [
  {
    id: "1",
    title: "Summer in Amalfi Coast",
    location: "Positano & Capri, Italy",
    startDate: "2026-07-14",
    endDate: "2026-07-24",
    dates: "Jul 14 - Jul 24, 2026",
    days: 10,
    progress: 85,
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    tags: ["Beach", "Relaxation", "Food"],
    description: "Cruising Positano cliffside villages and boat tour to Capri Blue Grotto.",
  },
  {
    id: "2",
    title: "Kyoto Autumn Leaves",
    location: "Kyoto & Tokyo, Japan",
    startDate: "2026-10-05",
    endDate: "2026-10-15",
    dates: "Oct 05 - Oct 15, 2026",
    days: 10,
    progress: 40,
    status: "Planning",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    tags: ["Culture", "Nature", "Photography"],
    description: "Autumn maple leaf viewing at Fushimi Inari and tea ceremonies.",
  },
  {
    id: "3",
    title: "Paris Weekend Getaway",
    location: "Paris, France",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    dates: "Nov 20 - Nov 23, 2026",
    days: 4,
    progress: 20,
    status: "Draft",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    tags: ["City", "Art", "Romantic"],
    description: "Louvre museum evening tour and Seine river cruise.",
  },
];

// Initial Seed Stops
const DEFAULT_STOPS_MAP: Record<string, StopItem[]> = {
  "1": [
    {
      id: "stop-1",
      tripId: "1",
      cityName: "Positano",
      country: "Italy",
      arrivalDate: "2026-07-14",
      departureDate: "2026-07-19",
      nights: 5,
      notes: "Stay at cliffside villa, dinner at Le Sirenuse, path of the gods hike.",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "stop-2",
      tripId: "1",
      cityName: "Capri",
      country: "Italy",
      arrivalDate: "2026-07-19",
      departureDate: "2026-07-24",
      nights: 5,
      notes: "Private boat tour to Blue Grotto, Anacapri chairlift, Faraglioni rocks.",
      imageUrl: "https://images.unsplash.com/photo-1565031491910-e57fac031c41?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

// Initial Seed Activities for Trip "1"
const DEFAULT_ACTIVITIES_MAP: Record<string, ActivityItem[]> = {
  "1": [
    {
      id: "act-1",
      tripId: "1",
      dayNumber: 1,
      time: "02:00 PM",
      title: "Villa Check-in & Welcome Drinks",
      category: "Relaxation",
      location: "Positano Cliffside Villa",
      cost: 0,
      notes: "Unpack and enjoy terrace views over the Tyrrhenian Sea.",
    },
    {
      id: "act-2",
      tripId: "1",
      dayNumber: 1,
      time: "07:30 PM",
      title: "Sunset Cocktail at Franco's Bar",
      category: "Dining",
      location: "Franco's Bar, Le Sirenuse",
      cost: 65,
      notes: "Arrive 30 mins early for champagne terrace seating.",
    },
    {
      id: "act-3",
      tripId: "1",
      dayNumber: 2,
      time: "09:30 AM",
      title: "Path of the Gods Hiking Trail",
      category: "Activity",
      location: "Bomerano to Nocelle",
      cost: 20,
      notes: "Pack sunscreen, water bottles, and sturdy trail sneakers.",
    },
    {
      id: "act-4",
      tripId: "1",
      dayNumber: 2,
      time: "01:30 PM",
      title: "Beachside Lunch at La Scogliera",
      category: "Dining",
      location: "La Scogliera Positano",
      cost: 110,
      notes: "Fresh grilled sea bass and lemon sorbet.",
    },
    {
      id: "act-5",
      tripId: "1",
      dayNumber: 3,
      time: "09:00 AM",
      title: "Private Boat Cruise to Blue Grotto",
      category: "Sightseeing",
      location: "Marina Grande, Capri",
      cost: 220,
      notes: "Includes island swim stops and Faraglioni rock pass-through.",
    },
  ],
};

/** Fetch all user trips dynamically */
export function getUserTrips(): TripItem[] {
  if (typeof window === "undefined") return DEFAULT_TRIPS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRIPS));
    return DEFAULT_TRIPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_TRIPS;
  }
}

/** Create a new trip and persist it */
export function createTrip(newTripData: Omit<TripItem, "id" | "progress" | "status"> & { id?: string; status?: TripItem["status"] }): TripItem {
  const trips = getUserTrips();
  const created: TripItem = {
    id: newTripData.id || Date.now().toString(),
    title: newTripData.title,
    location: newTripData.location,
    startDate: newTripData.startDate,
    endDate: newTripData.endDate,
    dates: newTripData.dates,
    days: newTripData.days || 7,
    progress: 10,
    status: newTripData.status || "Upcoming",
    imageUrl: newTripData.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    tags: newTripData.tags || ["Custom"],
    description: newTripData.description || "",
  };

  const updatedTrips = [created, ...trips];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    window.dispatchEvent(new Event("trips_updated"));
  }
  return created;
}

/** Delete trip by ID */
export function deleteTripById(id: string): void {
  const trips = getUserTrips();
  const updatedTrips = trips.filter((t) => t.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    localStorage.removeItem(`${STOPS_STORAGE_PREFIX}${id}`);
    localStorage.removeItem(`${ACTIVITIES_STORAGE_PREFIX}${id}`);
    window.dispatchEvent(new Event("trips_updated"));
  }
}

/** Get a single trip by ID */
export function getTripById(id: string): TripItem | undefined {
  const trips = getUserTrips();
  return trips.find((t) => t.id === id);
}

/** Get stops for a specific trip */
export function getTripStops(tripId: string): StopItem[] {
  if (typeof window === "undefined") return DEFAULT_STOPS_MAP[tripId] || [];
  const key = `${STOPS_STORAGE_PREFIX}${tripId}`;
  const stored = localStorage.getItem(key);
  if (!stored) {
    const seed = DEFAULT_STOPS_MAP[tripId] || [];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_STOPS_MAP[tripId] || [];
  }
}

/** Add a new stop to a trip */
export function addTripStop(
  tripId: string,
  stopData: Omit<StopItem, "id" | "tripId">
): StopItem {
  const stops = getTripStops(tripId);
  const newStop: StopItem = {
    ...stopData,
    id: `stop-${Date.now()}`,
    tripId,
  };
  const updatedStops = [...stops, newStop];
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STOPS_STORAGE_PREFIX}${tripId}`, JSON.stringify(updatedStops));
    window.dispatchEvent(new Event(`stops_updated_${tripId}`));
  }
  return newStop;
}

/** Remove a stop from a trip */
export function removeTripStop(tripId: string, stopId: string): void {
  const stops = getTripStops(tripId);
  const updatedStops = stops.filter((s) => s.id !== stopId);
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STOPS_STORAGE_PREFIX}${tripId}`, JSON.stringify(updatedStops));
    window.dispatchEvent(new Event(`stops_updated_${tripId}`));
  }
}

/** Save reordered stops array */
export function reorderTripStops(tripId: string, newStops: StopItem[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STOPS_STORAGE_PREFIX}${tripId}`, JSON.stringify(newStops));
    window.dispatchEvent(new Event(`stops_updated_${tripId}`));
  }
}

/** Get activities for a specific trip */
export function getTripActivities(tripId: string): ActivityItem[] {
  if (typeof window === "undefined") return DEFAULT_ACTIVITIES_MAP[tripId] || [];
  const key = `${ACTIVITIES_STORAGE_PREFIX}${tripId}`;
  const stored = localStorage.getItem(key);
  if (!stored) {
    const seed = DEFAULT_ACTIVITIES_MAP[tripId] || [];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ACTIVITIES_MAP[tripId] || [];
  }
}

/** Add a new activity to a trip */
export function addTripActivity(
  tripId: string,
  activityData: Omit<ActivityItem, "id" | "tripId">
): ActivityItem {
  const activities = getTripActivities(tripId);
  const created: ActivityItem = {
    ...activityData,
    id: `act-${Date.now()}`,
    tripId,
  };
  const updated = [...activities, created];
  if (typeof window !== "undefined") {
    localStorage.setItem(`${ACTIVITIES_STORAGE_PREFIX}${tripId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event(`activities_updated_${tripId}`));
  }
  return created;
}

/** Update an existing activity */
export function updateTripActivity(
  tripId: string,
  activityId: string,
  updatedFields: Partial<ActivityItem>
): ActivityItem | undefined {
  const activities = getTripActivities(tripId);
  let updatedItem: ActivityItem | undefined;

  const updatedList = activities.map((act) => {
    if (act.id === activityId) {
      updatedItem = { ...act, ...updatedFields };
      return updatedItem;
    }
    return act;
  });

  if (typeof window !== "undefined" && updatedItem) {
    localStorage.setItem(`${ACTIVITIES_STORAGE_PREFIX}${tripId}`, JSON.stringify(updatedList));
    window.dispatchEvent(new Event(`activities_updated_${tripId}`));
  }
  return updatedItem;
}

/** Remove an activity from a trip */
export function removeTripActivity(tripId: string, activityId: string): void {
  const activities = getTripActivities(tripId);
  const updated = activities.filter((act) => act.id !== activityId);
  if (typeof window !== "undefined") {
    localStorage.setItem(`${ACTIVITIES_STORAGE_PREFIX}${tripId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event(`activities_updated_${tripId}`));
  }
}

/** Reorder activities list */
export function reorderTripActivities(tripId: string, newActivities: ActivityItem[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${ACTIVITIES_STORAGE_PREFIX}${tripId}`, JSON.stringify(newActivities));
    window.dispatchEvent(new Event(`activities_updated_${tripId}`));
  }
}
