"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  initialContent?: any;
  onChange?: (value: any) => void;
  onSave?: (value: any) => void;
};

export default function TipTapEditor({
  initialContent,
  onChange,
  onSave,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your release notes...",
      }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    },
  });

  useEffect(() => {
    if (!editor || !initialContent) return;
    editor.commands.setContent(initialContent);
  }, [editor, initialContent]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-background">
      
      {/* Toolbar simple */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>

        <Button
          size="sm"
          variant="default"
          onClick={() => onSave?.(editor.getJSON())}
        >
          Save
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[400px] p-2" />
    </div>
  );
}