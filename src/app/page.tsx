"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Menu,
  Sparkles,
  Rocket,
  BellRing,
  Globe,
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 -z-20 overflow-hidden">

        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[150px]" />

        <div className="absolute -left-32 top-[600px] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[130px]" />

        <div className="absolute right-0 top-[300px] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[150px]" />

        <div className="absolute bottom-0 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />

      </div>

      {/* Grid */}

      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 px-5 pt-5">

        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-6 py-4 shadow-xl backdrop-blur-xl">

          {/* Logo */}

          <Link href="/" className="group flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-600/30 transition-transform duration-300 group-hover:scale-110">

              <Image
                src="/logo.svg.png"
                alt="ReleaseBoard"
                width={24}
                height={24}
                className="object-contain"
              />

            </div>

            <div>

              <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-lg font-bold text-transparent">

                ReleaseBoard

              </h2>

              <p className="text-xs text-muted-foreground">

                Publish beautiful changelogs

              </p>

            </div>

          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-10 text-sm font-medium text-muted-foreground lg:flex">

            <Link
              href="#features"
              className="transition hover:text-foreground"
            >
              Features
            </Link>

            <Link
              href="#pricing"
              className="transition hover:text-foreground"
            >
              Pricing
            </Link>

            <Link
              href="#testimonials"
              className="transition hover:text-foreground"
            >
              Testimonials
            </Link>

            <Link
              href="#faq"
              className="transition hover:text-foreground"
            >
              FAQ
            </Link>

            <Link
              href="#docs"
              className="transition hover:text-foreground"
            >
              Docs
            </Link>

          </nav>

          {/* Right Side */}

          <div className="hidden items-center gap-3 lg:flex">

            <Button
              variant="ghost"
              asChild
            >
              <Link href="/login">
                Sign In
              </Link>
            </Button>

            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <Link
                href="/register"
                className="flex items-center gap-2"
              >
                Start Free

                <ArrowRight className="h-4 w-4" />

              </Link>

            </Button>

          </div>

          {/* Mobile */}

          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

        </div>

      </header>

      {/* ================= HERO ================= */}

      <section className="relative">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-24 text-center">

          <Badge className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-400">

            <Sparkles className="mr-2 h-4 w-4" />

            Trusted by modern developers

          </Badge>

          <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">

            Ship beautiful

            <span className="block bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">

              Release Notes

            </span>

            without the hassle

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">

            ReleaseBoard helps developers publish modern changelogs,
            announce new features, manage product updates, and keep
            customers informed through elegant public release pages.

          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Button
              size="lg"
              asChild
              className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-base shadow-xl shadow-blue-600/30 transition hover:scale-105"
            >
              <Link href="/register">

                Start for Free

                <ArrowRight className="ml-2 h-5 w-5" />

              </Link>

            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border-border/60 px-8 text-base backdrop-blur-sm"
            >
              Live Demo
            </Button>

          </div>
                    {/* Social Proof */}

          <div className="mt-14 flex flex-col items-center gap-5">

            <div className="flex -space-x-4">

              {[
                "https://i.pravatar.cc/100?img=1",
                "https://i.pravatar.cc/100?img=5",
                "https://i.pravatar.cc/100?img=12",
                "https://i.pravatar.cc/100?img=18",
                "https://i.pravatar.cc/100?img=32",
              ].map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt=""
                  className="h-12 w-12 rounded-full border-4 border-background object-cover shadow-lg"
                />
              ))}

              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg">
                +
              </div>

            </div>

            <div className="space-y-1">

              <p className="font-semibold">

                Trusted by 5,000+ developers

              </p>

              <p className="text-sm text-muted-foreground">

                From indie hackers to growing SaaS companies.

              </p>

            </div>

          </div>

          {/* Statistics */}

          <div className="mt-24 grid w-full gap-6 md:grid-cols-4">

            <div className="rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/40">

              <h3 className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-5xl font-black text-transparent">
                20K+
              </h3>

              <p className="mt-3 text-muted-foreground">
                Releases published
              </p>

            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-500/40">

              <h3 className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-5xl font-black text-transparent">
                4K+
              </h3>

              <p className="mt-3 text-muted-foreground">
                Active companies
              </p>

            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-500/40">

              <h3 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-5xl font-black text-transparent">
                500K+
              </h3>

              <p className="mt-3 text-muted-foreground">
                End users reached
              </p>

            </div>

            <div className="rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-500/40">

              <h3 className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-5xl font-black text-transparent">
                99.99%
              </h3>

              <p className="mt-3 text-muted-foreground">
                Platform uptime
              </p>

            </div>

          </div>

          {/* Dashboard Preview */}

          <div className="relative mt-28 w-full max-w-6xl">

            {/* Glow */}

            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl">

              {/* Browser Bar */}

              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">

                <div className="h-3 w-3 rounded-full bg-red-500" />

                <div className="h-3 w-3 rounded-full bg-yellow-500" />

                <div className="h-3 w-3 rounded-full bg-green-500" />

                <div className="ml-6 rounded-lg bg-zinc-900 px-4 py-1 text-xs text-zinc-400">
                  releaseboard.dev/dashboard
                </div>

              </div>

              {/* Dashboard */}

              <div className="grid gap-8 p-8 lg:grid-cols-4">

                {/* Sidebar */}

                <div className="space-y-4">

                  <div className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600" />

                  <div className="h-10 rounded-xl bg-zinc-900" />
                  <div className="h-10 rounded-xl bg-zinc-900" />
                  <div className="h-10 rounded-xl bg-zinc-900" />
                  <div className="h-10 rounded-xl bg-zinc-900" />
                  <div className="h-10 rounded-xl bg-zinc-900" />

                </div>

                {/* Main */}

                <div className="space-y-6 lg:col-span-3">

                  <div className="grid gap-5 md:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

                      <p className="text-sm text-zinc-500">
                        Total Releases
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-white">
                        148
                      </h3>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

                      <p className="text-sm text-zinc-500">
                        Subscribers
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-white">
                        18.2K
                      </h3>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

                      <p className="text-sm text-zinc-500">
                        Views
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-white">
                        2.4M
                      </h3>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">

                    <div className="mb-6 flex items-center justify-between">

                      <h3 className="text-lg font-semibold text-white">
                        Recent Releases
                      </h3>

                      <Badge className="bg-green-600">
                        Live
                      </Badge>

                    </div>

                    <div className="space-y-4">

                      {[1,2,3,4].map((item) => (

                        <div
                          key={item}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950 p-5"
                        >

                          <div>

                            <p className="font-medium text-white">
                              Release v2.{item}.0
                            </p>

                            <p className="text-sm text-zinc-500">
                              Added new dashboard improvements and bug fixes.
                            </p>

                          </div>

                          <Badge variant="secondary">
                            Published
                          </Badge>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* ================= FEATURES ================= */}

<section
  id="features"
  className="mx-auto max-w-7xl px-6 py-32"
>

  <div className="mx-auto max-w-3xl text-center">

    <Badge className="rounded-full bg-violet-500/10 px-5 py-2 text-violet-400">
      Powerful Features
    </Badge>

    <h2 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">

      Everything you need to
      <span className="block bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
        ship better updates
      </span>

    </h2>

    <p className="mt-6 text-lg text-muted-foreground">

      A complete platform to create, manage, analyze,
      and share your product releases with your users.

    </p>

  </div>


  {/* Feature Grid */}

  <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">


    {/* Feature 1 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-2xl">

      <CardContent className="p-8">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

          <Rocket className="h-7 w-7 text-blue-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Beautiful Changelogs

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Create stunning release pages that make every
          update feel important.

        </p>


      </CardContent>

    </Card>



    {/* Feature 2 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:shadow-2xl">

      <CardContent className="p-8">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

          <BellRing className="h-7 w-7 text-violet-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Notify Users

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Keep your community updated with instant
          product announcements.

        </p>


      </CardContent>

    </Card>




    {/* Feature 3 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-2xl">

      <CardContent className="p-8">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">

          <Globe className="h-7 w-7 text-cyan-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Public Pages

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Share a beautiful public changelog page
          with your customers.

        </p>


      </CardContent>

    </Card>




    {/* Feature 4 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:shadow-2xl">

      <CardContent className="p-8">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">

          <BarChart3 className="h-7 w-7 text-green-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Advanced Analytics

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Understand how users interact with your
          releases.

        </p>


      </CardContent>

    </Card>




    {/* Feature 5 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/40 hover:shadow-2xl">

      <CardContent className="p-8">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10">

          <LayoutDashboard className="h-7 w-7 text-pink-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Developer Dashboard

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Manage applications, releases, and users
          from one place.

        </p>


      </CardContent>

    </Card>




    {/* Feature 6 */}

    <Card className="group rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500/40 hover:shadow-2xl">

      <CardContent className="p-8">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">

          <ShieldCheck className="h-7 w-7 text-yellow-500 transition group-hover:scale-110" />

        </div>


        <h3 className="mt-6 text-xl font-bold">

          Secure & Reliable

        </h3>


        <p className="mt-3 leading-7 text-muted-foreground">

          Built with modern authentication and
          enterprise-ready security.

        </p>


      </CardContent>

    </Card>


  </div>

</section>




{/* ================= WHY RELEASEBOARD ================= */}


<section className="mx-auto max-w-7xl px-6 py-32">


  <div className="grid items-center gap-16 lg:grid-cols-2">


    <div>


      <Badge className="bg-blue-500/10 text-blue-500">

        Why ReleaseBoard

      </Badge>


      <h2 className="mt-8 text-4xl font-black md:text-5xl">

        Stop writing boring
        <span className="block bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">

          release notes

        </span>

      </h2>


      <p className="mt-6 text-lg leading-8 text-muted-foreground">

        Your users deserve better than plain text updates.
        Create a beautiful experience around every product
        improvement.

      </p>


      <div className="mt-8 space-y-5">


        {[
          "Modern editor experience",
          "Public branded changelog pages",
          "Real-time analytics",
          "Simple developer workflow",
        ].map((item)=>(
          
          <div
            key={item}
            className="flex items-center gap-3"
          >

            <Sparkles className="h-5 w-5 text-blue-500"/>

            <span className="font-medium">
              {item}
            </span>

          </div>

        ))}


      </div>


    </div>



    <div className="rounded-[40px] border bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-8">


      <div className="rounded-3xl border bg-background p-8 shadow-2xl">


        <div className="flex items-center justify-between">

          <h3 className="font-bold">
            Latest Update
          </h3>


          <Badge>
            v2.4.0
          </Badge>


        </div>


        <div className="mt-8 space-y-4">


          <div className="rounded-xl bg-muted p-5">

            ✨ New dashboard analytics

          </div>


          <div className="rounded-xl bg-muted p-5">

            🚀 Faster loading performance

          </div>


          <div className="rounded-xl bg-muted p-5">

            🔒 Improved security

          </div>


        </div>


      </div>


    </div>


  </div>


</section>
{/* ================= HOW IT WORKS ================= */}

<section className="mx-auto max-w-7xl px-6 py-32">

  <div className="mx-auto max-w-3xl text-center">

    <Badge className="rounded-full bg-blue-500/10 px-5 py-2 text-blue-500">
      Simple Workflow
    </Badge>

    <h2 className="mt-8 text-4xl font-black md:text-6xl">

      From idea to published
      <span className="block bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
        release in minutes
      </span>

    </h2>

    <p className="mt-6 text-lg text-muted-foreground">

      Create your application, write your update,
      and share it with your users instantly.

    </p>

  </div>


  <div className="mt-20 grid gap-8 md:grid-cols-3">


    {/* Step 1 */}

    <Card className="relative overflow-hidden rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl">

      <CardContent className="p-8">

        <div className="absolute right-5 top-5 text-6xl font-black text-muted/20">
          01
        </div>


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
          🚀
        </div>


        <h3 className="mt-8 text-2xl font-bold">
          Create Application
        </h3>


        <p className="mt-4 leading-7 text-muted-foreground">

          Add your app name, logo, description,
          and branding details.

        </p>


      </CardContent>

    </Card>



    {/* Step 2 */}

    <Card className="relative overflow-hidden rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl">

      <CardContent className="p-8">


        <div className="absolute right-5 top-5 text-6xl font-black text-muted/20">
          02
        </div>


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
          ✍️
        </div>


        <h3 className="mt-8 text-2xl font-bold">
          Write Updates
        </h3>


        <p className="mt-4 leading-7 text-muted-foreground">

          Use our beautiful editor to create
          professional release notes.

        </p>


      </CardContent>

    </Card>



    {/* Step 3 */}

    <Card className="relative overflow-hidden rounded-3xl border-border/60 bg-background/60 backdrop-blur-xl">

      <CardContent className="p-8">


        <div className="absolute right-5 top-5 text-6xl font-black text-muted/20">
          03
        </div>


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
          🌎
        </div>


        <h3 className="mt-8 text-2xl font-bold">
          Publish Worldwide
        </h3>


        <p className="mt-4 leading-7 text-muted-foreground">

          Share your changelog page and keep
          your users updated.

        </p>


      </CardContent>

    </Card>


  </div>


</section>





{/* ================= TESTIMONIALS ================= */}


<section
  id="testimonials"
  className="border-y bg-muted/20 py-32"
>


<div className="mx-auto max-w-7xl px-6">


<div className="mx-auto max-w-3xl text-center">


<Badge className="bg-violet-500/10 text-violet-500">

Developer Love

</Badge>


<h2 className="mt-8 text-4xl font-black md:text-5xl">

Loved by builders

</h2>


<p className="mt-5 text-muted-foreground">

Thousands of developers use ReleaseBoard
to communicate better.

</p>


</div>



<div className="mt-20 grid gap-6 md:grid-cols-3">


{[
{
name:"Alex Morgan",
role:"Indie Hacker",
text:"ReleaseBoard completely changed how I communicate updates with my users."
},
{
name:"Sarah Kim",
role:"Startup Founder",
text:"The changelog pages look amazing and our users love them."
},
{
name:"David Chen",
role:"Software Engineer",
text:"Exactly what developers need to publish product updates."
}
].map((item)=>(


<Card
key={item.name}
className="rounded-3xl border-border/60 bg-background/70"
>

<CardContent className="p-8">


<div className="flex gap-1 text-yellow-500">

★★★★★

</div>


<p className="mt-5 leading-7 text-muted-foreground">

"{item.text}"

</p>


<div className="mt-8">

<h4 className="font-bold">

{item.name}

</h4>


<p className="text-sm text-muted-foreground">

{item.role}

</p>


</div>


</CardContent>

</Card>


))}


</div>


</div>


</section>





{/* ================= PRICING PREVIEW ================= */}


<section
id="pricing"
className="mx-auto max-w-7xl px-6 py-32"
>


<div className="text-center">


<Badge className="bg-green-500/10 text-green-500">

Simple Pricing

</Badge>


<h2 className="mt-8 text-4xl font-black md:text-5xl">

Start free.
Grow when ready.

</h2>


<p className="mt-5 text-muted-foreground">

No complicated pricing. No hidden fees.

</p>


</div>




<div className="mx-auto mt-16 max-w-xl">


<Card className="rounded-[40px] border-2 border-blue-500/30 bg-background shadow-2xl">


<CardContent className="p-10 text-center">


<h3 className="text-2xl font-bold">

Developer Plan

</h3>


<div className="mt-6">

<span className="text-6xl font-black">

$0

</span>


<span className="text-muted-foreground">

 / month

</span>


</div>



<p className="mt-5 text-muted-foreground">

Everything needed to publish your first releases.

</p>



<div className="mt-8 space-y-4 text-left">


{[
"Unlimited applications",
"Beautiful changelog pages",
"Analytics dashboard",
"Developer friendly API"
].map(feature=>(


<div
key={feature}
className="flex items-center gap-3"
>

<CheckCircle2 className="h-5 w-5 text-green-500"/>

<span>
{feature}
</span>

</div>


))}


</div>



<Button
className="mt-10 h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600"
>

Create Account

</Button>


</CardContent>


</Card>


</div>


</section>





{/* ================= FAQ ================= */}


<section
id="faq"
className="mx-auto max-w-4xl px-6 py-24"
>


<div className="text-center">


<h2 className="text-4xl font-black">

Frequently Asked Questions

</h2>


</div>



<div className="mt-12 space-y-4">


{[
[
"Is ReleaseBoard free?",
"Yes, you can start completely free."
],
[
"Can I use my own branding?",
"Yes, customize your changelog pages."
],
[
"Does it support multiple apps?",
"Yes, manage unlimited applications."
]
].map(([question,answer])=>(


<Card
key={question}
className="rounded-2xl"
>

<CardContent className="p-6">


<h3 className="font-bold">

{question}

</h3>


<p className="mt-2 text-muted-foreground">

{answer}

</p>


</CardContent>

</Card>


))}


</div>


</section>
{/* ================= FINAL CTA ================= */}

<section className="mx-auto max-w-7xl px-6 py-32">

  <div className="relative overflow-hidden rounded-[50px] border bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 px-8 py-20 text-center shadow-2xl md:px-20">


    {/* Glow Effects */}

    <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />

    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-black/20 blur-3xl" />



    <div className="relative z-10 mx-auto max-w-3xl">


      <Badge className="border-white/20 bg-white/10 text-white">

        🚀 Start Building Today

      </Badge>



      <h2 className="mt-8 text-4xl font-black text-white md:text-6xl">

        Ready to transform
        <span className="block">
          your releases?
        </span>

      </h2>



      <p className="mt-6 text-lg leading-8 text-white/80">

        Join developers who use ReleaseBoard
        to create beautiful product experiences.

      </p>



      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


        <Button
          size="lg"
          className="h-14 rounded-xl bg-white px-10 text-black hover:bg-white/90"
          asChild
        >

          <Link href="/register">

            Create Free Account

            <ArrowRight className="ml-2 h-5 w-5"/>

          </Link>


        </Button>



        <Button
          size="lg"
          variant="outline"
          className="h-14 rounded-xl border-white/30 bg-white/10 px-10 text-white hover:bg-white/20"
        >

          Contact Sales

        </Button>


      </div>


    </div>


  </div>


</section>





{/* ================= FOOTER ================= */}


<footer className="border-t">


<div className="mx-auto max-w-7xl px-6 py-16">


<div className="grid gap-12 md:grid-cols-5">



{/* Brand */}

<div className="md:col-span-2">


<Link
href="/"
className="flex items-center gap-3"
>


<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">


<Image
src="/logo.svg.png"
alt="ReleaseBoard"
width={25}
height={25}
/>


</div>



<div>


<h3 className="text-xl font-bold">

ReleaseBoard

</h3>


<p className="text-sm text-muted-foreground">

Modern changelog platform

</p>


</div>


</Link>



<p className="mt-6 max-w-sm leading-7 text-muted-foreground">

Helping developers publish beautiful
release notes and keep users informed.

</p>


</div>





{/* Product */}

<div>


<h4 className="font-semibold">

Product

</h4>


<ul className="mt-5 space-y-3 text-sm text-muted-foreground">


<li>
<Link href="#" className="hover:text-foreground">
Features
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Pricing
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Changelog
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Roadmap
</Link>
</li>


</ul>


</div>





{/* Resources */}

<div>


<h4 className="font-semibold">

Resources

</h4>


<ul className="mt-5 space-y-3 text-sm text-muted-foreground">


<li>
<Link href="#" className="hover:text-foreground">
Documentation
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
API
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Guides
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Support
</Link>
</li>


</ul>


</div>





{/* Company */}

<div>


<h4 className="font-semibold">

Company

</h4>


<ul className="mt-5 space-y-3 text-sm text-muted-foreground">


<li>
<Link href="#" className="hover:text-foreground">
About
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Blog
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Careers
</Link>
</li>


<li>
<Link href="#" className="hover:text-foreground">
Contact
</Link>
</li>


</ul>


</div>



</div>





{/* Bottom Footer */}


<div className="mt-16 flex flex-col justify-between gap-5 border-t pt-8 text-sm text-muted-foreground md:flex-row">


<p>

© {new Date().getFullYear()} ReleaseBoard.
All rights reserved.

</p>



<div className="flex gap-6">


<Link
href="#"
className="hover:text-foreground"
>

Twitter

</Link>


<Link
href="#"
className="hover:text-foreground"
>

GitHub

</Link>


<Link
href="#"
className="hover:text-foreground"
>

Privacy

</Link>


<Link
href="#"
className="hover:text-foreground"
>

Terms

</Link>


</div>


</div>



</div>


</footer>



</main> )}