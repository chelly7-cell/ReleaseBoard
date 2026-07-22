"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { AnalyticsPoint } from "./types";

const WIDTH = 640;
const HEIGHT = 240;
const PAD_X = 8;
const PAD_Y = 20;

export default function AnalyticsChart({
  data,
  loading,
}: {
  data: AnalyticsPoint[];
  loading?: boolean;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // color tokens driven by theme (SVG attrs can't use `dark:` classes)
  const colors = {
    line: isDark ? "#2DD4BF" : "#0B6E64",
    peak: isDark ? "#F59E0B" : "#B45309",
    gridLine: isDark ? "#2A2E35" : "#E9EBE5",
    crosshair: isDark ? "#F3F4F1" : "#12151A",
  };

  const gradientId = useMemo(
    () => `rb-area-fill-${Math.random().toString(36).slice(2)}`,
    []
  );

  const { linePath, areaPath, points, peakIndex } = useMemo(() => {
    if (!data.length) {
      return {
        linePath: "",
        areaPath: "",
        points: [] as { x: number; y: number }[],
        peakIndex: -1,
      };
    }

    const max = Math.max(...data.map((d) => d.views), 1);

    const stepX =
      (WIDTH - PAD_X * 2) / Math.max(data.length - 1, 1);

    const points = data.map((d, i) => ({
      x: PAD_X + i * stepX,
      y:
        PAD_Y +
        (1 - d.views / max) *
          (HEIGHT - PAD_Y * 2),
    }));

    const line = points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${p.x},${p.y}`
      )
      .join(" ");

    const area = `${line}
      L${points[points.length - 1].x},${HEIGHT - PAD_Y}
      L${points[0].x},${HEIGHT - PAD_Y}
      Z`;

    let peakIndex = 0;

    data.forEach((item, index) => {
      if (item.views > data[peakIndex].views) {
        peakIndex = index;
      }
    });

    return {
      linePath: line,
      areaPath: area,
      points,
      peakIndex,
    };
  }, [data]);

  return (
    <div className="rounded-2xl border border-[#E3E5E0] bg-white p-6 dark:border-[#2A2E35] dark:bg-[#15181D]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#12151A] dark:text-[#F3F4F1]">
            Reader traffic
          </h3>

          <p className="mt-1 text-xs text-[#5B6472] dark:text-[#9CA3AF]">
            Views across all changelogs, last{" "}
            {data.length || 14} days
          </p>
        </div>

        {data.length > 0 && (
          <span className="font-mono text-xs text-[#5B6472] dark:text-[#9CA3AF]">
            peak{" "}
            <span className="text-[#B45309] dark:text-[#F59E0B]">
              {data[peakIndex]?.views ?? 0}
            </span>
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-[240px] w-full animate-pulse rounded-xl bg-[#F3F4F1] dark:bg-[#1D2127]" />
      ) : !data.length ? (
        <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed text-sm text-[#5B6472] dark:border-[#2A2E35] dark:text-[#9CA3AF]">
          No traffic data yet
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-[240px] w-full"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.line} stopOpacity="0.2" />
                <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((value) => (
              <line
                key={value}
                x1={PAD_X}
                x2={WIDTH - PAD_X}
                y1={PAD_Y + value * (HEIGHT - PAD_Y * 2)}
                y2={PAD_Y + value * (HEIGHT - PAD_Y * 2)}
                stroke={colors.gridLine}
                strokeWidth={1}
              />
            ))}

            <path d={areaPath} fill={`url(#${gradientId})`} />

            <path
              d={linePath}
              fill="none"
              stroke={colors.line}
              strokeWidth={8}
              opacity={0.08}
            />

            <path
              d={linePath}
              fill="none"
              stroke={colors.line}
              strokeWidth={2.5}
              strokeLinecap="round"
              className="transition-all duration-500"
            />

            {points[peakIndex] && (
              <circle
                cx={points[peakIndex].x}
                cy={points[peakIndex].y}
                r={4}
                fill={colors.peak}
              />
            )}

            {points.map((point, index) => (
              <rect
                key={index}
                x={point.x - WIDTH / points.length / 2}
                y={0}
                width={WIDTH / points.length}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
              />
            ))}

            {hoverIndex !== null && points[hoverIndex] && (
              <>
                <line
                  x1={points[hoverIndex].x}
                  x2={points[hoverIndex].x}
                  y1={PAD_Y}
                  y2={HEIGHT - PAD_Y}
                  stroke={colors.crosshair}
                  strokeOpacity={0.15}
                />
                <circle
                  cx={points[hoverIndex].x}
                  cy={points[hoverIndex].y}
                  r={4}
                  fill={colors.line}
                />
              </>
            )}
          </svg>

          {hoverIndex !== null && points[hoverIndex] && (
            <div
              className="pointer-events-none absolute rounded-lg border border-[#E3E5E0] bg-white px-3 py-2 text-xs shadow-lg dark:border-[#2A2E35] dark:bg-[#1D2127]"
              style={{
                left: `${(points[hoverIndex].x / WIDTH) * 100}%`,
                top: `${(points[hoverIndex].y / HEIGHT) * 100}%`,
                transform: "translate(-50%, -130%)",
              }}
            >
              <p className="font-medium text-[#12151A] dark:text-[#F3F4F1]">
                {data[hoverIndex].views} views
              </p>
              <p className="text-[#5B6472] dark:text-[#9CA3AF]">
                {new Date(data[hoverIndex].date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}