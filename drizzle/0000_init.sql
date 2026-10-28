CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(160) NOT NULL,
  "slug" varchar(180) NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "price" varchar(40) NOT NULL,
  "image_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "products_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "featured_combo" (
  "id" serial PRIMARY KEY NOT NULL,
  "eyebrow" varchar(120) DEFAULT 'This week''s combo' NOT NULL,
  "headline" text DEFAULT 'Two treats.
One perfect tin.' NOT NULL,
  "title" varchar(200) NOT NULL,
  "price" varchar(40) NOT NULL,
  "note" text DEFAULT '' NOT NULL,
  "image_url" text,
  "whatsapp_text" text DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
