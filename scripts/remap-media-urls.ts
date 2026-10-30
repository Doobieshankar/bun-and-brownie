import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { featuredCombo, products } from "../src/db/schema";

const map = JSON.parse(
  readFileSync("scripts/media-url-map.json", "utf8"),
) as Record<string, string>;

async function main() {
  const db = getDb();
  const rows = await db.select().from(products);
  for (const row of rows) {
    if (!row.imageUrl || !map[row.imageUrl]) continue;
    const next = map[row.imageUrl];
    await db
      .update(products)
      .set({ imageUrl: next, updatedAt: new Date() })
      .where(eq(products.id, row.id));
    console.log(`product ${row.id}: ${row.imageUrl} -> ${next}`);
  }

  const combos = await db.select().from(featuredCombo).limit(1);
  if (combos[0]?.imageUrl && map[combos[0].imageUrl]) {
    const next = map[combos[0].imageUrl];
    await db
      .update(featuredCombo)
      .set({ imageUrl: next, updatedAt: new Date() })
      .where(eq(featuredCombo.id, combos[0].id));
    console.log(`combo: ${combos[0].imageUrl} -> ${next}`);
  }

  console.log("done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
