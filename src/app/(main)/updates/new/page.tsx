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


      router.push(`/updates/${update.id}/editor`);


    } catch (error: any) {

      console.error(error);

      toast.error(
        error.message || "Unable to create update"
      );


    } finally {

      setLoading(false);

    }
  };  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Update</CardTitle>

          <CardDescription>
            Publish a new application update
          </CardDescription>
        </CardHeader>


        <CardContent className="space-y-4">


          {/* Application */}

          <div>
            <Select
              value={form.applicationId}
              disabled={loadingApplications}
              onValueChange={async (value) => {

                setForm((prev) => ({
                  ...prev,
                  applicationId: value,
                }));


                setErrors((prev) => ({
                  ...prev,
                  applicationId: "",
                }));


                try {

                  const res = await fetch(
                    `/api/updates/latest?applicationId=${value}`
                  );


                  const data = await res.json();


                  setForm((prev) => ({
                    ...prev,
                    applicationId: value,
                    version: getNextVersion(data.version),
                  }));


                } catch (error) {


                  console.error(error);


                  setForm((prev) => ({
                    ...prev,
                    applicationId: value,
                    version: "1.0.0",
                  }));

                }

              }}
            >

              <SelectTrigger>

                <SelectValue
                  placeholder={
                    loadingApplications
                      ? "Loading applications..."
                      : "Select application"
                  }
                />

              </SelectTrigger>


              <SelectContent>

                {applications.map((application) => (

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
              <p className="text-sm text-red-500 mt-1">
                {errors.applicationId}
              </p>
            )}

          </div>



          {/* Title */}

          <div>

            <Input
              placeholder="Update title"
              value={form.title}

              onChange={(e) => {

                setForm({
                  ...form,
                  title: e.target.value,
                });


                setErrors({
                  ...errors,
                  title: "",
                });

              }}
            />


            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title}
              </p>
            )}

          </div>




          {/* Type */}

          <div>

            <Select

              value={form.type}

              onValueChange={(value) => {

                setForm({
                  ...form,
                  type: value,
                });


                setErrors({
                  ...errors,
                  type: "",
                });

              }}

            >

              <SelectTrigger>

                <SelectValue placeholder="Select update type" />

              </SelectTrigger>


              <SelectContent>

                <SelectItem value="fix">
                  Bug Fix
                </SelectItem>


                <SelectItem value="feature">
                  Feature
                </SelectItem>


                <SelectItem value="improvement">
                  Improvement
                </SelectItem>


              </SelectContent>

            </Select>


            {errors.type && (
              <p className="text-sm text-red-500 mt-1">
                {errors.type}
              </p>
            )}

          </div>





          {/* Version */}

          <div>

            <Input
              placeholder="Version (e.g. 1.0.1)"

              value={form.version}


              onChange={(e) => {

                setForm({
                  ...form,
                  version: e.target.value,
                });


                setErrors({
                  ...errors,
                  version: "",
                });

              }}
            />


            {errors.version && (
              <p className="text-sm text-red-500 mt-1">
                {errors.version}
              </p>
            )}

          </div>





          {/* Description */}

          <div>

            <Textarea

              placeholder="Describe what changed..."

              value={form.description}


              onChange={(e) => {

                setForm({
                  ...form,
                  description: e.target.value,
                });


                setErrors({
                  ...errors,
                  description: "",
                });

              }}

            />


            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description}
              </p>
            )}

          </div>





          {/* Actions */}

          <div className="flex gap-2">


            <Button

              onClick={handleSubmit}

              disabled={loading}

              className="w-full"

            >

              {loading
                ? "Creating..."
                : "Create Update"
              }

            </Button>



            <Button
              asChild
              variant="outline"
            >

              <Link href="/updates">
                Cancel
              </Link>

            </Button>


          </div>


        </CardContent>

      </Card>

    </div>
  );
}