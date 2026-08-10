import "server-only";

import { createHash, createHmac, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredFeedback = {
  id: string;
  scope: string;
  parentId: string | null;
  author: string;
  content: string;
  createdAt: string;
  likedBy: string[];
  visitorId?: string;
};

export type PublicFeedback = Omit<StoredFeedback, "likedBy"> & {
  likeCount: number;
  liked: boolean;
  mine: boolean;
};

type FeedbackDatabase = {
  version: 1;
  entries: StoredFeedback[];
  productLikes?: Record<string, string[]>;
};

export type ProductStats = {
  likeCount: number;
  commentCount: number;
  liked: boolean;
};

// 优先使用腾讯云 COS 对象存储；未配置 COS 环境变量时回退到本地文件（仅适用于本地开发）
const COS_OBJECT_KEY = "appbox-feedback.json";
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "appbox-feedback.json");
let writeQueue: Promise<void> = Promise.resolve();

type CosConfig = {
  SecretId: string;
  SecretKey: string;
  Bucket: string;
  Region: string;
};

function getCosConfig(): CosConfig | null {
  const SecretId = process.env.COS_SECRET_ID;
  const SecretKey = process.env.COS_SECRET_KEY;
  const Bucket = process.env.COS_BUCKET;
  const Region = process.env.COS_REGION;
  if (!SecretId || !SecretKey || !Bucket || !Region) return null;
  return { SecretId, SecretKey, Bucket, Region };
}

// 不依赖 SDK，直接用 Node 内置 crypto + fetch 调用 COS REST API，避免线上环境安装/加载外部包失败
function cosAuthorization(config: CosConfig, method: string, pathName: string, host: string) {
  const now = Math.floor(Date.now() / 1000);
  const keyTime = `${now - 60};${now + 600}`;
  const signKey = createHmac("sha1", config.SecretKey).update(keyTime).digest("hex");
  const httpString = `${method.toLowerCase()}\n${pathName}\n\nhost=${host}\n`;
  const stringToSign = `sha1\n${keyTime}\n${createHash("sha1").update(httpString).digest("hex")}\n`;
  const signature = createHmac("sha1", signKey).update(stringToSign).digest("hex");
  return `q-sign-algorithm=sha1&q-ak=${config.SecretId}&q-sign-time=${keyTime}&q-key-time=${keyTime}&q-header-list=host&q-url-param-list=&q-signature=${signature}`;
}

async function cosFetch(config: CosConfig, method: "GET" | "PUT", body?: string) {
  const host = `${config.Bucket}.cos.${config.Region}.myqcloud.com`;
  const pathName = `/${COS_OBJECT_KEY}`;
  return fetch(`https://${host}${pathName}`, {
    method,
    headers: {
      Host: host,
      Authorization: cosAuthorization(config, method, pathName, host),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body,
  });
}

function emptyDatabase(): FeedbackDatabase {
  return { version: 1, entries: [], productLikes: {} };
}

function normalizeDatabase(parsed: FeedbackDatabase): FeedbackDatabase {
  if (!Array.isArray(parsed.entries)) throw new Error("Invalid feedback database");
  if (!parsed.productLikes || typeof parsed.productLikes !== "object") parsed.productLikes = {};
  return parsed;
}

async function readFromCos(config: CosConfig): Promise<FeedbackDatabase> {
  try {
    const response = await cosFetch(config, "GET");
    if (response.status === 404) return emptyDatabase();
    if (!response.ok) throw new Error(`COS 响应 ${response.status}`);
    return normalizeDatabase(JSON.parse(await response.text()) as FeedbackDatabase);
  } catch (error) {
    console.error("[feedback-store] 读取 COS 数据失败", error);
    throw new Error("留言数据读取失败，请稍后再试");
  }
}

async function writeToCos(config: CosConfig, database: FeedbackDatabase) {
  try {
    const response = await cosFetch(config, "PUT", JSON.stringify(database, null, 2));
    if (!response.ok) throw new Error(`COS 响应 ${response.status}`);
  } catch (error) {
    console.error("[feedback-store] 写入 COS 数据失败", error);
    throw new Error("留言数据保存失败，请稍后再试");
  }
}

async function readDatabase(): Promise<FeedbackDatabase> {
  const cosConfig = getCosConfig();
  if (cosConfig) return readFromCos(cosConfig);

  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return normalizeDatabase(JSON.parse(raw) as FeedbackDatabase);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyDatabase();
    throw error;
  }
}

