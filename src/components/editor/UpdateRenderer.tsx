"use client";

import { useEffect, useState } from "react";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function UpdateRenderer({
  content,
}: {
  content: any;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) return;

    const generatedHTML = generateHTML(content, [
      StarterKit,
    ]);

    setHtml(generatedHTML);
  }, [content]);

  if (!content) {
    return (
      <p className="text-muted-foreground">
        No content yet.
      </p>
    );
  }

  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}