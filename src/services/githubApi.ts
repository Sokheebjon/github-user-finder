import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types/github';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class GitHubApiService {
  private cache: Map<string, CacheEntry<any>> = new Map();

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();
      
      if (now - entry.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  async fetchUser(username: string): Promise<GitHubUser> {
    const cacheKey = this.getCacheKey(`user:${username}`);
    
    const cachedData = this.getFromCache<GitHubUser>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const localData = this.getFromLocalStorage<GitHubUser>(cacheKey);
    if (localData) {
      this.cache.set(cacheKey, { data: localData, timestamp: Date.now() });
      return localData;
    }

    const response = await axios.get<GitHubUser>(`${API_BASE_URL}/users/${username}`);
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  async fetchRepos(
    username: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<GitHubRepo[]> {
    const cacheKey = this.getCacheKey(`repos:${username}:${page}:${perPage}`);
    
    const cachedData = this.getFromCache<GitHubRepo[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const localData = this.getFromLocalStorage<GitHubRepo[]>(cacheKey);
    if (localData) {
      this.cache.set(cacheKey, { data: localData, timestamp: Date.now() });
      return localData;
    }

    const response = await axios.get<GitHubRepo[]>(
      `${API_BASE_URL}/users/${username}/repos`,
      {
        params: {
          page,
          per_page: perPage,
          sort: 'updated',
          direction: 'desc',
        },
      }
    );
    
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  clearCache(): void {
    this.cache.clear();
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('user:') || key.startsWith('repos:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

export const githubApi = new GitHubApiService();
