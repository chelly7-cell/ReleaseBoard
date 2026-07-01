"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  RegisterSchema,
  RegisterFormValues,
} from "@/lib/validations/register";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  // EMAIL REGISTER (BETTER AUTH)
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Account created 🎉");

      reset();

      // Better Auth already logs user in → redirect only
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // GITHUB REGISTER
  const handleGithubRegister = async () => {
    try {
      setGithubLoading(true);

      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      toast.error("GitHub login failed");
      console.error(err);
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Create account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME */}
          <div>
            <Input placeholder="Full name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>

          {/* GITHUB */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGithubRegister}
            disabled={githubLoading}
          >
            {githubLoading ? "Loading..." : "Continue with GitHub"}
          </Button>

          {/* LOGIN LINK */}
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}