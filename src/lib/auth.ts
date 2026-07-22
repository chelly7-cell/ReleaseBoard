import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev", // sandbox sender, no domain setup needed
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Someone requested a password reset for your releaseboard account.</p>
          <p><a href="${url}">Click here to reset your password</a></p>
          <p>If this wasn't you, you can ignore this email.</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error("Failed to send reset email");
      }
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
});