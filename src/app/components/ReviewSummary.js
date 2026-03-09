"use client";

import StarRating from "./StarRating";
import { cafeSummary } from "../data/reviewsData";

export default function ReviewSummary() {
  const { overallRating, totalReviews, ratingDistribution } = cafeSummary;
  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div className="review-summary-card">
      {/* Left: Big rating */}
      <div className="flex flex-col items-center justify-center gap-2 min-w-[140px]">
        <span className="text-6xl font-bold bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-transparent">
          {overallRating}
        </span>
        <StarRating rating={overallRating} size={22} />
        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          {totalReviews} reviews
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-zinc-200 dark:bg-zinc-700 self-stretch mx-6" />
      <div className="block sm:hidden h-px w-full bg-zinc-200 dark:bg-zinc-700 my-4" />

      {/* Right: Distribution bars */}
      <div className="flex flex-col gap-2.5 flex-1 w-full">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star] || 0;
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 group">
              <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 w-6 text-right">
                {star}★
              </span>
              <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="rating-bar h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      star >= 4
                        ? "linear-gradient(90deg, #facc15, #f97316)"
                        : star === 3
                        ? "linear-gradient(90deg, #fbbf24, #d97706)"
                        : "linear-gradient(90deg, #f87171, #ef4444)",
                  }}
                />
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 w-8 text-right font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
