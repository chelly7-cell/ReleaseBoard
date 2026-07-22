"use client";

import {
  CalendarDays,
  FileText,
  Layers,
  Rocket,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface Update {
  id: string;
  title: string;
  version: string;
  status: string;
  type?: string;
  publishDate?: string | null;
  applicationId: number;
}

interface EditorSidebarProps {
  update: Update;
}


export default function EditorSidebar({
  update,
}: EditorSidebarProps) {


  const publishDate = update.publishDate
    ? new Date(update.publishDate).toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Not published";



  return (
    <div
      className="
        space-y-6
      "
    >


      {/* Release Overview */}
      <div
        className="
          space-y-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
          "
        >

          <Rocket
            className="
              h-4
              w-4
              text-primary
            "
          />

          Release

        </div>


        <div
          className="
            rounded-2xl

            border

            bg-muted/30

            p-4

            space-y-4
          "
        >

          <InfoRow
            icon={<Tag />}
            label="Version"
            value={`v${update.version}`}
          />


          <InfoRow
            icon={<Layers />}
            label="Status"
            value={
              <Badge
                className="
                  rounded-lg

                  capitalize
                "
              >
                {update.status}
              </Badge>
            }
          />



          <InfoRow
            icon={<FileText />}
            label="Type"
            value={
              update.type || "Update"
            }
          />

        </div>


      </div>






      {/* Publish Information */}
      <div
        className="
          space-y-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
          "
        >

          <CalendarDays
            className="
              h-4
              w-4
              text-primary
            "
          />

          Timeline

        </div>



        <div
          className="
            rounded-2xl

            border

            bg-muted/30

            p-4
          "
        >

          <p
            className="
              text-xs

              text-muted-foreground
            "
          >
            Published date
          </p>


          <p
            className="
              mt-1

              text-sm

              font-medium
            "
          >
            {publishDate}
          </p>


        </div>


      </div>






      {/* Application */}
      <div
        className="
          rounded-2xl

          border

          bg-primary/5

          p-4
        "
      >

        <p
          className="
            text-xs

            text-muted-foreground
          "
        >
          Application ID
        </p>


        <p
          className="
            mt-1

            font-mono

            text-sm

            font-medium
          "
        >
          #{update.applicationId}
        </p>


      </div>


    </div>
  );
}





function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {

  return (
    <div
      className="
        flex

        items-center

        justify-between

        gap-3
      "
    >

      <div
        className="
          flex

          items-center

          gap-2

          text-sm

          text-muted-foreground
        "
      >

        <span
          className="
            [&>svg]:
            h-4

            [&>svg]:
            w-4
          "
        >
          {icon}
        </span>


        {label}

      </div>



      <div
        className="
          text-sm

          font-medium
        "
      >

        {value}

      </div>


    </div>
  );
}