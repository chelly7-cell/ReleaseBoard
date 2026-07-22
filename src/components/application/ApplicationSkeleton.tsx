"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border">
        <div className="p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-6">
              <Skeleton className="h-24 w-24 rounded-3xl" />

              <div className="space-y-4">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-5 w-[420px]" />
                <Skeleton className="h-5 w-[360px]" />

                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-11 w-40 rounded-xl" />
              <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Updates */}
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border"
          >
            <div className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />

                  <div className="space-y-3">
                    <Skeleton className="h-6 w-72" />

                    <div className="flex gap-3">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}