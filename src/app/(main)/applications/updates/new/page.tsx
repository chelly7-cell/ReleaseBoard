"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Application = {
  id: number;
  name: string;
};

type ApplicationsResponse = {
  items: Application[];
};

export default function CreateUpdatePage() {
  function getNextVersion(version?: string) {

  if (!version) {
    return "1.0.0";
  }


  const parts = version
    .split(".")
    .map(Number);


  if (
    parts.length !== 3 ||
    parts.some(isNaN)
  ) {
    return "1.0.0";
  }


  parts[2] += 1;


  return parts.join(".");
}
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const [applications, setApplications] = useState<Application[]>([]);

  const [form, setForm] = useState({
    applicationId: "",
    title: "",
    type: "",
    version: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    applicationId: "",
    title: "",
    type: "",
    version: "",
    description: "",
  });


  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications?pageSize=50");

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Unable to load applications");
        }

        const data = (await res.json()) as ApplicationsResponse;

        setApplications(data.items);

        // Auto select when only one application exists
        if (data.items.length === 1) {
          setForm((prev) => ({
            ...prev,
            applicationId: String(data.items[0].id),
          }));
        }

      } catch (error) {
        console.error(error);
        toast.error("Unable to load applications");

      } finally {
        setLoadingApplications(false);
      }
    }

    loadApplications();

  }, [router]);


  const handleSubmit = async () => {

    const applicationIdNum = Number(form.applicationId);


    const newErrors = {
      applicationId: "",
      title: "",
      type: "",
      version: "",
      description: "",
    };


    if (!applicationIdNum || applicationIdNum <= 0) {
      newErrors.applicationId = "Please select an application";
    }

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.type) {
      newErrors.type = "Update type is required";
    }

    if (!form.version.trim()) {
      newErrors.version = "Version is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }


    setErrors(newErrors);


    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }


    setLoading(true);


    try {

      const res = await fetch("/api/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,
          applicationId: applicationIdNum,
        }),
      });


      if (res.status === 401) {
        router.push("/login");
        return;
      }


      if (!res.ok) {

        const errorData = await res.json();

        throw new Error(
          errorData.message ||
          errorData.error ||
          "Unable to create update"
        );
      }


      const update = await res.json();


      toast.success("Update created successfully");


      setForm({
        applicationId: "",
        title: "",
        type: "",
        version: "",
        description: "",
      });


      router.push(`/applications/updates/${update.id}/editor`);


    } catch (error: any) {

      console.error(error);

      toast.error(
        error.message || "Unable to create update"
      );


    } finally {

      setLoading(false);

    }
  };  return (
  <div className="min-h-screen bg-[#11131]from-background via-background to-muted/40 px-4 py-10">
    <div className="mx-auto max-w-3xl">

      {/* Header */}
      <div className="mb-8 space-y-2">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            ✨
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Update
            </h1>

            <p className="text-sm text-muted-foreground">
              Publish a new release for your application
            </p>
          </div>

        </div>

      </div>



      {/* Form Card */}
      <Card className="border-border/50 bg-background/80 shadow-xl backdrop-blur">

        <CardHeader className="border-b">

          <CardTitle className="text-xl">
            Release Information
          </CardTitle>

          <CardDescription>
            Fill the details below to create your update.
          </CardDescription>

        </CardHeader>



        <CardContent className="space-y-6 pt-6">



          {/* Application */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Application
              <span className="text-red-500 ml-1">*</span>
            </label>


            <Select
              value={form.applicationId}
              disabled={loadingApplications}
              onValueChange={async (value) => {

                setForm((prev)=>({
                  ...prev,
                  applicationId:value
                }));

                setErrors((prev)=>({
                  ...prev,
                  applicationId:""
                }));

                try {

                  const res = await fetch(
                    `/api/updates/latest?applicationId=${value}`
                  );

                  const data = await res.json();


                  setForm((prev)=>({
                    ...prev,
                    applicationId:value,
                    version:getNextVersion(data.version)
                  }));

                } catch {

                  setForm((prev)=>({
                    ...prev,
                    applicationId:value,
                    version:"1.0.0"
                  }));

                }

              }}
            >

              <SelectTrigger className="h-11">

                <SelectValue
                  placeholder={
                    loadingApplications
                    ? "Loading applications..."
                    : "Choose application"
                  }
                />

              </SelectTrigger>


              <SelectContent>

                {applications.map((application)=>(
                  <SelectItem
                    key={application.id}
                    value={String(application.id)}
                  >
                    {application.name}
                  </SelectItem>
                ))}

              </SelectContent>


            </Select>


            {errors.applicationId && (
              <p className="text-xs text-red-500">
                {errors.applicationId}
              </p>
            )}

          </div>




          {/* Title */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Update Title
              <span className="text-red-500 ml-1">*</span>
            </label>


            <Input
              className="h-11"
              placeholder="Example: Added dark mode support"
              value={form.title}

              onChange={(e)=>{

                setForm({
                  ...form,
                  title:e.target.value
                });

                setErrors({
                  ...errors,
                  title:""
                });

              }}
            />


            {errors.title && (
              <p className="text-xs text-red-500">
                {errors.title}
              </p>
            )}

          </div>




          {/* Type + Version */}
          <div className="grid gap-5 md:grid-cols-2">


            <div className="space-y-2">

              <label className="text-sm font-medium">
                Update Type
                <span className="text-red-500 ml-1">*</span>
              </label>


              <Select
                value={form.type}
                onValueChange={(value)=>{

                  setForm({
                    ...form,
                    type:value
                  });

                  setErrors({
                    ...errors,
                    type:""
                  });

                }}
              >

                <SelectTrigger className="h-11">

                  <SelectValue placeholder="Select type"/>

                </SelectTrigger>


                <SelectContent>

                  <SelectItem value="feature">
                    🚀 Feature
                  </SelectItem>

                  <SelectItem value="improvement">
                    ⚡ Improvement
                  </SelectItem>

                  <SelectItem value="fix">
                    🐛 Bug Fix
                  </SelectItem>

                </SelectContent>


              </Select>


              {errors.type && (
                <p className="text-xs text-red-500">
                  {errors.type}
                </p>
              )}

            </div>




            <div className="space-y-2">


              <label className="text-sm font-medium">
                Version
                <span className="text-red-500 ml-1">*</span>
              </label>


              <Input

                className="h-11"

                placeholder="1.0.1"

                value={form.version}


                onChange={(e)=>{

                  setForm({
                    ...form,
                    version:e.target.value
                  });

                  setErrors({
                    ...errors,
                    version:""
                  });

                }}

              />


              {errors.version && (
                <p className="text-xs text-red-500">
                  {errors.version}
                </p>
              )}


            </div>


          </div>





          {/* Description */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>


            <Textarea

              className="min-h-[140px] resize-none"

              placeholder="Explain what changed in this release..."

              value={form.description}


              onChange={(e)=>{

                setForm({
                  ...form,
                  description:e.target.value
                });


                setErrors({
                  ...errors,
                  description:""
                });

              }}

            />


            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description}
              </p>
            )}

          </div>






          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">


            <Button
              asChild
              variant="outline"
              className="h-11"
            >

              <Link href="./applications/updates">
                Cancel
              </Link>

            </Button>



            <Button

              onClick={handleSubmit}

              disabled={loading}

              className="h-11 bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-white shadow-lg hover:opacity-90"

            >

              {loading
              ? "Creating..."
              : "Create Update"
              }


            </Button>


          </div>


        </CardContent>


      </Card>


    </div>
  </div>
)};