import { CacheEntry } from '../types';

export class InMemoryCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtl: number;
  private maxEntries: number;

  constructor(defaultTtl: number = 3600000, maxEntries: number = 1000) {
    this.defaultTtl = defaultTtl;
    this.maxEntries = maxEntries;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      console.log(`[CACHE] MISS: ${key}`);
      return null;
    }
    if (Date.now() - entry.timestamp > this.defaultTtl) {
      this.store.delete(key);
      console.log(`[CACHE] EXPIRED: ${key}`);
      return null;
    }
    console.log(`[CACHE] HIT: ${key}`);
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, { data, timestamp: Date.now() });
    console.log(`[CACHE] SET: ${key}`);
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > this.defaultTtl) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new InMemoryCache();