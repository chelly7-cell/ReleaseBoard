"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "@/components/editor/extensions";

export default function ReadOnlyEditor({
  content,
}: {
  content: any;
}) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: editorExtensions,
    content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}