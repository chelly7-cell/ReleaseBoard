"use client";

import {
  FileText,
  Clock,
  Type,
  AlignLeft,
  Database,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EditorStatsProps {
  content: string;
}

export default function EditorStats({
  content,
}: EditorStatsProps) {
  const text = content
    .replace(/["{}[\],:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const characters = text.length;

  const words = text
    ? text.split(" ").length
    : 0;

  const readingTime = Math.max(
    1,
    Math.ceil(words / 200)
  );

  const paragraphs = (content.match(/paragraph/g) || []).length;

  const size = new Blob([content]).size;

  const sizeLabel = size > 1024
    ? `${(size / 1024).toFixed(1)} KB`
    : `${size} B`;

  const stats = [
    {
      title: "Characters",
      value: characters.toLocaleString(),
      icon: Type,
    },
    {
      title: "Words",
      value: words.toLocaleString(),
      icon: FileText,
    },
    {
      title: "Reading time",
      value: `${readingTime} min`,
      icon: Clock,
    },
    {
      title: "Paragraphs",
      value: paragraphs.toString(),
      icon: AlignLeft,
    },
    {
      title: "Document size",
      value: sizeLabel,
      icon: Database,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Editor statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl border bg-muted/30 p-4 transition hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">
                    {stat.title}
                  </span>
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}