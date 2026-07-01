"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Hero from "./components/Hero";

import Sidebar from "./components/Sidebar";
import ReleaseCard from "./components/ReleaseCard";
import EmptyState from "./components/EmptyState";
import Stats from "./components/Stats";
import Footer from "./components/Footer";

type Application = {
  id: number;
  name: string;
  logo: string | null;
  views: number;
};

type Update = {
  id: number;
  title: string;
  version: string;
  status: string;
};

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [app, setApp] = useState<Application | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const res = await fetch(`/api/applications/${id}`);

    if (res.status === 401) router.push("/login");

    const data = await res.json();

    setApp(data.application);
    setUpdates(data.updates);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!app) return null;

  return (
    <main className="min-h-screen bg-background">
      

      <Hero app={app} releaseCount={updates.length} />

      
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-10 px-6 py-10">

        
        <div className="col-span-12 lg:col-span-3">
          <Sidebar updates={updates} />
        </div>

        
        <div className="col-span-12 lg:col-span-6 space-y-10">
          {updates.length === 0 ? (
            <EmptyState />
          ) : (
            updates.map((u) => (
              <ReleaseCard key={u.id} update={u} />
            ))
          )}
        </div>

        
        <div className="hidden lg:block lg:col-span-3">
          <Stats app={app} updates={updates} />
        </div>

      </div>

      <Footer />
    </main>
  );
}