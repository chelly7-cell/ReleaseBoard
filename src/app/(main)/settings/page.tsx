"use client";

import { useEffect, useState } from "react";
import {
  User,
  Palette,
  Shield,
  Info,
  AlertTriangle,
  Moon,
  Sun,
  LogOut,
  Trash2,
} from "lucide-react";

import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const { theme, setTheme } = useTheme();

  /* -------------------------- LOAD USER -------------------------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/settings");

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setName(data.user.name);
          setImage(data.user.image || "");
        }
      } catch (err) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* -------------------------- SAVE PROFILE -------------------------- */
  const saveProfile = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image: image || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------- SIGN OUT ALL -------------------------- */
  const signOutAll = async () => {
    try {
      const res = await fetch("/api/settings", { method: "POST" });

      if (!res.ok) throw new Error("Failed to sign out");

      toast.success("Signed out from all devices");

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch {
      toast.error("Sign out failed");
    }
  };

  /* -------------------------- DELETE ACCOUNT -------------------------- */
  const deleteAccount = async () => {
    const ok = confirm("This will permanently delete your account.");
    if (!ok) return;

    try {
      const res = await fetch("/api/settings", { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Account deleted");

      setTimeout(() => {
        window.location.href = "/register";
      }, 500);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* -------------------------- LOADING -------------------------- */
  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not found</div>;
  }

  /* -------------------------- UI -------------------------- */
  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account
        </p>
      </div>

      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      {/* APPEARANCE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-lg">
            <div>
              <div>Dark Mode</div>
              <div className="text-sm text-muted-foreground">
                Toggle theme
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) =>
                  setTheme(v ? "dark" : "light")
                }
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button variant="outline" onClick={signOutAll}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out everywhere
          </Button>
        </CardContent>
      </Card>

      {/* ACCOUNT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div>ID: {user.id}</div>
          <div>
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div
            className={
              user.emailVerified ? "text-green-500" : "text-red-500"
            }
          >
            {user.emailVerified ? "Verified" : "Not verified"}
          </div>
        </CardContent>
      </Card>

      {/* DANGER */}
      <Card className="border-red-500/40">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button variant="destructive" onClick={deleteAccount}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}