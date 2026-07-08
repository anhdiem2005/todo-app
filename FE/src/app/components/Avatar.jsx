import React from "react";

export default function Avatar({ name, size = "md" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-full bg-white/20 text-white font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
}
