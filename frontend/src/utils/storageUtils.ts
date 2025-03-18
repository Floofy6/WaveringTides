/**
 * Storage utilities for safely handling localStorage operations
 */

// Maximum size for localStorage items (5MB is a safe limit for most browsers)
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Safely save data to localStorage with size checking
 * @param key The localStorage key
 * @param data The data to save
 * @returns true if save was successful, false otherwise
 */
export const safeSetItem = (key: string, data: any): boolean => {
  try {
    // Convert data to JSON string
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Check size
    if (jsonString.length > MAX_STORAGE_SIZE) {
      console.warn(`Data for key "${key}" exceeds size limit:`, 
                  (jsonString.length / 1024 / 1024).toFixed(2) + 'MB');
      return false;
    }
    
    // Save to localStorage
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely get data from localStorage
 * @param key The localStorage key
 * @param defaultValue Default value to return if item not found or parsing fails
 * @returns The parsed data or defaultValue
 */
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving data for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely remove data from localStorage
 * @param key The localStorage key
 * @returns true if removal was successful, false otherwise
 */
export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Check if browser storage is available
 * @returns true if localStorage is available, false otherwise
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return result;
  } catch (error) {
    return false;
  }
};

/**
 * Estimate storage usage
 * @returns Object with usage information
 */
export const getStorageUsage = (): { used: number, available: number, usedPercent: number } => {
  try {
    let totalSize = 0;
    
    // Loop through all localStorage items to calculate total size
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to MB for readability
    const used = totalSize / (1024 * 1024);
    const available = MAX_STORAGE_SIZE / (1024 * 1024);
    const usedPercent = (totalSize / MAX_STORAGE_SIZE) * 100;
    
    return { used, available, usedPercent };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, available: MAX_STORAGE_SIZE / (1024 * 1024), usedPercent: 0 };
  }
};

/**
 * Clean up old or non-critical data to free up space
 * @param criticalKeys Array of keys that should not be removed
 * @returns true if cleanup was successful, false otherwise
 */
export const cleanupStorage = (criticalKeys: string[] = []): boolean => {
  try {
    // For now, just remove any keys not in the criticalKeys list
    const keysToKeep = new Set(criticalKeys);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.has(key)) {
        // Only remove keys that aren't in our critical list
        localStorage.removeItem(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    return false;
  }
}; 