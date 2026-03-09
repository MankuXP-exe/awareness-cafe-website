"use client";

export default function StarRating({ rating, size = 20, showNumber = false }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars <= 0.7;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={`full-${i}`} width={size} height={size} viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  if (hasHalf) {
    stars.push(
      <svg key="half" width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <linearGradient id={`half-grad-${size}`}>
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={`url(#half-grad-${size})`}
          stroke="#facc15"
          strokeWidth="1"
        />
      </svg>
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      {showNumber && (
        <span className="ml-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
