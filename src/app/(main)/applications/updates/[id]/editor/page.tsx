"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import TipTapEditor from "@/components/editor/TipTapEditor";
import EditorHeader from "@/components/editor/EditorHeader";
import EditorStatus from "@/components/editor/EditorStatus";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorStats from "@/components/editor/EditorStats";
import PublishDialog from "@/components/editor/PublishDialog";

interface Update {
  id: string;
  title: string;
  version: string;
  status: string;
  type?: string;
  publishDate?: string | null;
  content: any;
  applicationId: number;
}

export default function UpdateEditorPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [update, setUpdate] = useState<Update | null>(null);
  const [content, setContent] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editorText = useMemo(
    () => JSON.stringify(content ?? {}),
    [content]
  );

  useEffect(() => {
    if (!id) return;

    async function loadUpdate() {
      try {
        setLoading(true);

        const res = await fetch(`/api/updates/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load update");
        }

        setUpdate(data);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load update");
      } finally {
        setLoading(false);
      }
    }

    loadUpdate();
  }, [id]);

  const saveContent = useCallback(async () => {
    if (!dirty) return true;

    setSaving(true);

    try {
      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to save");
      }

      setDirty(false);
      setLastSaved(new Date());

      toast.success("Changes saved");

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Save failed");

      return false;
    } finally {
      setSaving(false);
    }
  }, [content, dirty, id]);

  const publishUpdate = useCallback(async () => {
    if (!update || publishing) return;

    setPublishing(true);

    try {
      if (dirty) {
        const saved = await saveContent();

        if (!saved) {
          throw new Error("Unable to publish because saving failed.");
        }
      }

      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          status: "published",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Publishing failed");
      }

      toast.success("Update published");

      router.push(`/changelog/${update.applicationId}`);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Publishing failed"
      );
    } finally {
      setPublishing(false);
    }
  }, [
    update,
    publishing,
    dirty,
    saveContent,
    id,
    content,
    router,
  ]);

  useEffect(() => {
    if (!dirty) return;

    const timer = setTimeout(() => {
      saveContent();
    }, 3000);

    return () => clearTimeout(timer);
  }, [dirty, saveContent]);

  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveContent();
      }
    };

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [saveContent]);

 if (loading || !update) {
  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-background
        via-background
        to-muted/20
        px-4
        py-8
        lg:px-10
      "
    >

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />
      </div>


      <div
      className="
        relative
        mx-auto
        max-w-screen-2xl
        space-y-8

        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-500
      "
    >

        {/* Floating Header Skeleton */}
        <div
          className="
            h-24
            animate-pulse
            rounded-3xl
            border
            bg-background/70
            backdrop-blur-xl
            shadow-xl
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              justify-between
              px-8
            "
          >

            <div className="space-y-3">
              <div
                className="
                  h-5
                  w-64
                  rounded-lg
                  bg-muted
                "
              />

              <div
                className="
                  h-3
                  w-40
                  rounded-lg
                  bg-muted
                "
              />
            </div>


            <div
              className="
                h-11
                w-36
                rounded-xl
                bg-muted
              "
            />

          </div>
        </div>



        {/* Main Workspace */}
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[1fr_380px]
          "
        >


          {/* Editor Skeleton */}
          <div
            className="
              animate-pulse
              overflow-hidden
              rounded-3xl
              border
              bg-background/80
              p-8
              shadow-xl
            "
          >

            <div className="space-y-5">

              <div
                className="
                  h-8
                  w-3/4
                  rounded-lg
                  bg-muted
                "
              />

              <div
                className="
                  h-4
                  w-full
                  rounded-lg
                  bg-muted
                "
              />

              <div
                className="
                  h-4
                  w-11/12
                  rounded-lg
                  bg-muted
                "
              />

              <div
                className="
                  h-4
                  w-10/12
                  rounded-lg
                  bg-muted
                "
              />


              <div
                className="
                  mt-10
                  h-[420px]
                  rounded-2xl
                  bg-muted
                "
              />

            </div>

          </div>




          {/* Sidebar Skeleton */}
          <aside
            className="
              space-y-5
              animate-pulse
            "
          >

            <div
              className="
                rounded-3xl
                border
                bg-background/80
                p-6
                shadow-xl
              "
            >

              <div
                className="
                  mb-6
                  h-5
                  w-32
                  rounded-lg
                  bg-muted
                "
              />


              <div className="space-y-4">

                <div
                  className="
                    h-16
                    rounded-2xl
                    bg-muted
                  "
                />

                <div
                  className="
                    h-16
                    rounded-2xl
                    bg-muted
                  "
                />

                <div
                  className="
                    h-16
                    rounded-2xl
                    bg-muted
                  "
                />

              </div>

            </div>


            {/* Stats */}
            <div
              className="
                rounded-3xl
                border
                bg-background/80
                p-6
                shadow-xl
              "
            >

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div
                  className="
                    h-20
                    rounded-2xl
                    bg-muted
                  "
                />

                <div
                  className="
                    h-20
                    rounded-2xl
                    bg-muted
                  "
                />

                <div
                  className="
                    h-20
                    rounded-2xl
                    bg-muted
                  "
                />

                <div
                  className="
                    h-20
                    rounded-2xl
                    bg-muted
                  "
                />

              </div>

            </div>


          </aside>


        </div>

      </div>

    </main>
  );
}



return (
  <main
    className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#11131]
      from-background
      via-background
      to-muted/20
      px-4
      py-8
      lg:px-10
    "
  >

    {/* Background Glow */}
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          -left-40
          -top-40
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#11131]
          blur-3xl
        "
      />


      <div
        className="
          absolute
          -bottom-40
          -right-40
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#11131]
          blur-3xl
        "
      />

    </div>



    <div
      className="
        relative
        mx-auto
        max-w-screen-2xl
        space-y-8

        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-500
      "
    >


      {/* TOP TOOLBAR */}
      <header
        className="
          sticky
          top-5
          z-40

          rounded-3xl

          border
          border-border/50

          bg-background/70

          backdrop-blur-2xl

          shadow-xl
          shadow-black/5

          px-6
          py-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <EditorHeader
            update={update}
            saving={saving}
            onSave={saveContent}
          />


          <PublishDialog
            title={update.title}
            onPublish={publishUpdate}
            disabled={publishing}
          />


        </div>

      </header>




      {/* SAVE STATUS */}
      <section
        className="
          rounded-2xl

          border
          border-border/50

          bg-background/60

          backdrop-blur-xl

          px-5
          py-4

          shadow-sm
        "
      >

        <EditorStatus
          saving={saving}
          dirty={dirty}
          lastSaved={lastSaved}
        />

      </section>





      {/* MAIN WORKSPACE */}
      <div
        className="
          grid

          gap-8

          lg:grid-cols-[1fr_380px]

          items-start
        "
      >


        {/* LEFT AREA */}
        <section
          className="
            space-y-8
          "
        >


          {/* EDITOR */}
          <div
              className="
                overflow-hidden

                rounded-3xl

                border
                border-border/50

                bg-background/80

                backdrop-blur-xl

                shadow-xl

                transition-all
                duration-300

                hover:shadow-2xl
              "
          >

            <TipTapEditor
              initialContent={content}
              saving={saving}

              onChange={(value) => {
                setContent(value);
                setDirty(true);
              }}

              onSave={saveContent}
            />

          </div>





          {/* STATS */}
          <div
            className="
              rounded-3xl

              border
              border-border/50

              bg-background/80

              backdrop-blur-xl

              p-6

              shadow-xl
              shadow-black/5
            "
          >

            <EditorStats
              content={editorText}
            />

          </div>


        </section>






        {/* RIGHT SIDEBAR */}
        <aside
          className="
            space-y-6

            lg:sticky
            lg:top-32

            lg:max-h-[calc(100vh-160px)]

            lg:overflow-y-auto

            scrollbar-thin
          "
        >

          <div
            className="
              rounded-3xl

              border
              border-border/50

              bg-background/70

              backdrop-blur-xl

              p-6

              shadow-xl
              shadow-black/5

              transition-all
              duration-300

              hover:shadow-2xl
            "
          >

            <EditorSidebar
              update={update}
            />

          </div>


        </aside>



      </div>


    </div>


  </main>
)};