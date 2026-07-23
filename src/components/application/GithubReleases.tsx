"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


type GithubRelease = {
  id:number;
  tag_name:string;
  name:string;
  body:string | null;
  html_url:string;
};


export default function GithubReleases({
  applicationId,
}:{
  applicationId:number;
}) {


  const [releases,setReleases] =
    useState<GithubRelease[]>([]);


  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{

    async function load(){

      try{

        const res =
          await fetch(
            `/api/github/releases/${applicationId}`
          );


        if(!res.ok){
          return;
        }


        const data =
          await res.json();


        setReleases(data);


      }catch(error){

        console.error(error);

      }
      finally{

        setLoading(false);

      }

    }


    load();

  },[applicationId]);



  if(loading){
    return null;
  }



  if(releases.length===0){
    return null;
  }



  return (

    <section className="space-y-5">


      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">

          <FaGithub className="h-5 w-5"/>

        </div>


        <div>

          <h2 className="text-3xl font-bold">
            GitHub Releases
          </h2>

          <p className="text-muted-foreground">
            Releases fetched from GitHub.
          </p>

        </div>


      </div>



      <div className="space-y-4">


        {releases.map((release)=>(

          <Card
            key={release.id}
            className="rounded-3xl"
          >

            <CardHeader>

              <div className="flex items-center justify-between">

                <CardTitle>
                  {release.name}
                </CardTitle>


                <Badge>
                  {release.tag_name}
                </Badge>

              </div>


            </CardHeader>



            <CardContent>


              <p className="text-muted-foreground line-clamp-3">

                {release.body ||
                 "No description"}

              </p>


              <Button
                asChild
                variant="outline"
                className="mt-4 rounded-xl"
              >

                <a
                  href={release.html_url}
                  target="_blank"
                >

                  <Download className="mr-2 h-4 w-4"/>

                  View on GitHub

                </a>


              </Button>


            </CardContent>


          </Card>


        ))}


      </div>


    </section>

  );

}