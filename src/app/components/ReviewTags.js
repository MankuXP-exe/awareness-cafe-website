"use client";

import { reviewTags } from "../data/reviewsData";

export default function ReviewTags() {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {reviewTags.map((tag) => (
        <span key={tag} className="review-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
