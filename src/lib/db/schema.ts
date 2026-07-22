import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    token: text("token").notNull().unique(),

    expiresAt: timestamp("expires_at").notNull(),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),

    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

    scope: text("scope"),
    password: text("password"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),
    value: text("value").notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull(),
    description: text("description"),
    website: text("website"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    logo: text("logo"),

    views: integer("views").default(0).notNull(),
    updatesCount: integer("updates_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("applications_user_id_idx").on(table.userId),
    index("applications_name_idx").on(table.name),
  ],
);

export const updates = pgTable(
  "updates",
  {
    id: serial("id").primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),

    version: varchar("version", { length: 50 }).notNull(),

    status: varchar("status", { length: 20 }).default("draft").notNull(),

    views: integer("views").default(0).notNull(),

    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, {
        onDelete: "cascade",
      }),

    // Description courte (Card)
    description: text("description").notNull(),

    // Contenu complet Tiptap
    content: jsonb("content"),

    type: varchar("type", { length: 50 }).notNull(),

    publishDate: timestamp("publish_date")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("updates_application_id_idx").on(table.applicationId),
    index("updates_status_idx").on(table.status),
    index("updates_publish_date_idx").on(table.publishDate),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  applications: many(applications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const applicationRelations = relations(
  applications,
  ({ one, many }) => ({
    user: one(user, {
      fields: [applications.userId],
      references: [user.id],
    }),
    updates: many(updates),
  }),
);

export const updateRelations = relations(updates, ({ one }) => ({
  application: one(applications, {
    fields: [updates.applicationId],
    references: [applications.id],
  }),
}));



export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: serial("id").primaryKey(),

    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, {
        onDelete: "cascade",
      }),

    updateId: integer("update_id")
      .references(() => updates.id, {
        onDelete: "cascade",
      }),

    type: varchar("type", {
      length: 50,
    }).notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("analytics_events_application_id_idx")
      .on(table.applicationId),

    index("analytics_events_update_id_idx")
      .on(table.updateId),

    index("analytics_events_created_at_idx")
      .on(table.createdAt),

    index("analytics_events_type_idx")
      .on(table.type),
  ],
);

export const analyticsEventRelations = relations(
  analyticsEvents,
  ({ one }) => ({
    application: one(applications, {
      fields: [analyticsEvents.applicationId],
      references: [applications.id],
    }),

    update: one(updates, {
      fields: [analyticsEvents.updateId],
      references: [updates.id],
    }),
  }),
);



export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type Update = typeof updates.$inferSelect;
export type NewUpdate = typeof updates.$inferInsert;
