"use client";

import { useState } from "react";

export default function StarRating({
  rating = 0,
  setRating = () => {},
  editable = true,
  size = 45,
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => editable && setRating(star)}
          onMouseEnter={() => editable && setHover(star)}
          onMouseLeave={() => editable && setHover(0)}
          className={`transition-all duration-200 ${
            editable ? "hover:scale-125 cursor-pointer" : "cursor-default"
          }`}
          style={{
            fontSize: `${size}px`,
            background: "transparent",
            border: "none",
            padding: 0,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: star <= (hover || rating) ? "#FFD700" : "#6B7280",
            }}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}