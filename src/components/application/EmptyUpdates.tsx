"use client";

import Link from "next/link";
import { FilePlus2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  applicationId: number;
};

export default function EmptyUpdates({ applicationId }: Props) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border border-dashed">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-sky-500/5" />

      <div className="relative flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl">
          <FilePlus2 className="h-12 w-12" />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          <h2 className="text-2xl font-bold tracking-tight">
            No updates yet
          </h2>
        </div>

        <p className="mb-8 max-w-lg text-muted-foreground leading-7">
          Your application doesn't have any release notes yet.
          Start publishing updates to keep your users informed
          about new features, improvements, and bug fixes.
        </p>

        <Button
          asChild
          size="lg"
          className="rounded-xl px-8 shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <Link href={`/applications/updates/new?applicationId=${applicationId}`}>
            <FilePlus2 className="mr-2 h-5 w-5" />
            Create Your First Update
          </Link>
        </Button>
      </div>
    </Card>
  );
}