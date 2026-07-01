import { cn } from "@/lib/validations/utils";
import React from "react";

type CardSoftProps = React.HTMLAttributes<HTMLDivElement>;

export function CardSoft({
  className,
  ...props
}: CardSoftProps) {
  return (
    <div
      className={cn(
        // 🌟 Linear / Stripe style card
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
      {...props}
    />
  );
}