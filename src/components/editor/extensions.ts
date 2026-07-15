import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { createLowlight } from "lowlight";

import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";

import {
  SlashCommand,
} from "./slash/SlashCommand";



const lowlight = createLowlight();



lowlight.register(
  "javascript",
  javascript
);

lowlight.register(
  "typescript",
  typescript
);

lowlight.register(
  "css",
  css
);

lowlight.register(
  "html",
  html
);

lowlight.register(
  "json",
  json
);



export const editorExtensions = [

  StarterKit.configure({

    codeBlock:false,

  }),


  Underline,


  HorizontalRule,


  CharacterCount,



  Placeholder.configure({

    placeholder:
      "Write your release notes..."

  }),




  Image.configure({

    inline:false,

    allowBase64:true,

  }),





  Link.configure({

    openOnClick:false,

    HTMLAttributes:{

      class:
        "text-primary underline"

    },

  }),






  CodeBlockLowlight.configure({

    lowlight,

  }),





  // Notion style slash commands

  SlashCommand,

];