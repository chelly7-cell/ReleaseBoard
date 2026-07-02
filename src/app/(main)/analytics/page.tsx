import { BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AnalysePage() {
  // Replace this with your real analytics data
  const analytics: any[] = [];

  if (analytics.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Empty className="border rounded-xl py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 className="size-8" />
            </EmptyMedia>

            <EmptyTitle>No analytics yet</EmptyTitle>

            <EmptyDescription>
              There isn't enough data to generate analytics.
              Once users start interacting with your application,
              charts and statistics will appear here.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button>Refresh</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Your analytics charts */}
    </div>
  );
}