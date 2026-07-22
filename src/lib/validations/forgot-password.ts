import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;