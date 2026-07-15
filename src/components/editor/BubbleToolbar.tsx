"use client";

import { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  Underline,
  Code,
} from "lucide-react";

import { Button } from "@/components/ui/button";


type Props = {
  editor: Editor;
};


export default function BubbleToolbar({
  editor,
}: Props) {


  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-lg">

      <Button
        size="icon"
        variant={
          editor.isActive("bold")
            ? "default"
            : "ghost"
        }
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        <Bold className="h-4 w-4"/>
      </Button>


      <Button
        size="icon"
        variant={
          editor.isActive("italic")
            ? "default"
            : "ghost"
        }
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        <Italic className="h-4 w-4"/>
      </Button>


      <Button
        size="icon"
        variant={
          editor.isActive("underline")
            ? "default"
            : "ghost"
        }
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
      >
        <Underline className="h-4 w-4"/>
      </Button>


      <Button
        size="icon"
        variant={
          editor.isActive("code")
            ? "default"
            : "ghost"
        }
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
      >
        <Code className="h-4 w-4"/>
      </Button>

    </div>
  );
}