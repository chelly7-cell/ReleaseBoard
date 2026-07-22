"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import Hero from "@/app/changelog/[applicationId]/components/Hero";
import Sidebar from "@/app/changelog/[applicationId]/components/Sidebar";
import ReleaseCard from "@/app/changelog/[applicationId]/components/ReleaseCard";
import EmptyState from "@/app/changelog/[applicationId]/components/EmptyState";
import Stats from "@/app/changelog/[applicationId]/components/Stats";
import Footer from "@/app/changelog/[applicationId]/components/Footer";
import SearchBar from "@/app/changelog/[applicationId]/components/SearchBar";

type Application = {
  id:number;
  name:string;
  logo:string|null;
  views:number;
};

type Update = {
  id:number;
  applicationId:number;
  title:string;
  version:string;
  status:string;
  content:any;
  publishDate:string|null;
  type:string;
};

function LoadingState(){
  return(
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"/>
        <p className="text-sm text-muted-foreground">
          Loading changelog...
        </p>
      </div>
    </div>
  );
}

function NotFound(){
  return(
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">
          Application not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This changelog does not exist anymore.
        </p>
      </div>
    </div>
  );
}

export default function ChangelogPage(){
  const { applicationId } = useParams();
  const id = applicationId;
  const tracked = useRef(false);

  const [app,setApp] = useState<Application|null>(null);
  const [updates,setUpdates] = useState<Update[]>([]);
  const [filteredUpdates,setFilteredUpdates] = useState<Update[]>([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(true);

  const loadData = useCallback(async()=>{
    try{
      const response = await fetch(`/api/changelog/${id}`);

      if(!response.ok){
        throw new Error();
      }

      const data = await response.json();

      setApp(data.application);
      setUpdates(data.updates);
      setFilteredUpdates(data.updates);
    }catch{
      setApp(null);
    }finally{
      setLoading(false);
    }
  },[id]);

  useEffect(()=>{
    if(id){
      loadData();
    }
  },[id,loadData]);

  useEffect(()=>{
    const query = search.toLowerCase();

    const result = updates.filter((update)=>
      update.title.toLowerCase().includes(query) ||
      update.version.toLowerCase().includes(query)
    );

    setFilteredUpdates(result);
  },[search,updates]);

  useEffect(()=>{
    if(app && !tracked.current){
      tracked.current = true;

      fetch("/api/analytics/events",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          applicationId:app.id,
          type:"changelog_view"
        })
      });
    }
  },[app]);

  if(loading){
    return <LoadingState/>;
  }

  if(!app){
    return <NotFound/>;
  }

  return(
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent"/>
      <Hero
        app={app}
        releaseCount={updates.length}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <motion.div
          initial={{
            opacity:0,
            y:20
          }}
          animate={{
            opacity:1,
            y:0
          }}
          className="mb-10 max-w-xl"
        >
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </motion.div>
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <Sidebar
                updates={filteredUpdates}
              />
            </div>
          </aside>
          <section className="col-span-12 space-y-8 lg:col-span-6">
            {
              filteredUpdates.length === 0
              ?
              <EmptyState/>
              :
              filteredUpdates.map((update)=>(
                <motion.div
                  key={update.id}
                  initial={{
                    opacity:0,
                    y:15
                  }}
                  animate={{
                    opacity:1,
                    y:0
                  }}
                >
                  <ReleaseCard
                    update={update}
                  />
                </motion.div>
              ))
            }
          </section>
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <Stats
                app={app}
                updates={updates}
              />
            </div>
          </aside>
        </div>
      </div>
      <Footer/>
    </main>
  );
}