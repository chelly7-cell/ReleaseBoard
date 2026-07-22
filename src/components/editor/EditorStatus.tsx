"use client";

import {
  Check,
  Command,
  Loader2,
  CircleAlert,
} from "lucide-react";

interface EditorStatusProps {
  saving: boolean;
  dirty: boolean;
  lastSaved: Date | null;
}

export default function EditorStatus({
  saving,
  dirty,
  lastSaved,
}: EditorStatusProps) {

  const formattedTime = lastSaved
    ? lastSaved.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;


  return (
    <div
      className="
        flex

        flex-col

        gap-3

        sm:flex-row

        sm:items-center

        sm:justify-between
      "
    >


      {/* LEFT STATUS */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        {saving ? (

          <>

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-full

                bg-primary/10
              "
            >

              <Loader2
                className="
                  h-4
                  w-4

                  animate-spin

                  text-primary
                "
              />

            </span>


            <div>

              <p
                className="
                  text-sm

                  font-medium
                "
              >
                Saving changes
              </p>


              <p
                className="
                  text-xs

                  text-muted-foreground
                "
              >
                Please wait...
              </p>

            </div>

          </>


        ) : dirty ? (

          <>

            <span
              className="
                flex

                h-8

                w-8

                items-center

                justify-center

                rounded-full

                bg-yellow-500/10
              "
            >

              <CircleAlert
                className="
                  h-4

                  w-4

                  text-yellow-500
                "
              />

            </span>


            <div>

              <p
                className="
                  text-sm

                  font-medium
                "
              >
                Unsaved changes
              </p>


              <p
                className="
                  text-xs

                  text-muted-foreground
                "
              >
                Auto saving soon
              </p>


            </div>


          </>


        ) : (

          <>

            <span
              className="
                flex

                h-8

                w-8

                items-center

                justify-center

                rounded-full

                bg-green-500/10
              "
            >

              <Check
                className="
                  h-4

                  w-4

                  text-green-500
                "
              />

            </span>



            <div>

              <p
                className="
                  text-sm

                  font-medium
                "
              >
                Saved
              </p>


              <p
                className="
                  text-xs

                  text-muted-foreground
                "
              >

                {formattedTime
                  ? `Last saved at ${formattedTime}`
                  : "All changes synced"
                }

              </p>


            </div>


          </>

        )}

      </div>





      {/* RIGHT SHORTCUT */}
      <div
        className="
          hidden

          items-center

          gap-2

          text-xs

          text-muted-foreground

          sm:flex
        "
      >

        <span>
          Save manually
        </span>


        <kbd
          className="
            flex

            items-center

            gap-1

            rounded-lg

            border

            bg-muted

            px-2

            py-1

            font-mono

            text-[11px]
          "
        >

          <Command
            className="
              h-3

              w-3
            "
          />

          S

        </kbd>


      </div>


    </div>
  );
}