"use client";

import { Editor } from "@tiptap/react";

import {
  Heading2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";


import { Button } from "@/components/ui/button";


type Props = {
  editor: Editor;
};



export default function FloatingToolbar({
  editor,
}: Props) {


  return (

    <div className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-md">


      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level:2
            })
            .run()
        }
      >
        <Heading2 className="h-4 w-4"/>
      </Button>



      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        <List className="h-4 w-4"/>
      </Button>



      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        <ListOrdered className="h-4 w-4"/>
      </Button>



      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
      >
        <Quote className="h-4 w-4"/>
      </Button>


    </div>

  );
}