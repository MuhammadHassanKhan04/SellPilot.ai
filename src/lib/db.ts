import path from 'path';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initTables(_db);
  }
  return _db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Product (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      tags TEXT NOT NULL DEFAULT '[]',
      category TEXT,
      images TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft',
      etsyListingId TEXT,
      amazonListingId TEXT,
      rawInput TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Integration (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL UNIQUE,
      accessToken TEXT,
      refreshToken TEXT,
      tokenExpiry TEXT,
      shopId TEXT,
      sellerId TEXT,
      isConnected INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function cuid(): string {
  // simple cuid-like unique id
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  tags: string;          // JSON string
  category: string | null;
  images: string;        // JSON string
  status: string;
  etsyListingId: string | null;
  amazonListingId: string | null;
  rawInput: string | null;
  createdAt: string;
  updatedAt: string;
}

export const productDb = {
  findAll(): Product[] {
    return getDb().prepare('SELECT * FROM Product ORDER BY createdAt DESC').all() as Product[];
  },
  findById(id: string): Product | null {
    return (getDb().prepare('SELECT * FROM Product WHERE id = ?').get(id) as Product) ?? null;
  },
  findByStatus(status: string): Product[] {
    return getDb().prepare('SELECT * FROM Product WHERE status = ? ORDER BY createdAt DESC').all(status) as Product[];
  },
  count(): number {
    return (getDb().prepare('SELECT COUNT(*) as n FROM Product').get() as { n: number }).n;
  },
  countByStatus(status: string): number {
    return (getDb().prepare('SELECT COUNT(*) as n FROM Product WHERE status = ?').get(status) as { n: number }).n;
  },
  findRecent(limit = 6): Product[] {
    return getDb().prepare('SELECT * FROM Product ORDER BY createdAt DESC LIMIT ?').all(limit) as Product[];
  },
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const id = cuid();
    const now = new Date().toISOString();
    getDb().prepare(`
      INSERT INTO Product (id, title, description, price, quantity, tags, category, images, status, etsyListingId, amazonListingId, rawInput, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.description, data.price, data.quantity, data.tags, data.category ?? null, data.images, data.status, data.etsyListingId ?? null, data.amazonListingId ?? null, data.rawInput ?? null, now, now);
    return this.findById(id)!;
  },
  update(id: string, data: Partial<Product>): Product | null {
    const now = new Date().toISOString();
    const allowed = ['title', 'description', 'price', 'quantity', 'tags', 'category', 'images', 'status', 'etsyListingId', 'amazonListingId', 'rawInput'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (fields.length === 0) return this.findById(id);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => (data as Record<string, unknown>)[f]);
    getDb().prepare(`UPDATE Product SET ${setClause}, updatedAt = ? WHERE id = ?`).run(...values, now, id);
    return this.findById(id);
  },
  delete(id: string): void {
    getDb().prepare('DELETE FROM Product WHERE id = ?').run(id);
  },
};

// ── Integration ───────────────────────────────────────────────────────────────

export interface Integration {
  id: string;
  platform: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: string | null;
  shopId: string | null;
  sellerId: string | null;
  isConnected: number; // 0 or 1 (SQLite boolean)
  createdAt: string;
  updatedAt: string;
}

export const integrationDb = {
  findAll(): Integration[] {
    return getDb().prepare('SELECT * FROM Integration').all() as Integration[];
  },
  findByPlatform(platform: string): Integration | null {
    return (getDb().prepare('SELECT * FROM Integration WHERE platform = ?').get(platform) as Integration) ?? null;
  },
  upsert(platform: string, data: Partial<Integration>): Integration {
    const now = new Date().toISOString();
    const existing = this.findByPlatform(platform);
    if (existing) {
      const allowed = ['accessToken', 'refreshToken', 'tokenExpiry', 'shopId', 'sellerId', 'isConnected'];
      const fields = Object.keys(data).filter(k => allowed.includes(k));
      const setClause = fields.map(f => `${f} = ?`).join(', ');
      const values = fields.map(f => (data as Record<string, unknown>)[f]);
      getDb().prepare(`UPDATE Integration SET ${setClause}, updatedAt = ? WHERE platform = ?`).run(...values, now, platform);
    } else {
      const id = cuid();
      getDb().prepare(`
        INSERT INTO Integration (id, platform, accessToken, refreshToken, tokenExpiry, shopId, sellerId, isConnected, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, platform, data.accessToken ?? null, data.refreshToken ?? null, data.tokenExpiry ?? null, data.shopId ?? null, data.sellerId ?? null, data.isConnected ?? 0, now, now);
    }
    return this.findByPlatform(platform)!;
  },
  disconnect(platform: string): void {
    getDb().prepare(`UPDATE Integration SET isConnected = 0, accessToken = NULL, refreshToken = NULL, updatedAt = ? WHERE platform = ?`).run(new Date().toISOString(), platform);
  },
};

// ── User ───────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export const userDb = {
  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'sellpilot-secure-salt-2026').digest('hex');
  },
  findByEmail(email: string): User | null {
    const row = getDb().prepare('SELECT * FROM User WHERE email = ?').get(email.toLowerCase().trim()) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password, // map sqlite column 'password' to 'passwordHash'
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },
  findById(id: string): User | null {
    const row = getDb().prepare('SELECT * FROM User WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },
  create(data: { name?: string; email: string; passwordRaw: string }): User {
    const id = cuid();
    const now = new Date().toISOString();
    const hash = this.hashPassword(data.passwordRaw);
    getDb().prepare(`
      INSERT INTO User (id, name, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.name ?? null, data.email.toLowerCase().trim(), hash, now, now);
    return this.findById(id)!;
  },
};

