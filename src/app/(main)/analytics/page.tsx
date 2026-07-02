import { BarChart3 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

async function getAnalytics() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

export default async function AnalysePage() {
  const analytics = await getAnalytics();

  if (!analytics || analytics.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Empty className="rounded-xl border py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 className="h-8 w-8" />
            </EmptyMedia>

            <EmptyTitle>No analytics available</EmptyTitle>

            <EmptyDescription>
              Analytics will appear here once users start using your
              application. Invite users or create some activity to begin
              collecting data.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button asChild>
              <Link href="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <pre className="rounded-lg border p-6 bg-muted overflow-auto">
        {JSON.stringify(analytics, null, 2)}
      </pre>
    </div>
  );
}