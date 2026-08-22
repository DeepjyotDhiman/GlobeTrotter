export type CostIndex = "budget" | "moderate" | "expensive";
export type PopularityLevel = "low" | "medium" | "high";

export type ActivityCategory =
  | "Sightseeing"
  | "Food"
  | "Adventure"
  | "Culture"
  | "Nature"
  | "Entertainment"
  | "Shopping";

export type DurationFilter = "any" | "short" | "medium" | "long"; // <1h, 1-3h, 3h+

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  costIndex: CostIndex; // "budget" | "moderate" | "expensive"
  popularity: PopularityLevel; // "low" | "medium" | "high"
  rating: number;
  featuredActivitiesCount?: number;
  tags?: string[];
  averageCostPerDay?: number;
  currency?: string;
}

export interface Activity {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  category: ActivityCategory;
  description: string;
  imageUrl: string;
  estimatedCost: number; // in numerical currency value
  currency: string;
  durationHours: number; // e.g. 0.5, 2, 4
  location?: string;
  rating: number;
  costLevel?: "Low" | "Medium" | "High";
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  budgetLimit: number;
  currency: string;
}

export interface CategoryExpense {
  name: "Transport" | "Accommodation" | "Activities" | "Food" | "Other";
  amount: number;
  iconName?: string;
}

export interface BudgetSummary {
  tripId?: string;
  tripTitle?: string;
  totalEstimatedCost: number;
  budgetLimit: number;
  currency: string;
  tripDays: number;
  averageDailyCost: number;
  remainingBudget: number;
  overAmount: number;
  isOverBudget: boolean;
  categories: CategoryExpense[];
}

export interface CityFilterState {
  searchQuery: string;
  country: string;
  region: string;
  costIndex: string; // "all" | "budget" | "moderate" | "expensive"
  popularity: string; // "all" | "high" | "medium" | "low"
}

export interface ActivityFilterState {
  searchQuery: string;
  category: string; // "all" | ActivityCategory
  cost: string; // "all" | "low" | "medium" | "high"
  duration: DurationFilter; // "any" | "short" | "medium" | "long"
}
