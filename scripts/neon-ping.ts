import { execSync } from "child_process";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const url = new URL(
  (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "").replace(
    /^postgresql:/,
    "http:",
  ),
);

const hostName = url.hostname;
const password = decodeURIComponent(url.password);
const user = decodeURIComponent(url.username);
const database = url.pathname.replace(/^\//, "") || "neondb";

const ip = execSync(
  "dig +short A @8.8.8.8 c-3.ap-southeast-1.aws.neon.tech | head -1",
)
  .toString()
  .trim();

if (!ip) throw new Error("Could not resolve Neon IP via 8.8.8.8");

console.log({ hostName, user, database, ip });

const client = new pg.Client({
  host: ip,
  port: 5432,
  user,
  password,
  database,
  ssl: {
    rejectUnauthorized: false,
    servername: hostName,
  },
  connectionTimeoutMillis: 20000,
});

await client.connect();
const result = await client.query(
  "select current_user as u, current_database() as db, now() as now",
);
console.log("SUCCESS", result.rows[0]);
await client.end();
