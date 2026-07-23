"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  ResetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validations/reset-password";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, GitBranch, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset link is invalid or expired");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) throw new Error(error.message);

      toast.success("Password updated");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Couldn't reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-[#FAFAF9]">
      <div className="relative hidden md:flex flex-col justify-between bg-[#0B0E14] text-[#FAFAF9] px-12 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#FAFAF9 1px, transparent 1px), linear-gradient(90deg, #FAFAF9 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex items-center gap-2 font-mono text-sm tracking-wide text-[#9CA3AF]">
          <GitBranch className="h-4 w-4 text-[#1FAA59]" />
          releaseboard
        </div>

        <div className="relative space-y-6">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight max-w-sm">
            Almost back in.
          </h1>

          <p className="text-sm text-[#9CA3AF] max-w-sm">
            Choose a new password to finish resetting your account.
          </p>
        </div>

        <div />
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          <div className="mb-8 md:hidden flex items-center gap-2 font-mono text-sm text-[#6B7280]">
            <GitBranch className="h-4 w-4 text-[#1FAA59]" />
            releaseboard
          </div>

          <div className="rounded-2xl border border-[#E5E4DF] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">

            <h2 className="text-2xl font-semibold tracking-tight text-[#14171F]">
              Set a new password
            </h2>

            <p className="mt-1.5 text-sm text-[#6B7280]">
              Must be at least 8 characters.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#374151]"
                >
                  New password
                </label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-11 border-[#E5E4DF] bg-white pr-10 text-[#14171F] placeholder:text-[#9CA3AF] transition-colors focus-visible:ring-2 focus-visible:ring-[#1FAA59]/40 focus-visible:border-[#1FAA59]"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>


              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-[#374151]"
                >
                  Confirm password
                </label>

                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 border-[#E5E4DF] bg-white text-[#14171F] placeholder:text-[#9CA3AF] transition-colors focus-visible:ring-2 focus-visible:ring-[#1FAA59]/40 focus-visible:border-[#1FAA59]"
                  {...register("confirmPassword")}
                />

                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>


              <Button
                className="h-11 w-full bg-[#0B0E14] font-medium text-[#FAFAF9] transition-transform hover:bg-[#0B0E14]/90 active:scale-[0.99]"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Update password
              </Button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}