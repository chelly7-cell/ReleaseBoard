import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

import {
  ReactRenderer,
} from "@tiptap/react";

import tippy from "tippy.js";

import SlashMenu from "./SlashMenu";

import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Image,
} from "lucide-react";



const slashItems = [

  {
    title: "Heading 1",
    description: "Large section title",
    icon: Heading1,
    command: "heading1",
  },


  {
    title: "Heading 2",
    description: "Medium section title",
    icon: Heading2,
    command: "heading2",
  },


  {
    title: "Bullet List",
    description: "Create a bullet list",
    icon: List,
    command: "bullet",
  },


  {
    title: "Numbered List",
    description: "Create numbered steps",
    icon: ListOrdered,
    command: "ordered",
  },


  {
    title: "Quote",
    description: "Highlight important text",
    icon: Quote,
    command: "quote",
  },


  {
    title: "Code Block",
    description: "Insert code example",
    icon: Code2,
    command: "code",
  },


  {
    title: "Divider",
    description: "Separate sections",
    icon: Minus,
    command: "divider",
  },


  {
    title: "Image",
    description: "Insert image",
    icon: Image,
    command: "image",
  },


];





export const SlashCommand = Extension.create({

  name: "slash-command",



  addOptions() {


    return {


      suggestion: {


        char: "/",



        items: ({ query }: any) => {


          return slashItems.filter((item) =>

            item.title
              .toLowerCase()
              .includes(
                query.toLowerCase()
              )

          );


        },





        command: ({
          editor,
          range,
          props,
        }: any) => {


          editor
            .chain()
            .focus()
            .deleteRange(range)
            .run();




          switch(props.command) {


            case "heading1":

              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 1,
                })
                .run();

              break;




            case "heading2":

              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 2,
                })
                .run();

              break;




            case "bullet":

              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run();

              break;




            case "ordered":

              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run();

              break;




            case "quote":

              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run();

              break;




            case "code":

              editor
                .chain()
                .focus()
                .toggleCodeBlock()
                .run();

              break;




            case "divider":

              editor
                .chain()
                .focus()
                .setHorizontalRule()
                .run();

              break;




            case "image":

              const url =
                window.prompt(
                  "Image URL"
                );


              if(url){

                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: url,
                  })
                  .run();

              }

              break;


          }


        },



        render() {
          let component: any;
          let popup: any
          return {
            onStart(props: any) {
              component =
                new ReactRenderer(
                  SlashMenu,
                  {
                    props,
                    editor:
                    props.editor,
                  }
                );
              if(!props.clientRect)
                return;
              popup =
                tippy(
                  document.body,
                  {
                    getReferenceClientRect:
                      props.clientRect,
                    appendTo: () =>
                      document.body,
                    content:
                      component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement:
                      "bottom-start",
                  }
                );
            },
            onUpdate(props: any) {
              component?.updateProps(
                props
              );
              popup?.setProps({
                getReferenceClientRect:
                  props.clientRect,
              });
            },
            onKeyDown(props: any) {
              if(
                props.event.key === "Escape"
              ){
                popup?.hide();
                return true;
              }
              return false;
            },
            onExit() {
              popup?.destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});