"use client";

import { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
  Minus,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


type Props = {
  editor: Editor;
  onSave: () => void;
  saving?: boolean;
};



export default function EditorToolbar({
  editor,
  onSave,
  saving = false,
}: Props) {


  if (!editor) return null;



  const addImage = () => {

    const url =
      window.prompt(
        "Enter image URL"
      );


    if(url){

      editor
        .chain()
        .focus()
        .setImage({
          src:url
        })
        .run();

    }

  };





  const addLink = () => {

    const url =
      window.prompt(
        "Enter URL"
      );


    if(!url)
      return;


    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href:url,
      })
      .run();

  };





  return (

    <div
      className="
      sticky
      top-0
      z-20
      flex
      flex-wrap
      items-center
      gap-2
      border-b
      bg-background
      p-3
      "
    >


      {/* History */}

      <Button
        size="icon"
        variant="ghost"
        disabled={!editor.can().undo()}
        onClick={() =>
          editor
          .chain()
          .focus()
          .undo()
          .run()
        }
      >
        <Undo2 className="h-4 w-4"/>
      </Button>



      <Button
        size="icon"
        variant="ghost"
        disabled={!editor.can().redo()}
        onClick={() =>
          editor
          .chain()
          .focus()
          .redo()
          .run()
        }
      >
        <Redo2 className="h-4 w-4"/>
      </Button>




      <Separator
        orientation="vertical"
        className="h-6"
      />



      {/* Headings */}


      <Button
        size="icon"
        variant={
          editor.isActive(
            "heading",
            {level:1}
          )
          ?
          "default"
          :
          "ghost"
        }
        onClick={() =>
          editor
          .chain()
          .focus()
          .toggleHeading({
            level:1
          })
          .run()
        }
      >

        <Heading1 className="h-4 w-4"/>

      </Button>




      <Button
        size="icon"
        variant={
          editor.isActive(
            "heading",
            {level:2}
          )
          ?
          "default"
          :
          "ghost"
        }
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




      <Separator
        orientation="vertical"
        className="h-6"
      />



      {/* Formatting */}



      <Button
        size="icon"
        variant={
          editor.isActive("bold")
          ?
          "default"
          :
          "ghost"
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
          ?
          "default"
          :
          "ghost"
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
        variant="ghost"
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
        variant="ghost"
        onClick={() =>
          editor
          .chain()
          .focus()
          .toggleStrike()
          .run()
        }
      >
        <Strikethrough className="h-4 w-4"/>
      </Button>





      <Separator
        orientation="vertical"
        className="h-6"
      />




      {/* Blocks */}



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





      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
          .chain()
          .focus()
          .toggleCodeBlock()
          .run()
        }
      >
        <Code2 className="h-4 w-4"/>
      </Button>





      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          editor
          .chain()
          .focus()
          .setHorizontalRule()
          .run()
        }
      >
        <Minus className="h-4 w-4"/>
      </Button>





      {/* Media */}



      <Button
        size="icon"
        variant="ghost"
        onClick={addImage}
      >
        <ImageIcon className="h-4 w-4"/>
      </Button>




      <Button
        size="icon"
        variant="ghost"
        onClick={addLink}
      >
        <LinkIcon className="h-4 w-4"/>
      </Button>





      <div className="ml-auto">


        <Button
          onClick={onSave}
          disabled={saving}
        >

          <Save className="mr-2 h-4 w-4"/>

          {
            saving
            ?
            "Saving..."
            :
            "Save"
          }


        </Button>


      </div>



    </div>

  );

}