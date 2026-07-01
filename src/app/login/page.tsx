"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { LoginSchema, LoginFormValues } from "@/lib/validations/login";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  // EMAIL LOGIN (BETTER AUTH)
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Welcome back 🎉");

      reset();

      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // GITHUB LOGIN
  const handleGithubLogin = async () => {
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
          Welcome back
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* LOGIN BUTTON */}
          <Button className="w-full" disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>

          {/* DIVIDER */}
          <div className="text-center text-sm text-gray-500">
            or continue with
          </div>

          {/* GITHUB */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGithubLogin}
            disabled={githubLoading}
          >
            {githubLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FaGithub />
            )}
            GitHub
          </Button>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600">
              Create one
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}