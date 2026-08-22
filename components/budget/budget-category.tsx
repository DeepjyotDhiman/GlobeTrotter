import React from "react";
import { Plane, Hotel, Ticket, Utensils, ShoppingBag, PieChart } from "lucide-react";
import { CategoryExpense } from "../explore/types";

interface BudgetCategoryProps {
  category: CategoryExpense;
  totalCost: number;
  currency?: string;
}

export function BudgetCategoryItem({
  category,
  totalCost,
  currency = "$",
}: BudgetCategoryProps) {
  const percentage = totalCost > 0 ? (category.amount / totalCost) * 100 : 0;

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "transport":
        return <Plane className="w-4 h-4 text-cyan-400" />;
      case "accommodation":
        return <Hotel className="w-4 h-4 text-purple-400" />;
      case "activities":
        return <Ticket className="w-4 h-4 text-amber-400" />;
      case "food":
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-rose-400" />;
    }
  };

  const getBarColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "transport":
        return "bg-cyan-500";
      case "accommodation":
        return "bg-purple-500";
      case "activities":
        return "bg-amber-500";
      case "food":
        return "bg-emerald-500";
      default:
        return "bg-rose-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "₹" ? "INR" : "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            {getIcon(category.name)}
          </div>
          <div>
            <h5 className="font-bold text-slate-100">{category.name}</h5>
            <span className="text-[10px] text-slate-400 font-medium">
              {percentage.toFixed(1)}% of total
            </span>
          </div>
        </div>

        <div className="font-bold text-slate-100 text-sm">
          {formatCurrency(category.amount)}
        </div>
      </div>

      {/* Mini percentage progress line */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(category.name)}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}
export default BudgetCategoryItem;
