/**
 * Applies schema + seed using node-postgres.
 * Resolves Neon hosts via 8.8.8.8 because local DNS times out on this machine.
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { config } from "dotenv";
import pg from "pg";
import { fallbackCombo, fallbackMenu } from "../src/lib/content";

config({ path: ".env.local" });
config({ path: ".env" });

function resolveNeonIp() {
  const ip = execSync(
    "dig +short A @8.8.8.8 c-3.ap-southeast-1.aws.neon.tech | head -1",
  )
    .toString()
    .trim();
  if (!ip) throw new Error("Could not resolve Neon IP via 8.8.8.8");
  return ip;
}

function parseUrl(raw: string) {
  const url = new URL(raw.replace(/^postgresql:/, "http:"));
  return {
    hostName: url.hostname,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "neondb",
  };
}

async function main() {
  const raw =
    process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";
  if (!raw) throw new Error("DATABASE_URL is required");

  const { hostName, user, password, database } = parseUrl(raw);
  const ip = resolveNeonIp();
  console.log(`Connecting to ${hostName} via ${ip}`);

  const client = new pg.Client({
    host: ip,
    port: 5432,
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false, servername: hostName },
    connectionTimeoutMillis: 20000,
  });

  await client.connect();

  const sql = readFileSync(
    new URL("../drizzle/0000_init.sql", import.meta.url),
    "utf8",
  );
  await client.query(sql);
  console.log("Schema applied");

  const products = await client.query(`select count(*)::int as n from products`);
  if (products.rows[0].n === 0) {
    for (const [index, item] of fallbackMenu.entries()) {
      await client.query(
        `insert into products (name, slug, description, price, image_url, sort_order, is_active)
         values ($1, $2, $3, $4, $5, $6, true)`,
        [
          item.name,
          item.slug,
          item.description,
          item.price,
          item.imageUrl,
          index,
        ],
      );
    }
    console.log(`Seeded ${fallbackMenu.length} products`);
  } else {
    console.log(`Products already present (${products.rows[0].n})`);
  }

  const combo = await client.query(
    `select count(*)::int as n from featured_combo`,
  );
  if (combo.rows[0].n === 0) {
    await client.query(
      `insert into featured_combo
        (eyebrow, headline, title, price, note, image_url, whatsapp_text)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        fallbackCombo.eyebrow,
        fallbackCombo.headline,
        fallbackCombo.title,
        fallbackCombo.price,
        fallbackCombo.note,
        fallbackCombo.imageUrl,
        fallbackCombo.whatsappText,
      ],
    );
    console.log("Seeded featured combo");
  } else {
    console.log("Featured combo already present");
  }

  const check = await client.query(
    `select
      (select count(*)::int from products) as products,
      (select count(*)::int from featured_combo) as combo`,
  );
  console.log("VERIFY", check.rows[0]);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
