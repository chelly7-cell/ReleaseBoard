"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AlertCircle,
  BarChart3,
  Plus,
  Sparkles,
  TrendingUp,
  FileText,
  Eye,
  Pencil,
  Layers,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


type AnalyticsData = {
  chartData:{
    date:string;
    views:number;
  }[];

  overview: {
    applications: number;
    updates: number;
    published: number;
    drafts: number;

    applicationViews: number;
    updateViews: number;

    totalViews: number;
    averageViews: number;
  };

  topApplications:any[];
  topUpdates:any[];
  recentApplications:any[];
};


export default function AnalyticsPage() {

  const [data,setData] =
    useState<AnalyticsData | null>(null);

  const [loading,setLoading] =
    useState(true);

  const [error,setError] =
    useState<string | null>(null);



  async function fetchAnalytics(){

    try{

      setLoading(true);
      setError(null);


      const res =
        await fetch("/api/analytics");


      if(!res.ok){
        throw new Error(
          "Failed to load analytics"
        );
      }


      const json =
        await res.json();


      setData(json);


    }catch(err:any){

      setError(
        err.message ||
        "Something went wrong"
      );

    }finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    fetchAnalytics();

  },[]);




  if(loading){

    return (

      <div className="p-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {Array.from({
            length:8
          }).map((_,i)=>(

            <Card
              key={i}
              className="rounded-2xl"
            >

              <CardHeader>

                <Skeleton className="h-4 w-24"/>

              </CardHeader>


              <CardContent>

                <Skeleton className="h-8 w-16"/>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    );

  }



  if(error){

    return (

      <div className="p-6 flex justify-center">

        <Card className="max-w-md w-full">

          <CardContent className="p-6 flex flex-col items-center gap-4">

            <AlertCircle className="text-destructive"/>


            <p className="text-sm text-muted-foreground">
              {error}
            </p>


            <Button
              onClick={fetchAnalytics}
            >
              Retry
            </Button>

          </CardContent>

        </Card>

      </div>

    );

  }



  if(!data || data.overview.applications===0){

    return (

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">

        <Empty className="max-w-4xl border rounded-3xl">

          <EmptyHeader>

            <EmptyMedia className="bg-primary/10">

              <BarChart3 className="size-10 text-primary"/>

            </EmptyMedia>


            <EmptyTitle className="text-3xl">

              No analytics yet

            </EmptyTitle>


            <EmptyDescription>

              Create applications and publish updates
              to start collecting analytics.

            </EmptyDescription>


          </EmptyHeader>


          <EmptyContent>


            <Button asChild>

              <Link href="/applications">

                <Plus className="mr-2 h-4 w-4"/>

                Create Application

              </Link>

            </Button>


          </EmptyContent>


        </Empty>

      </div>

    );

  }


  const {overview}=data;
  const chartConfig = {
    views:{
      label:"Views",
    },
  };
    const stats = [
    {
      label: "Applications",
      value: overview.applications,
      icon: FileText,
    },
    {
      label: "Updates",
      value: overview.updates,
      icon: Layers,
    },
    {
      label: "Published",
      value: overview.published,
      icon: Sparkles,
    },
    {
      label: "Drafts",
      value: overview.drafts,
      icon: Pencil,
    },
    {
      label: "Application Views",
      value: overview.applicationViews,
      icon: Eye,
    },
    {
      label: "Update Views",
      value: overview.updateViews,
      icon: TrendingUp,
    },
    {
      label: "Total Views",
      value: overview.totalViews,
      icon: BarChart3,
    },
    {
      label: "Average Views",
      value: overview.averageViews,
      icon: TrendingUp,
    },
  ];


  return (

    <div className="p-6 space-y-8">


      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Analytics Dashboard
        </h1>


        <p className="text-sm text-muted-foreground mt-2">
          Track your applications performance,
          releases and audience engagement.
        </p>

      </div>



      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {stats.map((item,index)=>(

          <Card
            key={index}
            className="rounded-2xl"
          >

            <CardHeader
              className="
              flex
              flex-row
              items-center
              justify-between
              pb-2
              "
            >

              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>


              <item.icon
                className="
                h-4
                w-4
                text-muted-foreground
                "
              />

            </CardHeader>


            <CardContent>

              <div className="text-2xl font-bold">

                {item.value}

              </div>

            </CardContent>


          </Card>

        ))}

      </div>
      {/* VIEWS CHART */}

      <Card className="rounded-2xl">

      <CardHeader>

        <CardTitle>
          Views Over Time
        </CardTitle>

      </CardHeader>


      <CardContent>

        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full"
        >

          <LineChart
            data={data.chartData}
          >

            <CartesianGrid
              vertical={false}
            />

            <XAxis
              dataKey="date"
            />

            <YAxis />

            <ChartTooltip
              content={
                <ChartTooltipContent />
              }
            />

            <Line
              dataKey="views"
              type="monotone"
              stroke="currentColor"
              strokeWidth={2}
              dot
            />

          </LineChart>

        </ChartContainer>

      </CardContent>

    </Card>


    {/* TOP APPLICATIONS */}

    <Card className="rounded-2xl">

      <CardHeader>
        <CardTitle>
          Top Applications
        </CardTitle>
      </CardHeader>

        <CardContent className="space-y-4">


          {data.topApplications.length===0 ? (

            <p className="text-sm text-muted-foreground">
              No applications data.
            </p>


          ):(

            data.topApplications.map((app)=> (

              <div
                key={app.id}
                className="
                flex
                items-center
                justify-between
                border-b
                last:border-0
                pb-3
                "
              >

                <div>

                  <p className="font-medium">
                    {app.name}
                  </p>


                  <p className="text-xs text-muted-foreground">

                    {app.updatesCount} updates

                  </p>

                </div>


                <div className="flex items-center gap-2 text-sm">

                  <Eye className="h-4 w-4"/>

                  {app.views}

                </div>


              </div>

            ))

          )}

        </CardContent>

      </Card>






      {/* TOP UPDATES */}

      <Card className="rounded-2xl">

        <CardHeader>

          <CardTitle>
            Top Updates
          </CardTitle>

        </CardHeader>


        <CardContent className="space-y-4">


          {
            data.topUpdates.length===0 ? (

              <p className="text-sm text-muted-foreground">
                No updates data.
              </p>


            ):(

              data.topUpdates.map((update)=>(

                <div
                  key={update.id}
                  className="
                  flex
                  justify-between
                  items-center
                  border-b
                  last:border-0
                  pb-3
                  "
                >

                  <div>

                    <p className="font-medium">
                      {update.title}
                    </p>


                    <p className="text-xs text-muted-foreground">

                      {update.applicationName}

                    </p>

                  </div>


                  <div className="flex items-center gap-2 text-sm">

                    <Eye className="h-4 w-4"/>

                    {update.views}

                  </div>


                </div>

              ))

            )
          }


        </CardContent>

      </Card>






      {/* RECENT APPLICATIONS */}


      <Card className="rounded-2xl">


        <CardHeader>

          <CardTitle>
            Recent Applications
          </CardTitle>

        </CardHeader>



        <CardContent className="space-y-4">


          {
            data.recentApplications.length===0 ? (

              <p className="text-sm text-muted-foreground">
                No recent applications.
              </p>


            ):(
              
              data.recentApplications.map((app)=>(

                <div
                  key={app.id}
                  className="
                  flex
                  justify-between
                  items-center
                  "
                >

                  <div>

                    <p className="font-medium">
                      {app.name}
                    </p>


                    <p className="text-xs text-muted-foreground">

                      {
                        new Date(
                          app.createdAt
                        ).toLocaleDateString()
                      }

                    </p>

                  </div>


                  <div className="text-sm flex gap-2 items-center">

                    <Eye className="h-4 w-4"/>

                    {app.views}

                  </div>


                </div>

              ))

            )
          }


        </CardContent>


      </Card>


    </div>

  );

}