import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,

} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  password: text("password").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  // Logo URL
  logo: text("logo"),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  // Total views for the application
  views: integer("views").default(0),

  // Cached update count
  updatesCount: integer("updates_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const updates = pgTable("updates", {
  id: serial("id").primaryKey(),

  applicationId: integer("application_id")
    .references(() => applications.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description").notNull(),

  version: varchar("version", { length: 50 }).notNull(),

  type: varchar("type", { length: 50 }).notNull(),

  status: varchar("status", { length: 20 }).default("published").notNull(),

  views: integer("views").default(0),

  publishDate: timestamp("publish_date").defaultNow(),

  createdAt: timestamp("created_at").defaultNow(),
});
