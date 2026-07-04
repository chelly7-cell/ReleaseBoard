import type { Metadata } from "next";
import "./globals.css";

import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "My App",
  description: "Settings + Auth App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}