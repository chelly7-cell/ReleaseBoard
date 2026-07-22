"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ updateId }: { updateId: number }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch(`/api/updates/${updateId}/view`, { method: "POST" }).catch(() => {
      // best-effort — a failed view ping shouldn't affect the reader
    });
  }, [updateId]);

  return null;
}