async function writeDatabase(database: FeedbackDatabase) {
  const cosConfig = getCosConfig();
  if (cosConfig) {
    await writeToCos(cosConfig, database);
    return;
  }

  await mkdir(DATA_DIR, { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(database, null, 2), "utf8");
  await rename(temporaryFile, DATA_FILE);
}

function mutate<T>(operation: (database: FeedbackDatabase) => Promise<T> | T): Promise<T> {
  const pending = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await operation(database);
    await writeDatabase(database);
    return result;
  });
  writeQueue = pending.then(() => undefined, () => undefined);
  return pending;
}

function toPublic(entry: StoredFeedback, visitorId?: string): PublicFeedback {
  const { likedBy, ...feedback } = entry;
  return {
    ...feedback,
    likeCount: likedBy.length,
    liked: Boolean(visitorId && likedBy.includes(visitorId)),
    mine: Boolean(visitorId && entry.visitorId && entry.visitorId === visitorId),
  };
}

export async function listFeedback(scope: string, visitorId?: string) {
  const database = await readDatabase();
  return database.entries
    .filter((entry) => entry.scope === scope)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((entry) => toPublic(entry, visitorId));
}

export async function createFeedback(input: {
  scope: string;
  parentId?: string | null;
  author: string;
  content: string;
  visitorId?: string;
}) {
  return mutate(async (database) => {
    let parentId = input.parentId ?? null;
    if (parentId) {
      const parent = database.entries.find((entry) => entry.id === parentId && entry.scope === input.scope);
      if (!parent) throw new Error("留言不存在或已经被移除");
      parentId = parent.parentId ?? parent.id;
    }

    const entry: StoredFeedback = {
      id: randomUUID(),
      scope: input.scope,
      parentId,
      author: input.author,
      content: input.content,
      createdAt: new Date().toISOString(),
      likedBy: [],
      visitorId: input.visitorId,
    };
    database.entries.push(entry);
    return toPublic(entry, input.visitorId);
  });
}

export async function deleteFeedback(input: {
  scope: string;
  id: string;
  visitorId: string;
}) {
  return mutate(async (database) => {
    const entry = database.entries.find((item) => item.id === input.id && item.scope === input.scope);
    if (!entry) throw new Error("留言不存在或已经被移除");
    if (entry.visitorId !== input.visitorId) throw new Error("只能撤回自己的留言");
    database.entries = database.entries.filter((item) => item.id !== input.id && item.parentId !== input.id);
    return { ok: true };
  });
}

export async function toggleFeedbackLike(input: {
  scope: string;
  id: string;
  visitorId: string;
}) {
  return mutate(async (database) => {
    const entry = database.entries.find((item) => item.id === input.id && item.scope === input.scope);
    if (!entry) throw new Error("留言不存在或已经被移除");
    const index = entry.likedBy.indexOf(input.visitorId);
    if (index >= 0) entry.likedBy.splice(index, 1);
    else entry.likedBy.push(input.visitorId);
    return toPublic(entry, input.visitorId);
  });
}

export async function listProductStats(productIds: string[], visitorId?: string) {
  const database = await readDatabase();
  const likes = database.productLikes ?? {};
  return productIds.reduce<Record<string, ProductStats>>((result, productId) => {
    const likedBy = likes[productId] ?? [];
    result[productId] = {
      likeCount: likedBy.length,
      commentCount: database.entries.filter((entry) => entry.scope === `product:${productId}`).length,
      liked: Boolean(visitorId && likedBy.includes(visitorId)),
    };
    return result;
  }, {});
}

export async function toggleProductLike(input: {
  productId: string;
  visitorId: string;
}) {
  return mutate(async (database) => {
    const likes = (database.productLikes ||= {});
    const likedBy = (likes[input.productId] ||= []);
    const index = likedBy.indexOf(input.visitorId);
    if (index >= 0) likedBy.splice(index, 1);
    else likedBy.push(input.visitorId);

    return {
      likeCount: likedBy.length,
      commentCount: database.entries.filter((entry) => entry.scope === `product:${input.productId}`).length,
      liked: likedBy.includes(input.visitorId),
    } satisfies ProductStats;
  });
}
