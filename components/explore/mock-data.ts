import {
  City,
  Activity,
  Trip,
  BudgetSummary,
  CityFilterState,
  ActivityFilterState,
} from "./types";

/**
 * TEMPORARY MOCK DATA FOR MEMBER 3 (EXPLORE & BUDGET)
 * This mock data is used when Member 1's backend API is unreachable or not yet implemented.
 * When real APIs are available, functions fetch from endpoints seamlessly.
 */

export const MOCK_CITIES: City[] = [
  {
    id: "city-paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    description: "The City of Light boasts world-class art, culinary magic, iconic architecture, and romantic avenues.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    costIndex: "expensive",
    popularity: "high",
    rating: 4.9,
    featuredActivitiesCount: 24,
    tags: ["Romance", "Museums", "Culinary", "Historic"],
    averageCostPerDay: 180,
    currency: "USD",
  },
  {
    id: "city-tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    description: "A breathtaking contrast of ultramodern skyscrapers, neon-lit streets, historic shrines, and world-renowned food.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    costIndex: "moderate",
    popularity: "high",
    rating: 4.95,
    featuredActivitiesCount: 32,
    tags: ["Technology", "Foodie", "Culture", "Anime"],
    averageCostPerDay: 150,
    currency: "USD",
  },
  {
    id: "city-bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    description: "Tropical paradise featuring lush terraced rice paddies, pristine beaches, vibrant spiritual culture, and wellness retreats.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    costIndex: "budget",
    popularity: "high",
    rating: 4.8,
    featuredActivitiesCount: 18,
    tags: ["Beach", "Nature", "Wellness", "Relaxation"],
    averageCostPerDay: 65,
    currency: "USD",
  },
  {
    id: "city-rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    description: "An open-air museum filled with ancient ruins, magnificent baroque fountains, bustling piazzas, and unforgettable pasta.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    costIndex: "moderate",
    popularity: "high",
    rating: 4.85,
    featuredActivitiesCount: 20,
    tags: ["History", "Architecture", "Food", "Art"],
    averageCostPerDay: 140,
    currency: "USD",
  },
  {
    id: "city-reykjavik",
    name: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    description: "Gateway to geothermal wonders, cascading waterfalls, majestic glaciers, and the mesmerising Northern Lights.",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80",
    costIndex: "expensive",
    popularity: "medium",
    rating: 4.75,
    featuredActivitiesCount: 15,
    tags: ["Glaciers", "Northern Lights", "Adventure", "Nature"],
    averageCostPerDay: 210,
    currency: "USD",
  },
  {
    id: "city-cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    description: "Stunning coastal gem framed by Table Mountain, vineyards, dramatic ocean drives, and rich cultural heritage.",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    costIndex: "budget",
    popularity: "medium",
    rating: 4.7,
    featuredActivitiesCount: 14,
    tags: ["Coastal", "Hiking", "Wine", "Wildlife"],
    averageCostPerDay: 80,
    currency: "USD",
  },
  {
    id: "city-new-york",
    name: "New York City",
    country: "United States",
    region: "Americas",
    description: "The global metropolis that never sleeps, packed with Broadway shows, world-class dining, Central Park, and iconic skyline views.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    costIndex: "expensive",
    popularity: "high",
    rating: 4.88,
    featuredActivitiesCount: 40,
    tags: ["City", "Broadway", "Nightlife", "Shopping"],
    averageCostPerDay: 250,
    currency: "USD",
  },
  {
    id: "city-sydney",
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    description: "Famous harbor city featuring the Opera House, Bondi Beach surfing, coastal walks, and vibrant harbor cruises.",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    costIndex: "expensive",
    popularity: "high",
    rating: 4.82,
    featuredActivitiesCount: 19,
    tags: ["Harbor", "Beaches", "Surfing", "Outdoors"],
    averageCostPerDay: 195,
    currency: "USD",
  },
  {
    id: "city-cairo",
    name: "Cairo",
    country: "Egypt",
    region: "Africa",
    description: "Ancient wonderland home to the Pyramids of Giza, the Nile River, sprawling bazaars, and millennia of history.",
    imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80",
    costIndex: "budget",
    popularity: "medium",
    rating: 4.65,
    featuredActivitiesCount: 16,
    tags: ["Ancient", "Pyramids", "Nile", "Culture"],
    averageCostPerDay: 55,
    currency: "USD",
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  // Paris
  {
    id: "act-eiffel",
    cityId: "city-paris",
    cityName: "Paris",
    name: "Eiffel Tower Summit Tour",
    category: "Sightseeing",
    description: "Ascend to the top of Paris' iconic iron tower for panoramic views of the city at sunset.",
    imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 35,
    currency: "USD",
    durationHours: 2.5,
    location: "Champ de Mars, Paris",
    rating: 4.9,
    costLevel: "Medium",
  },
  {
    id: "act-louvre",
    cityId: "city-paris",
    cityName: "Paris",
    name: "Louvre Museum Guided Walk",
    category: "Culture",
    description: "Explore world treasures including the Mona Lisa and Venus de Milo with an expert art historian.",
    imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 28,
    currency: "USD",
    durationHours: 3,
    location: "Rue de Rivoli, Paris",
    rating: 4.95,
    costLevel: "Medium",
  },
  {
    id: "act-seine",
    cityId: "city-paris",
    cityName: "Paris",
    name: "Seine River Evening Cruise with Wine",
    category: "Sightseeing",
    description: "Glide past illuminated monuments along the Seine while sipping fine French wine.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 45,
    currency: "USD",
    durationHours: 1.5,
    location: "Pont Neuf, Paris",
    rating: 4.8,
    costLevel: "Medium",
  },
  {
    id: "act-bakery",
    cityId: "city-paris",
    cityName: "Paris",
    name: "French Croissant & Pastry Masterclass",
    category: "Food",
    description: "Learn secret French baking techniques from a master baker and take home hot fresh croissants.",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 75,
    currency: "USD",
    durationHours: 2,
    location: "Le Marais, Paris",
    rating: 4.88,
    costLevel: "High",
  },

  // Tokyo
  {
    id: "act-sensoji",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    name: "Asakusa & Senso-ji Temple Morning Walk",
    category: "Culture",
    description: "Discover Tokyo's oldest temple, burn incense, and sample traditional street snacks along Nakamise.",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 15,
    currency: "USD",
    durationHours: 2,
    location: "Asakusa, Tokyo",
    rating: 4.85,
    costLevel: "Low",
  },
  {
    id: "act-ramen",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    name: "Shinjuku Ramen & Izakaya Food Tour",
    category: "Food",
    description: "Hop through hidden alleyway eateries in Omoide Yokocho for legendary ramen and yakitori skewers.",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 55,
    currency: "USD",
    durationHours: 3,
    location: "Shinjuku, Tokyo",
    rating: 4.92,
    costLevel: "Medium",
  },
  {
    id: "act-teamlab",
    cityId: "city-tokyo",
    cityName: "Tokyo",
    name: "teamLab Planets Digital Art Immersion",
    category: "Entertainment",
    description: "Walk through water and body-immersive digital light projections in this futuristic museum.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 32,
    currency: "USD",
    durationHours: 2,
    location: "Toyosu, Tokyo",
    rating: 4.9,
    costLevel: "Medium",
  },

  // Bali
  {
    id: "act-ubud-swing",
    cityId: "city-bali",
    cityName: "Bali",
    name: "Tegallalang Rice Terrace & Jungle Swing",
    category: "Adventure",
    description: "Soar high over emerald green rice fields on giant jungle swings and capture unforgettable photos.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 20,
    currency: "USD",
    durationHours: 3,
    location: "Ubud, Bali",
    rating: 4.78,
    costLevel: "Low",
  },
  {
    id: "act-batur-trek",
    cityId: "city-bali",
    cityName: "Bali",
    name: "Mount Batur Sunrise Volcano Trek",
    category: "Adventure",
    description: "Hike an active volcano under starry skies to catch a breathtaking sunrise above the clouds.",
    imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 40,
    currency: "USD",
    durationHours: 6,
    location: "Kintamani, Bali",
    rating: 4.9,
    costLevel: "Medium",
  },

  // Rome
  {
    id: "act-colosseum",
    cityId: "city-rome",
    cityName: "Rome",
    name: "Colosseum & Roman Forum Priority Access",
    category: "Sightseeing",
    description: "Step into the gladiatorial arena and walk the ancient ruins where Roman emperors once ruled.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 30,
    currency: "USD",
    durationHours: 3,
    location: "Piazza del Colosseo, Rome",
    rating: 4.91,
    costLevel: "Medium",
  },
  {
    id: "act-gelato",
    cityId: "city-rome",
    cityName: "Rome",
    name: "Trastevere Street Food & Artisanal Gelato",
    category: "Food",
    description: "Taste authentic Roman suppli, crispy pizza al taglio, and creamy gelato in charming cobblestone alleys.",
    imageUrl: "https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 35,
    currency: "USD",
    durationHours: 2.5,
    location: "Trastevere, Rome",
    rating: 4.87,
    costLevel: "Medium",
  },

  // Reykjavik
  {
    id: "act-blue-lagoon",
    cityId: "city-reykjavik",
    cityName: "Reykjavik",
    name: "Blue Lagoon Retreat & Silica Mud Bath",
    category: "Nature",
    description: "Soak in milky blue geothermal waters surrounded by black volcanic lava fields.",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    estimatedCost: 95,
    currency: "USD",
    durationHours: 4,
    location: "Grindavik, Iceland",
    rating: 4.85,
    costLevel: "High",
  },
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: "trip-europe-2026",
    title: "Europe Summer Adventure",
    destination: "Paris & Rome",
    startDate: "2026-06-10",
    endDate: "2026-06-20",
    totalDays: 10,
    budgetLimit: 2500,
    currency: "USD",
  },
  {
    id: "trip-japan-spring",
    title: "Tokyo Cherry Blossom Getaway",
    destination: "Tokyo",
    startDate: "2026-04-01",
    endDate: "2026-04-08",
    totalDays: 7,
    budgetLimit: 1800,
    currency: "USD",
  },
  {
    id: "trip-bali-wellness",
    title: "Bali Tropical Escape",
    destination: "Bali",
    startDate: "2026-09-15",
    endDate: "2026-09-25",
    totalDays: 10,
    budgetLimit: 1200,
    currency: "USD",
  },
];

