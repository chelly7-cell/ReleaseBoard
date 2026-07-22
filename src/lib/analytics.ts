export type AnalyticsRange =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "all";

export function getAnalyticsRange(
  value: string | null
): AnalyticsRange {
  switch (value) {
    case "today":
    case "7d":
    case "30d":
    case "90d":
    case "all":
      return value;

    default:
      return "30d";
  }
}

export function getStartDate(
  range: AnalyticsRange
): Date | null {
  if (range === "all") return null;

  const now = new Date();

  if (range === "today") {
    now.setHours(0, 0, 0, 0);
    return now;
  }

  const days = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  }[range];

  const start = new Date();

  start.setDate(start.getDate() - days);

  return start;
}