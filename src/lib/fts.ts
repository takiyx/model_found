import { prisma } from "@/lib/db";

// Best-effort, idempotent setup for SQLite FTS5.
// This runs fast when already installed.
export async function ensurePostFts() {
  // Create virtual table
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE IF NOT EXISTS PostFts
    USING fts5(
      postId UNINDEXED,
      title,
      body,
      tags,
      place,
      reward,
      tokenize = 'unicode61 remove_diacritics 2'
    );
  `);

  // Backfill missing rows
  await prisma.$executeRawUnsafe(`
    INSERT INTO PostFts(postId, title, body, tags, place, reward)
    SELECT p.id, p.title, p.body, p.tags, p.place, p.reward
    FROM Post p
    WHERE p.id NOT IN (SELECT postId FROM PostFts);
  `);

  // Triggers to keep in sync
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER IF NOT EXISTS post_fts_ai AFTER INSERT ON Post BEGIN
      INSERT INTO PostFts(postId, title, body, tags, place, reward)
      VALUES (new.id, new.title, new.body, new.tags, new.place, new.reward);
    END;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER IF NOT EXISTS post_fts_ad AFTER DELETE ON Post BEGIN
      DELETE FROM PostFts WHERE postId = old.id;
    END;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER IF NOT EXISTS post_fts_au AFTER UPDATE ON Post BEGIN
      DELETE FROM PostFts WHERE postId = old.id;
      INSERT INTO PostFts(postId, title, body, tags, place, reward)
      VALUES (new.id, new.title, new.body, new.tags, new.place, new.reward);
    END;
  `);
}

function sanitizeToken(t: string) {
  // Keep it simple: remove quotes and dangerous operators.
  return t.replace(/["'`]/g, "").replace(/[\^:\-\*\(\)\[\]\{\}]/g, " ").trim();
}

export function buildFtsQuery(input: string) {
  const tokens = input
    .split(/\s+/)
    .map((t) => sanitizeToken(t))
    .filter(Boolean)
    .slice(0, 8);

  // Prefix match each token.
  // Example: "shibuya portrait" => "shibuya* portrait*"
  return tokens.map((t) => `${t}*`).join(" ");
}

export async function searchPostIds(q: string, limit = 60) {
  await ensurePostFts();
  const match = buildFtsQuery(q);

  // bm25 lower is better
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT postId as id FROM PostFts WHERE PostFts MATCH ? ORDER BY bm25(PostFts) LIMIT ?`,
    match,
    limit
  )) as Array<{ id: string }>;

  return rows.map((r) => r.id);
}
