"use client";

import { EditorContent, useEditor } from "@tiptap/react";

import { editorExtensions } from "./extensions";

interface ReadOnlyEditorProps {
  content: any;
}

export default function ReadOnlyEditor({
  content,
}: ReadOnlyEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="prose prose-neutral max-w-none dark:prose-invert"
    />
  );
}