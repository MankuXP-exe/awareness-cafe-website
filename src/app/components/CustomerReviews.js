"use client";

import { useState, useMemo } from "react";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ReviewTags from "./ReviewTags";
import { reviews, GOOGLE_MAPS_LINK } from "../data/reviewsData";

const INITIAL_DISPLAY = 6;

export default function CustomerReviews() {
  const [showAll, setShowAll] = useState(false);

  // Filter 3-5★, sort by rating desc then date desc
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => r.rating >= 3)
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.date) - new Date(a.date);
      });
  }, []);

  const displayedReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, INITIAL_DISPLAY);

  const remaining = filteredReviews.length - INITIAL_DISPLAY;

  return (
    <section id="customer-reviews" className="reviews-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-500 mb-4">
            What Our Guests Say
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-3">
            Customer Reviews
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-base">
            Real experiences from our community on Google
          </p>
        </div>

        {/* Summary Card */}
        <div className="mb-10">
          <ReviewSummary />
        </div>

        {/* Tags */}
        <div className="mb-12">
          <ReviewTags />
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Load More */}
        {!showAll && remaining > 0 && (
          <div className="text-center mb-10">
            <button
              onClick={() => setShowAll(true)}
              className="load-more-btn"
            >
              Load More Reviews ({remaining})
            </button>
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="text-center">
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="write-review-btn"
            id="write-google-review"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
              <path
                fill="#fff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#fff"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fff"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#fff"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Write a Google Review
          </a>
        </div>
      </div>
    </section>
  );
}
