"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ChangelogPage() {
  const { id } = useParams();

  const [app,setApp] = useState<Application|null>(null);
  const [updates,setUpdates] = useState<Update[]>([]);
  const [filteredUpdates,setFilteredUpdates] = useState<Update[]>([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(true);

  const loadData = useCallback(async()=> {
    try {
      const res = await fetch(`/api/applications/${id}`);

      if(!res.ok){
        throw new Error();
      }

      const data = await res.json();

      setApp(data.application);
      setUpdates(data.updates);
      setFilteredUpdates(data.updates);

    } catch {
      setApp(null);
    } finally {
      setLoading(false);
    }
  },[id]);

  useEffect(()=>{
    if(id){
      loadData();
    }
  },[id,loadData]);

  useEffect(()=>{
    const result = updates.filter((update)=> 
      update.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      update.version
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUpdates(result);

  },[search,updates]);


  if(loading){
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading changelog...
      </div>
    );
  }


  if(!app){
    return (
      <div className="flex min-h-screen items-center justify-center">
        Application not found
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-background">

      <Hero
        app={app}
        releaseCount={updates.length}
      />

      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8 max-w-xl">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="grid grid-cols-12 gap-10">

          <aside className="col-span-12 lg:col-span-3">
            <Sidebar
              updates={filteredUpdates}
            />
          </aside>

          <section className="col-span-12 space-y-8 lg:col-span-6">

            {filteredUpdates.length === 0 ? (
              <EmptyState/>
            ) : (
              filteredUpdates.map((update)=>(
                <ReleaseCard
                  key={update.id}
                  update={update}
                />
              ))
            )}

          </section>

          <aside className="hidden lg:block lg:col-span-3">
            <Stats
              app={app}
              updates={updates}
            />
          </aside>
        </div>
      </div>
      <Footer/>
    </main>
  );
}