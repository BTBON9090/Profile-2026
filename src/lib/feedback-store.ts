import "server-only";

import { randomUUID } from "node:crypto";
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

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "appbox-feedback.json");
let writeQueue: Promise<void> = Promise.resolve();

async function readDatabase(): Promise<FeedbackDatabase> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as FeedbackDatabase;
    if (!Array.isArray(parsed.entries)) throw new Error("Invalid feedback database");
    if (!parsed.productLikes || typeof parsed.productLikes !== "object") parsed.productLikes = {};
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { version: 1, entries: [], productLikes: {} };
    }
    throw error;
  }
}

async function writeDatabase(database: FeedbackDatabase) {
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
