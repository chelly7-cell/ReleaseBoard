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

import { Eye, EyeOff, Loader2, GitBranch } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const RECENT_RELEASES = [
  { version: "v2.4.0", note: "Added dark mode across dashboard", time: "2d ago", kind: "feat" },
  { version: "v2.3.2", note: "Fixed session expiry on refresh", time: "5d ago", kind: "fix" },
  { version: "v2.3.1", note: "Improved API rate limiting", time: "1w ago", kind: "chore" },
] as const;

const KIND_STYLES: Record<string, string> = {
  feat: "bg-[#1FAA59]",
  fix: "bg-[#D97706]",
  chore: "bg-[#6B7280]",
};

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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back");
      reset();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-[#FAFAF9]">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* BRAND / CHANGELOG PANEL */}
      <div className="relative hidden md:flex flex-col justify-between bg-[#0B0E14] text-[#FAFAF9] px-12 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#FAFAF9 1px, transparent 1px), linear-gradient(90deg, #FAFAF9 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-sm tracking-wide text-[#9CA3AF]">
            <GitBranch className="h-4 w-4 text-[#1FAA59]" />
            releaseboard
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1FAA59] opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1FAA59]" />
            </span>
            <span className="font-mono text-[11px] text-[#9CA3AF]">
              All systems operational
            </span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight max-w-sm">
            Ship changes people actually see.
          </h1>
          <p className="text-sm text-[#9CA3AF] max-w-sm">
            Every release, tracked and announced in one place — no more
            digging through commit history.
          </p>
        </div>

        <div className="relative space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7280]">
            Recent activity
          </p>
          <ul className="space-y-2.5">
            {RECENT_RELEASES.map((r, i) => (
              <li
                key={r.version}
                style={{ animationDelay: `${i * 90}ms` }}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${KIND_STYLES[r.kind]}`} />
                <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[#E5E4DF]">
                  {r.version}
                </span>
                <span className="flex-1 truncate text-xs text-[#9CA3AF]">
                  {r.note}
                </span>
                <span className="shrink-0 text-[11px] text-[#6B7280]">
                  {r.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden flex items-center gap-2 font-mono text-sm text-[#6B7280]">
            <GitBranch className="h-4 w-4 text-[#1FAA59]" />
            releaseboard
          </div>

          <div className="rounded-2xl border border-[#E5E4DF] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-semibold tracking-tight text-[#14171F]">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Sign in to keep shipping.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {/* EMAIL */}
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

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-medium text-[#374151]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#6B7280] hover:text-[#14171F] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 border-[#E5E4DF] bg-white pr-10 text-[#14171F] placeholder:text-[#9CA3AF] transition-colors focus-visible:ring-2 focus-visible:ring-[#1FAA59]/40 focus-visible:border-[#1FAA59]"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* LOGIN BUTTON */}
              <Button
                className="h-11 w-full bg-[#0B0E14] font-medium text-[#FAFAF9] transition-transform hover:bg-[#0B0E14]/90 active:scale-[0.99]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#E5E4DF]" />
                <span className="text-xs text-[#9CA3AF]">or continue with</span>
                <div className="h-px flex-1 bg-[#E5E4DF]" />
              </div>

              {/* GITHUB */}
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-2 border-[#E5E4DF] font-medium text-[#14171F] transition-transform hover:!bg-transparent hover:!text-[#14171F] hover:!border-[#E5E4DF] active:scale-[0.99]"
                onClick={handleGithubLogin}
                disabled={githubLoading}
              >
                {githubLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaGithub />}
                GitHub
              </Button>
            </form>
          </div>

          {/* REGISTER */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#14171F] underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}