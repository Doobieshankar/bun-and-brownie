import { execSync } from "node:child_process";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

function resolveNeonIp(hostname: string): string | null {
  try {
    const lines = execSync(`dig +short A @8.8.8.8 ${hostname}`, {
      encoding: "utf8",
    })
      .trim()
      .split("\n");
    const ip = lines.find((line) => /^\d+\.\d+\.\d+\.\d+$/.test(line));
    if (ip) return ip;
  } catch {
    // fall through
  }

  try {
    return (
      execSync(
        "dig +short A @8.8.8.8 c-3.ap-southeast-1.aws.neon.tech | head -1",
        { encoding: "utf8" },
      ).trim() || null
    );
  } catch {
    return null;
  }
}

function buildPoolConfig(connectionString: string) {
  const normalized = connectionString.includes("uselibpqcompat=")
    ? connectionString
    : `${connectionString}${connectionString.includes("?") ? "&" : "?"}uselibpqcompat=true`;

  const parsed = new URL(normalized.replace(/^postgresql:/, "http:"));
  const hostname = parsed.hostname;
  const needsDnsWorkaround = hostname.includes("neon.tech");
  const ip = needsDnsWorkaround ? resolveNeonIp(hostname) : null;

  if (ip) {
    return {
      host: ip,
      port: Number(parsed.port || 5432),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, "") || "neondb",
      max: 5,
      ssl: {
        rejectUnauthorized: false,
        servername: hostname,
      },
    };
  }

  return {
    connectionString: normalized,
    max: 5,
    ssl: { rejectUnauthorized: false },
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __bbPgPool: Pool | undefined;
}

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalThis.__bbPgPool) {
    globalThis.__bbPgPool = new Pool(buildPoolConfig(url));
  }
  return globalThis.__bbPgPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export type Db = ReturnType<typeof getDb>;
