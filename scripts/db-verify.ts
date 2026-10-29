import { config } from "dotenv";
config({ path: ".env.local" });

import { getActiveProducts, getFeaturedCombo } from "../src/lib/content";

const products = await getActiveProducts();
const combo = await getFeaturedCombo();

console.log(
  JSON.stringify(
    {
      productCount: products.length,
      firstProduct: products[0]?.name,
      comboTitle: combo.title,
      comboPrice: combo.price,
      fromDb: Boolean(products[0]?.id),
    },
    null,
    2,
  ),
);

if (products.length < 1 || !combo.title) {
  process.exit(1);
}