export const MOCK_BUDGET: BudgetSummary = {
  tripId: "trip-europe-2026",
  tripTitle: "Europe Summer Adventure",
  totalEstimatedCost: 2180,
  budgetLimit: 2500,
  currency: "USD",
  tripDays: 10,
  averageDailyCost: 218,
  remainingBudget: 320,
  overAmount: 0,
  isOverBudget: false,
  categories: [
    { name: "Transport", amount: 650, iconName: "Plane" },
    { name: "Accommodation", amount: 900, iconName: "Hotel" },
    { name: "Activities", amount: 320, iconName: "Ticket" },
    { name: "Food", amount: 240, iconName: "Utensils" },
    { name: "Other", amount: 70, iconName: "ShoppingBag" },
  ],
};

// Data Helper Functions with robust fallback handling

export async function fetchCities(filters?: CityFilterState): Promise<City[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.set("search", filters.searchQuery);
    if (filters?.country && filters.country !== "all") params.set("country", filters.country);
    if (filters?.region && filters.region !== "all") params.set("region", filters.region);
    if (filters?.costIndex && filters.costIndex !== "all") params.set("costIndex", filters.costIndex);
    if (filters?.popularity && filters.popularity !== "all") params.set("popularity", filters.popularity);

    const res = await fetch(`/api/cities?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (_e) {
    // API endpoint not implemented yet by M1, fall back cleanly to mock data
  }

  // Filter client side using mock data
  let result = [...MOCK_CITIES];

  if (filters) {
    const query = filters.searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query) ||
          c.region.toLowerCase().includes(query) ||
          c.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (filters.country && filters.country !== "all") {
      result = result.filter(
        (c) => c.country.toLowerCase() === filters.country.toLowerCase()
      );
    }

    if (filters.region && filters.region !== "all") {
      result = result.filter(
        (c) => c.region.toLowerCase() === filters.region.toLowerCase()
      );
    }

    if (filters.costIndex && filters.costIndex !== "all") {
      result = result.filter((c) => c.costIndex === filters.costIndex);
    }

    if (filters.popularity && filters.popularity !== "all") {
      result = result.filter((c) => c.popularity === filters.popularity);
    }
  }

  return result;
}

export async function fetchCityById(cityId: string): Promise<City | null> {
  try {
    const res = await fetch(`/api/cities/${cityId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch (_e) {
    // Fall back to mock
  }

  const found = MOCK_CITIES.find(
    (c) => c.id === cityId || c.name.toLowerCase() === cityId.toLowerCase()
  );
  return found || null;
}

export async function fetchActivities(
  cityId?: string,
  filters?: ActivityFilterState
): Promise<Activity[]> {
  try {
    const params = new URLSearchParams();
    if (cityId) params.set("cityId", cityId);
    if (filters?.searchQuery) params.set("search", filters.searchQuery);
    if (filters?.category && filters.category !== "all") params.set("category", filters.category);
    if (filters?.cost && filters.cost !== "all") params.set("cost", filters.cost);
    if (filters?.duration && filters.duration !== "any") params.set("duration", filters.duration);

    const res = await fetch(`/api/activities?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (_e) {
    // Fallback to mock
  }

  let result = [...MOCK_ACTIVITIES];

  if (cityId) {
    result = result.filter(
      (a) => a.cityId === cityId || a.cityName.toLowerCase() === cityId.toLowerCase()
    );
  }

  if (filters) {
    const q = filters.searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.cityName.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((a) => a.category === filters.category);
    }

    if (filters.cost && filters.cost !== "all") {
      result = result.filter(
        (a) => a.costLevel?.toLowerCase() === filters.cost.toLowerCase()
      );
    }

    if (filters.duration && filters.duration !== "any") {
      if (filters.duration === "short") {
        result = result.filter((a) => a.durationHours < 1);
      } else if (filters.duration === "medium") {
        result = result.filter((a) => a.durationHours >= 1 && a.durationHours <= 3);
      } else if (filters.duration === "long") {
        result = result.filter((a) => a.durationHours > 3);
      }
    }
  }

  return result;
}

export async function fetchUserTrips(): Promise<Trip[]> {
  try {
    const res = await fetch("/api/trips");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (_e) {
    // Fallback to mock
  }

  return MOCK_TRIPS;
}

export async function fetchTripBudget(tripId: string): Promise<BudgetSummary> {
  try {
    const res = await fetch(`/api/trips/${tripId}/budget`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.totalEstimatedCost !== undefined) {
        return data;
      }
    }
  } catch (_e) {
    // Fallback
  }

  // Calculate or return mock
  const trip = MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];

  const totalEstimatedCost = MOCK_BUDGET.totalEstimatedCost;
  const budgetLimit = trip.budgetLimit;
  const remainingBudget = Math.max(0, budgetLimit - totalEstimatedCost);
  const overAmount = Math.max(0, totalEstimatedCost - budgetLimit);
  const isOverBudget = totalEstimatedCost > budgetLimit;
  const tripDays = trip.totalDays || 1;
  const averageDailyCost = Math.round(totalEstimatedCost / (tripDays || 1));

  return {
    ...MOCK_BUDGET,
    tripId: trip.id,
    tripTitle: trip.title,
    budgetLimit,
    remainingBudget,
    overAmount,
    isOverBudget,
    tripDays,
    averageDailyCost,
  };
}

export async function addCityToTrip(tripId: string, cityId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/trips/${tripId}/stops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId }),
    });

    if (res.ok) {
      return { success: true };
    }
    
    // If endpoint exists but returned error status
    if (res.status === 401 || res.status === 403) {
      return { success: false, message: "Unauthorized. Please sign in." };
    }
  } catch (_e) {
    // Backend API not connected yet, simulate successful mock addition
  }

  // Simulate server latency
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true };
}

export async function addActivityToTrip(tripId: string, activityId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/trips/${tripId}/itinerary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });

    if (res.ok) {
      return { success: true };
    }

    if (res.status === 401 || res.status === 403) {
      return { success: false, message: "Unauthorized. Please sign in." };
    }
  } catch (_e) {
    // Backend API not connected yet, simulate successful mock addition
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true };
}
