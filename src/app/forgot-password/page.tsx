"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  ForgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validations/forgot-password";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, GitBranch, Loader2, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
        throw new Error(error.message);
        }
    } catch (err: any) {
      toast.error(err.message || "Couldn't send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-[#FAFAF9]">
      {/* BRAND PANEL */}
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
            Locked out happens. Let's get you back in.
          </h1>
          <p className="text-sm text-[#9CA3AF] max-w-sm">
            We'll email you a secure link to set a new password.
          </p>
        </div>
        <div />
      </div>

      {/* FORM PANEL */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden flex items-center gap-2 font-mono text-sm text-[#6B7280]">
            <GitBranch className="h-4 w-4 text-[#1FAA59]" />
            releaseboard
          </div>

          <div className="rounded-2xl border border-[#E5E4DF] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1FAA59]/10">
                  <MailCheck className="h-5 w-5 text-[#1FAA59]" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-[#14171F]">
                  Check your inbox
                </h2>
                <p className="mt-1.5 text-sm text-[#6B7280]">
                  We sent a reset link to{" "}
                  <span className="font-medium text-[#14171F]">
                    {getValues("email")}
                  </span>
                  .
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold tracking-tight text-[#14171F]">
                  Reset your password
                </h2>
                <p className="mt-1.5 text-sm text-[#6B7280]">
                  Enter the email linked to your account.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-[#374151]">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="h-11 border-[#E5E4DF] bg-white text-[#14171F] placeholder:text-[#9CA3AF] transition-colors focus-visible:ring-2 focus-visible:ring-[#1FAA59]/40 focus-visible:border-[#1FAA59]"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    className="h-11 w-full bg-[#0B0E14] font-medium text-[#FAFAF9] transition-transform hover:bg-[#0B0E14]/90 active:scale-[0.99]"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send reset link
                  </Button>
                </form>
              </>
            )}
          </div>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-[#6B7280] hover:text-[#14171F] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}