import { asc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { featuredCombo, products, type FeaturedCombo, type Product } from "@/db/schema";
import { site } from "@/lib/site";

export type MenuItem = {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  price: string;
  imageUrl: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type ComboContent = {
  id?: number;
  eyebrow: string;
  headline: string;
  title: string;
  price: string;
  note: string;
  imageUrl: string | null;
  whatsappText: string;
};

export const fallbackMenu: MenuItem[] = site.menu.map((item, index) => ({
  name: item.name,
  slug: slugify(item.name),
  description: item.line,
  price: item.price,
  imageUrl: null,
  sortOrder: index,
  isActive: true,
}));

export const fallbackCombo: ComboContent = {
  eyebrow: "This week's combo",
  headline: "Two treats.\nOne perfect tin.",
  title: site.combo.title,
  price: site.combo.price,
  note: site.combo.note,
  imageUrl: "/images/combo-tin.jpg",
  whatsappText: `Hi! I want the ${site.combo.title} combo for ${site.combo.price}.`,
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapProduct(row: Product): MenuItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  };
}

function mapCombo(row: FeaturedCombo): ComboContent {
  return {
    id: row.id,
    eyebrow: row.eyebrow,
    headline: row.headline,
    title: row.title,
    price: row.price,
    note: row.note,
    imageUrl: row.imageUrl,
    whatsappText: row.whatsappText,
  };
}

export async function getActiveProducts(): Promise<MenuItem[]> {
  if (!hasDatabase()) return fallbackMenu;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.sortOrder), asc(products.id));
    if (rows.length === 0) return fallbackMenu;
    return rows.map(mapProduct);
  } catch (error) {
    console.error("getActiveProducts failed", error);
    return fallbackMenu;
  }
}

export async function getAllProducts(): Promise<MenuItem[]> {
  if (!hasDatabase()) return fallbackMenu;
  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.id));
  return rows.map(mapProduct);
}

export async function getFeaturedCombo(): Promise<ComboContent> {
  if (!hasDatabase()) return fallbackCombo;
  try {
    const db = getDb();
    const rows = await db.select().from(featuredCombo).limit(1);
    if (!rows[0]) return fallbackCombo;
    return mapCombo(rows[0]);
  } catch (error) {
    console.error("getFeaturedCombo failed", error);
    return fallbackCombo;
  }
}
