"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}:{
  value:string;
  onChange:(value:string)=>void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>

      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder="Search releases..."
        className="
          h-10
          w-full
          rounded-xl
          border
          bg-background
          pl-10
          pr-4
          text-sm
          outline-none
          focus:ring-2
          focus:ring-primary
        "
      />
    </div>
  );
}