"use client";

import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function UpdateRenderer({
  content,
}: {
  content: any;
}) {
  if (!content) {
    return (
      <p className="text-muted-foreground">
        No content yet.
      </p>
    );
  }

  const html = generateHTML(content, [
    StarterKit,
  ]);

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}