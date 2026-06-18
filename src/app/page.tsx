"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      
      {/* HEADER */}
      <header className="border-b bg-background/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              <img src="logo.svg.png" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg">ReleaseBoard</span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition">Features</Link>
            <Link href="#" className="hover:text-foreground transition">Pricing</Link>
            <Link href="#" className="hover:text-foreground transition">Docs</Link>
          </nav>

          {/* AUTH BUTTONS */}
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[500px] h-[500px] bg-primary/20 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-6">

          <Badge className="mb-4">For Developers</Badge>

          <h1 className="text-5xl font-bold leading-tight">
            Publish and share your updates with ease
          </h1>

          <p className="text-muted-foreground mt-5 text-lg">
            ReleaseBoard helps developers publish, manage, and distribute app updates
            through a public changelog page — simple, fast, and beautiful.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>

            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 py-16">

        <Card className="p-6 hover:shadow-md transition">
          <h3 className="font-semibold">Beautiful Changelogs</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create clean and modern release notes for your users.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-md transition">
          <h3 className="font-semibold">Developer Friendly</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Simple API and dashboard to manage updates easily.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-md transition">
          <h3 className="font-semibold">Public Pages</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Share updates instantly with a public changelog page.
          </p>
        </Card>

      </section>

      <Separator />

      {/* TRUST SECTION */}
      <section className="text-center py-14">

        <p className="text-xs text-muted-foreground mb-6">
          Trusted by developers worldwide
        </p>

        <div className="flex justify-center flex-wrap gap-8 text-muted-foreground text-sm">
          <span>GitHub</span>
          <span>Vercel</span>
          <span>Netlify</span>
          <span>Microsoft</span>
          <span>Stripe</span>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ReleaseBoard. All rights reserved.</p>
      </footer>

    </main>
  );
}