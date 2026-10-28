import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { featuredCombo, products } from "../src/db/schema";
import { fallbackCombo, fallbackMenu } from "../src/lib/content";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to seed");
  }

  const db = drizzle(neon(url));

  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length === 0) {
    await db.insert(products).values(
      fallbackMenu.map((item, index) => ({
        name: item.name,
        slug: item.slug!,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        sortOrder: index,
        isActive: true,
      })),
    );
    console.log(`Seeded ${fallbackMenu.length} products`);
  } else {
    console.log("Products already present, skipping product seed");
  }

  const existingCombo = await db.select().from(featuredCombo).limit(1);
  if (existingCombo.length === 0) {
    await db.insert(featuredCombo).values({
      eyebrow: fallbackCombo.eyebrow,
      headline: fallbackCombo.headline,
      title: fallbackCombo.title,
      price: fallbackCombo.price,
      note: fallbackCombo.note,
      imageUrl: fallbackCombo.imageUrl,
      whatsappText: fallbackCombo.whatsappText,
    });
    console.log("Seeded featured combo");
  } else {
    console.log("Featured combo already present, skipping combo seed");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
