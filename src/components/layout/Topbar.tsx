"use client";

import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 

export default function Topbar() {

  const router = useRouter();

  const handleSearch = async (value: string) => {
  if (!value.trim()) return;

  const res = await fetch(
    `/api/applications?search=${encodeURIComponent(value)}`
  );

  if (res.status === 401) {
    router.push("/login");
    return;
  }

  if (!res.ok) return;

  const apps = await res.json();

  if (apps.items.length > 0) {
    router.push(`/applications/${apps.items[0].id}`);
  }
};

  return (
    <header className="h-16 border-b bg-background sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
                placeholder="Search applications..."
                className="pl-9 bg-muted/40 border-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <Button asChild size="sm">
            <Link href="/updates/new">
              <Plus className="h-4 w-4 mr-2" />
              New Update
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
