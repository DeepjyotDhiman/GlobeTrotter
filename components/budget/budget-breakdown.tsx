import React from "react";
import { PieChart } from "lucide-react";
import { CategoryExpense } from "../explore/types";
import { BudgetCategoryItem } from "./budget-category";

interface BudgetBreakdownProps {
  categories: CategoryExpense[];
  totalCost: number;
  currency?: string;
}

export function BudgetBreakdown({
  categories,
  totalCost,
  currency = "$",
}: BudgetBreakdownProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
        No category breakdown available.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <PieChart className="w-4 h-4 text-cyan-400" />
        <span>Expense Category Breakdown</span>
      </div>

      {/* Multi-segmented CSS progress bar */}
      {totalCost > 0 && (
        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          {categories.map((cat) => {
            const pct = (cat.amount / totalCost) * 100;
            if (pct <= 0) return null;
            let bgColor = "bg-rose-500";
            if (cat.name.toLowerCase() === "transport") bgColor = "bg-cyan-500";
            if (cat.name.toLowerCase() === "accommodation") bgColor = "bg-purple-500";
            if (cat.name.toLowerCase() === "activities") bgColor = "bg-amber-500";
            if (cat.name.toLowerCase() === "food") bgColor = "bg-emerald-500";

            return (
              <div
                key={cat.name}
                className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 ${bgColor}`}
                style={{ width: `${pct}%` }}
                title={`${cat.name}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      )}

      {/* List of Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {categories.map((cat) => (
          <BudgetCategoryItem
            key={cat.name}
            category={cat}
            totalCost={totalCost}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
export default BudgetBreakdown;
