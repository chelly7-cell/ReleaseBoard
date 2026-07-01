import { z } from "zod";

const positiveIntString = z
  .string()
  .regex(/^\d+$/)
  .transform((value) => Number(value))
  .pipe(z.number().int().positive());

export const paginationSchema = z.object({
  page: positiveIntString.optional().default(1),
  pageSize: positiveIntString.optional().default(20),
});

export function parsePagination(searchParams: URLSearchParams) {
  const parsed = paginationSchema.parse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  const pageSize = Math.min(parsed.pageSize, 50);

  return {
    page: parsed.page,
    pageSize,
    offset: (parsed.page - 1) * pageSize,
  };
}

export const applicationCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  logo: z.string().url().optional().nullable(),
});

export const updateStatusSchema = z.enum(["draft", "published"]);
export const updateTypeSchema = z.enum(["fix", "feature", "improvement"]);

export const updateCreateSchema = z.object({
  applicationId: z.number().int().positive(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(20000),
  version: z.string().trim().min(1).max(50),
  type: updateTypeSchema,
  status: updateStatusSchema.default("published"),
  publishDate: z
    .string()
    .datetime()
    .optional()
    .transform((value) => (value ? new Date(value) : new Date())),
});

export function parseNumericId(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
