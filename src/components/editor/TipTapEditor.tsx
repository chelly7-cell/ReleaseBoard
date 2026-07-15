"use client";

import { useEffect, useState } from "react";
import { JSONContent, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";


import { Maximize, Minimize } from "lucide-react";
import { editorExtensions } from "./extensions";
import EditorToolbar from "./EditorToolbar";
import BubbleToolbar from "./BubbleToolbar";
import FloatingToolbar from "./FloatingToolbar";

interface Props {
  initialContent?: JSONContent | null;
  onChange?: (value: JSONContent) => void;
  onSave?: (value: JSONContent) => void;
  saving?: boolean;
}

export default function TipTapEditor({
  initialContent,
  onChange,
  onSave,
  saving = false,
}: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: initialContent || {
      type: "doc",
      content: [],
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose dark:prose-invert max-w-none min-h-[550px] px-8 py-6 text-[15px] leading-7 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor || !initialContent) return;

    if (
      JSON.stringify(editor.getJSON()) !==
      JSON.stringify(initialContent)
    ) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;
  return (
  <div
    className={
      fullscreen
        ? "fixed inset-0 z-50 bg-background p-6"
        : "rounded-xl border bg-background overflow-hidden shadow-sm"
    }
  >
    <div className="flex items-center justify-between border-b px-4">
      <EditorToolbar
        editor={editor}
        saving={saving}
        onSave={() => onSave?.(editor.getJSON())}
      />

      <button
        onClick={() => setFullscreen(!fullscreen)}
        className="rounded-md p-2 hover:bg-muted"
      >
        {fullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </button>
    </div>

    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) =>
        !editor.state.selection.empty
      }
    >
      <BubbleToolbar editor={editor} />
    </BubbleMenu>

    <FloatingMenu
      editor={editor}
      shouldShow={({ editor }) =>
        editor.isEmpty
      }
    >
      <FloatingToolbar editor={editor} />
    </FloatingMenu>

    <div className="px-1">
      <EditorContent editor={editor} />
    </div>

    <footer className="flex justify-between border-t px-5 py-3 text-xs text-muted-foreground">
      <span>
        Characters:{" "}
        {editor.storage.characterCount?.characters() ?? 0}
      </span>

      <span>
        Words:{" "}
        {editor.storage.characterCount?.words() ?? 0}
      </span>

      <span>
        Reading:{" "}
        {Math.max(
          1,
          Math.ceil(
            (editor.storage.characterCount?.words() ?? 0) / 200
          )
        )}
        min
      </span>
    </footer>
  </div>
);
}