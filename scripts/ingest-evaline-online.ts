/**
 * TASK-350: Ingest the company site repo /home/evabot/evaline-online into Eva's Brain.
 *
 * Rebuilds/updates the SQLite FTS index (knowledge-base/evaline-knowledge-base/fts_index.db)
 * and the in-memory document store from that repo (trilingual docs/, KANBAN*.md,
 * MANIFESTO.md, README.md, evabot_*.md, manifesto.txt).
 *
 * Idempotent: dedupes by source file_path (chunks already indexed are skipped;
 * memory docs are deduped by id). Re-runs are safe.
 *
 * Usage: npx tsx scripts/ingest-evaline-online.ts
 */
import { DatabaseSync } from 'node:sqlite';
import { knowledgeBase } from '../src/core/KnowledgeBase.js';

const FTS_DB = '/var/www/evabot-backend/knowledge-base/evaline-knowledge-base/fts_index.db';
const REPO_PREFIX = 'evaline-online/';

interface Counts {
  totalChunks: number;
  repoChunks: number;
}

function readCounts(): Counts {
  const db = new DatabaseSync(FTS_DB, { readOnly: true });
  try {
    const total = db.prepare('SELECT count(*) as count FROM chunks_fts').get() as { count: number };
    const repo = db
      .prepare("SELECT count(*) as count FROM chunks_fts WHERE file_path LIKE ?")
      .get(`${REPO_PREFIX}%`) as { count: number };
    return { totalChunks: Number(total.count), repoChunks: Number(repo.count) };
  } finally {
    db.close();
  }
}

async function main(): Promise<void> {
  const before = readCounts();
  console.log('=== BEFORE INGEST ===');
  console.log(`FTS total chunks:        ${before.totalChunks}`);
  console.log(`FTS evaline-online chunks: ${before.repoChunks}`);

  await knowledgeBase.initialize();

  const after = readCounts();
  const docs = knowledgeBase.listDocuments();
  const repoDocs = docs.filter((d) => d.source.startsWith(REPO_PREFIX));

  const byLang = new Map<string, number>();
  const byCat = new Map<string, number>();
  for (const d of repoDocs) {
    byLang.set(d.language, (byLang.get(d.language) || 0) + 1);
    byCat.set(d.category, (byCat.get(d.category) || 0) + 1);
  }

  console.log('\n=== AFTER INGEST ===');
  console.log(`FTS total chunks:        ${after.totalChunks}`);
  console.log(`FTS evaline-online chunks: ${after.repoChunks}`);
  console.log(`Memory docs total:       ${docs.length}`);
  console.log(`evaline-online docs:     ${repoDocs.length}`);
  console.log(`  by language: ${[...byLang.entries()].sort().map(([l, c]) => `${l}=${c}`).join(', ')}`);
  console.log(`  by category: ${[...byCat.entries()].sort().map(([c, n]) => `${c}=${n}`).join(', ')}`);

  console.log('\n=== SEARCH VERIFICATION ===');
  const queries = ['EvaLine производство', 'audit', 'user guide'];
  for (const q of queries) {
    const results = knowledgeBase.search(q, { limit: 3 });
    console.log(`\nQuery: "${q}" -> ${results.length} result(s)`);
    for (const r of results) {
      const preview = r.content.replace(/\s+/g, ' ').substring(0, 140);
      console.log(`  [${(r.relevanceScore ?? 0).toFixed(2)}] ${r.title} (${r.category}, ${r.language})`);
      console.log(`        src: ${r.source}`);
      console.log(`        ${preview}${preview.length >= 140 ? '...' : ''}`);
    }
  }

  const stats = knowledgeBase.getStats();
  console.log('\n=== KB STATS ===');
  console.log(`Backend: ${stats.name} | documentCount: ${stats.documentCount}`);
  console.log('Done. Ingest is idempotent — safe to re-run.');
}

main().catch((err) => {
  console.error('Ingest failed:', err);
  process.exit(1);
});
