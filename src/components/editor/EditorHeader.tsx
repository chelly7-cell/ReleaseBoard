"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Cloud,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Update {
  id: string;
  title: string;
  version: string;
  status: string;
}

interface EditorHeaderProps {
  update: Update;
  saving: boolean;
  onSave: () => void;
}

export default function EditorHeader({
  update,
  saving,
  onSave,
}: EditorHeaderProps) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-1
        flex-col
        gap-4
      "
    >

      {/* Breadcrumb */}
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
        "
      >

        <Link
          href="/applications/updates"
          className="
            flex
            items-center
            gap-1

            transition-colors

            hover:text-foreground
          "
        >

          <ArrowLeft
            className="
              h-4
              w-4
            "
          />

          Updates

        </Link>


        <span>/</span>


        <span
          className="
            truncate
          "
        >
          Editor
        </span>

      </div>





      {/* Title Area */}
      <div
        className="
          flex
          flex-col
          gap-3

          sm:flex-row
          sm:items-center
        "
      >


        <div
          className="
            min-w-0
          "
        >

          <h1
            className="
              truncate

              text-xl

              font-semibold

              tracking-tight

              lg:text-2xl
            "
          >
            {update.title}
          </h1>


          <div
            className="
              mt-2

              flex

              flex-wrap

              items-center

              gap-2
            "
          >

            <Badge
              variant="secondary"
              className="
                rounded-lg

                font-medium
              "
            >
              v{update.version}
            </Badge>



            <Badge
              className="
                rounded-lg

                gap-1

                capitalize
              "
            >

              {update.status === "published" ? (
                <Check
                  className="
                    h-3.5
                    w-3.5
                  "
                />
              ) : (
                <Cloud
                  className="
                    h-3.5
                    w-3.5
                  "
                />
              )}

              {update.status}

            </Badge>


          </div>

        </div>


      </div>





      {/* Save Button Mobile */}
      <div
        className="
          flex
          lg:hidden
        "
      >

        <Button
          onClick={onSave}
          disabled={saving}

          className="
            h-10

            w-full

            rounded-xl

            gap-2
          "
        >

          <Save
            className="
              h-4
              w-4
            "
          />

          {saving ? "Saving..." : "Save"}

        </Button>

      </div>



    </div>
  );
}