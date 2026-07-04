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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

if (!mounted) return null;
  /* -------------------------------------------------------------------------- */
  /*                                 LOAD USER                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setName(data.user.name);
          setImage(data.user.image || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               SAVE PROFILE                                 */
  /* -------------------------------------------------------------------------- */

  const saveProfile = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: image || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             SIGN OUT ALL DEVICES                           */
  /* -------------------------------------------------------------------------- */

  const signOutAll = async () => {
    await fetch("/api/settings", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  /* -------------------------------------------------------------------------- */
  /*                              DELETE ACCOUNT                                */
  /* -------------------------------------------------------------------------- */

  const deleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure? This action cannot be undone."
    );

    if (!confirmDelete) return;

    await fetch("/api/settings", {
      method: "DELETE",
    });

    window.location.href = "/register";
  };

  /* -------------------------------------------------------------------------- */
  /*                                   LOADING                                  */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading settings...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-red-500">
        Failed to load user.
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings.
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

        <CardContent className="space-y-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <Separator />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
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

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="font-medium">Dark Mode</div>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")}/>
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        <CardContent className="space-y-4">
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

        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-sm">{user.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Email Verified
            </span>

            <span
              className={
                user.emailVerified
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {user.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-red-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button
            variant="destructive"
            onClick={deleteAccount}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}