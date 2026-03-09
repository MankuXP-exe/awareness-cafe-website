"use client";

import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = review.text.length > 150;
  const displayText = shouldTruncate && !expanded ? review.text.slice(0, 150) + "…" : review.text;

  const formattedDate = new Date(review.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="review-card group" id={`review-${review.id}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.profileImage}
          alt={review.name}
          className="w-11 h-11 rounded-full ring-2 ring-amber-400/30 shadow-md"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
            {review.name}
          </h4>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">{formattedDate}</span>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-3">
        <StarRating rating={review.rating} size={16} />
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        &ldquo;{displayText}&rdquo;
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-amber-500 hover:text-amber-400 font-medium text-xs cursor-pointer transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Google icon */}
      <div className="mt-3 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-40">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Google Review</span>
      </div>
    </div>
  );
}
