// Client-side caching utilities
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static instance: CacheManager;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set(key: string, data: any, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Cache with automatic refresh
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.get(key);
    
    if (cached) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttlMinutes);
    return data;
  }
}

export const cache = CacheManager.getInstance();

// React hook for cached data
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMinutes: number = 5
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const result = await cache.getOrFetch(key, fetchFn, ttlMinutes);
        
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [key, ttlMinutes]);

  const invalidate = () => {
    cache.invalidate(key);
    setData(null);
    setLoading(true);
  };

  return { data, loading, error, invalidate };
}