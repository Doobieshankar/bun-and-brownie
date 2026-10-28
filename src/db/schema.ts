import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description").notNull().default(""),
  price: varchar("price", { length: 40 }).notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const featuredCombo = pgTable("featured_combo", {
  id: serial("id").primaryKey(),
  eyebrow: varchar("eyebrow", { length: 120 }).notNull().default("This week's combo"),
  headline: text("headline").notNull().default("Two treats.\nOne perfect tin."),
  title: varchar("title", { length: 200 }).notNull(),
  price: varchar("price", { length: 40 }).notNull(),
  note: text("note").notNull().default(""),
  imageUrl: text("image_url"),
  whatsappText: text("whatsapp_text").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type FeaturedCombo = typeof featuredCombo.$inferSelect;
export type NewFeaturedCombo = typeof featuredCombo.$inferInsert;
