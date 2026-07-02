"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User, Moon } from "lucide-react";

type SettingsForm = {
  name: string;
  email: string;
  darkMode: boolean;
};

export default function SettingsPage() {
  const userId = "demo-user-id"; // 🔥 replace later with real auth

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SettingsForm>({
    name: "",
    email: "",
    darkMode: false,
  });

  const toast = (title: string, desc?: string) => {
    alert(`${title}${desc ? "\n" + desc : ""}`);
  };

  // 🟢 GET DB SETTINGS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/settings?userId=${userId}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.message);

        setForm({
          name: json.data.name,
          email: json.data.email,
          darkMode: json.data.theme === "dark",
        });
      } catch (err: any) {
        toast("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🟡 SAVE TO DB
  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name,
          email: form.email,
          theme: form.darkMode ? "dark" : "light",
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      toast("Success", json.message);
    } catch (err: any) {
      toast("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Connected to real database (Drizzle)
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                UI preference
              </p>
            </div>

            <Switch
              checked={form.darkMode}
              onCheckedChange={(val) =>
                setForm((p) => ({ ...p, darkMode: val }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}