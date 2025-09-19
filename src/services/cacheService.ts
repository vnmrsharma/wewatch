// Cache service for storing API responses and reducing redundant calls
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  weatherTTL: number; // Time to live in milliseconds
  newsTTL: number;
  satelliteTTL: number;
  criticalIssuesTTL: number;
  environmentalDataTTL: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig = {
    weatherTTL: 10 * 60 * 1000, // 10 minutes
    newsTTL: 30 * 60 * 1000, // 30 minutes
    satelliteTTL: 60 * 60 * 1000, // 1 hour
    criticalIssuesTTL: 15 * 60 * 1000, // 15 minutes
    environmentalDataTTL: 5 * 60 * 1000, // 5 minutes
  };

  // Generate cache key based on location and data type
  private generateKey(type: string, location: { city: string; country: string }): string {
    return `${type}_${location.city}_${location.country}`.toLowerCase().replace(/\s+/g, '_');
  }

  // Check if cache entry is valid
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt;
  }

  // Get cached data
  get<T>(type: string, location: { city: string; country: string }): T | null {
    const key = this.generateKey(type, location);
    const entry = this.cache.get(key);
    
    if (!entry || !this.isValid(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`[CACHE] Hit for ${type} data (${location.city})`);
    return entry.data;
  }

  // Set cached data
  set<T>(type: string, location: { city: string; country: string }, data: T): void {
    const key = this.generateKey(type, location);
    const ttl = this.getTTL(type);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };
    
    this.cache.set(key, entry);
    console.log(`[CACHE] Stored ${type} data for ${location.city} (expires in ${Math.round(ttl / 60000)} minutes)`);
  }

  // Get TTL for different data types
  private getTTL(type: string): number {
    switch (type) {
      case 'weather': return this.config.weatherTTL;
      case 'news': return this.config.newsTTL;
      case 'satellite': return this.config.satelliteTTL;
      case 'criticalIssues': return this.config.criticalIssuesTTL;
      case 'environmental_data': return this.config.environmentalDataTTL;
      default: return 5 * 60 * 1000; // 5 minutes default
    }
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[CACHE] Cleaned up ${cleaned} expired entries`);
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    console.log('[CACHE] All cache cleared');
  }

  // Get cache statistics
  getStats(): { totalEntries: number; validEntries: number; expiredEntries: number } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    for (const entry of this.cache.values()) {
      if (now < entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }

  // Debug function to log cache status
  logCacheStatus(): void {
    const stats = this.getStats();
    console.log(`[CACHE] Status: ${stats.validEntries}/${stats.totalEntries} valid entries, ${stats.expiredEntries} expired`);
    
    if (stats.validEntries > 0) {
      console.log('[CACHE] Valid entries:');
      for (const [key, entry] of this.cache.entries()) {
        if (Date.now() < entry.expiresAt) {
          const age = Math.round((Date.now() - entry.timestamp) / 60000);
          const expiresIn = Math.round((entry.expiresAt - Date.now()) / 60000);
          console.log(`  - ${key}: age ${age}min, expires in ${expiresIn}min`);
        }
      }
    }
  }

  // Get cache info for debugging
  getDebugInfo(): Array<{ key: string; type: string; location: string; age: number; expiresIn: number }> {
    const now = Date.now();
    const info: Array<{ key: string; type: string; location: string; age: number; expiresIn: number }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      const [type, city, country] = key.split('_');
      info.push({
        key,
        type,
        location: `${city} ${country}`,
        age: Math.round((now - entry.timestamp) / 60000),
        expiresIn: Math.round((entry.expiresAt - now) / 60000)
      });
    }
    
    return info;
  }
}

export const cacheService = new CacheService();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);
