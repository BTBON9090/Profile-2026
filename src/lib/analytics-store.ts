import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsEvent } from "./analytics";

type Counters = Record<string, number>;
type Database = Record<string, Counters>;
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "anonymous-analytics.json");
let queue: Promise<void> = Promise.resolve();

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisBatch(commands: (string | number)[][], transaction = false) {
  const config = redisConfig();
  if (!config) throw new Error("ANALYTICS_NOT_CONFIGURED");
  const response = await fetch(`${config.url}/${transaction ? "multi-exec" : "pipeline"}`, {
    method: "POST", headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands), cache: "no-store", signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("ANALYTICS_STORAGE_UNAVAILABLE");
  const results = await response.json() as { result?: unknown; error?: string }[];
  if (!Array.isArray(results) || results.some(item => item.error)) throw new Error("ANALYTICS_STORAGE_UNAVAILABLE");
  return results;
}

async function readLocal(): Promise<Database> {
  try { return JSON.parse(await readFile(dataFile, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return {}; throw error; }
}

// Only aggregate counts are retained. A day is the smallest stored time unit.
export async function recordAnalytics(event: AnalyticsEvent, target: string) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const field = `${event}:${target}`;
  if (redisConfig()) {
    await redisBatch([["HINCRBY", `portfolio:analytics:${day}`, field, 1], ["EXPIRE", `portfolio:analytics:${day}`, 400 * 86400]], true);
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("ANALYTICS_NOT_CONFIGURED");
  const pending = queue.then(async () => {
    const data = await readLocal();
    const counters = data[day] ||= {};
    counters[field] = (counters[field] || 0) + 1;
    await mkdir(dataDir, { recursive: true });
    const temporary = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(data, null, 2));
    await rename(temporary, dataFile);
  });
  queue = pending.catch(() => {});
  await pending;
}

export async function readAnalytics(days: string[]): Promise<Database> {
  if (!redisConfig()) {
    if (process.env.NODE_ENV === "production") throw new Error("ANALYTICS_NOT_CONFIGURED");
    const data = await readLocal();
    return Object.fromEntries(days.map(day => [day, data[day] || {}]));
  }
  const results = await redisBatch(days.map(day => ["HGETALL", `portfolio:analytics:${day}`]));
  return Object.fromEntries(results.map((item, i) => {
    const values = (item.result || []) as (string | number)[];
    const counters: Counters = {};
    for (let j = 0; j < values.length; j += 2) counters[String(values[j])] = Number(values[j + 1]);
    return [days[i], counters];
  }));
}
