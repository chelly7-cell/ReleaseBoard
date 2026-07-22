"use client";

import { useEffect } from "react";

import ReadOnlyEditor from "@/components/editor/ReadOnlyEditor";


type Update = {
  id:number;
  title:string;
  version:string;
  content:any;
  publishDate:string|null;
};


export default function ReleaseCard({
  update,
}:{
  update:Update;
}) {


  useEffect(()=>{

    async function trackView(){

      try{

        await fetch(
          `/api/updates/${update.id}/view`,
          {
            method:"POST",
          }
        );


      }catch(error){

        console.error(
          "Failed to track update view",
          error
        );

      }

    }


    trackView();


  },[update.id]);



  return (

    <article
      id={`release-${update.id}`}
      className="
      rounded-2xl
      border
      bg-card
      p-6
      shadow-sm
      scroll-mt-24
      "
    >

      <div>

        <div className="
          flex
          items-center
          justify-between
          gap-3
        ">

          <h2 className="text-2xl font-bold">
            {update.title}
          </h2>


          <span className="
            rounded-full
            border
            px-3
            py-1
            text-sm
          ">
            v{update.version}
          </span>


        </div>



        {update.publishDate && (

          <p className="
            mt-2
            text-sm
            text-muted-foreground
          ">

            {
              new Date(
                update.publishDate
              ).toLocaleDateString()
            }

          </p>

        )}


      </div>



      <div className="mt-8">

        <ReadOnlyEditor
          content={update.content}
        />

      </div>


    </article>

  );

}