"use client";

import {
  AlignLeft,
  BookOpen,
  Clock3,
  FileText,
} from "lucide-react";

import type { ReactNode } from "react";


interface EditorStatsProps {
  content: string;
}


export default function EditorStats({
  content,
}: EditorStatsProps) {

  const stats = calculateStats(content);


  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >

      <StatCard
        icon={<FileText />}
        label="Words"
        value={stats.words}
      />


      <StatCard
        icon={<AlignLeft />}
        label="Characters"
        value={stats.characters}
      />


      <StatCard
        icon={<Clock3 />}
        label="Reading time"
        value={
          stats.words === 0
            ? "0 min"
            : `${stats.readingTime} min`
        }
      />


      <StatCard
        icon={<BookOpen />}
        label="Paragraphs"
        value={stats.paragraphs}
      />

    </div>
  );
}





function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {


  return (
    <div
      className="
        group
        rounded-2xl
        border
        bg-background/70
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          {icon}
        </div>


      </div>


      <div
        className="
          mt-5
        "
      >

        <p
          className="
            text-2xl
            font-semibold
            tracking-tight
          "
        >
          {value}
        </p>


        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          {label}
        </p>


      </div>


    </div>
  );
}





function calculateStats(content: string) {


  if (!content) {
    return {
      words: 0,
      characters: 0,
      paragraphs: 0,
      readingTime: 0,
    };
  }



  let text = content;



  try {

    const parsed = JSON.parse(content);


    text = extractTextFromTipTap(parsed);


  } catch {

    text = content
      .replace(/<[^>]*>/g, " ");

  }



  const cleanText = text
    .replace(/\s+/g, " ")
    .trim();



  const words =
    cleanText.length === 0
      ? 0
      : cleanText.split(" ").length;



  const characters =
    cleanText.length;



  const paragraphs =
    countParagraphs(content);



  const readingTime =
    Math.ceil(words / 200);



  return {
    words,
    characters,
    paragraphs,
    readingTime,
  };

}





function extractTextFromTipTap(
  node: any
): string {


  let text = "";


  if (node.type === "text") {
    text += node.text ?? "";
  }



  if (node.content) {

    for (const child of node.content) {

      text += " " + extractTextFromTipTap(child);

    }

  }



  return text;

}





function countParagraphs(
  content: string
) {


  try {

    const json = JSON.parse(content);


    if (!json.content) {
      return 0;
    }


    return json.content.filter(
      (item: any) =>
        item.type === "paragraph"
    ).length;


  } catch {


    const paragraphs =
      content
        .replace(/<[^>]*>/g, "")
        .split(/\n+/)
        .filter(Boolean);


    return paragraphs.length;

  }

}