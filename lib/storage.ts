// Storage abstraction for local-first approach
// Can be extended later to support Supabase or other backends
import { ErrorLogger } from "@/lib/error/error-logger"

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly key?: string,
    public readonly cause?: Error,
  ) {
    super(message)
    this.name = "StorageError"
  }
}

// Helper to check if we're in a browser environment
const isBrowser = () => typeof window !== "undefined"

export class Storage {
  static get(key: string): any {
    if (!isBrowser()) {
      console.log(`Storage.get: Window not available for key ${key}`)
      return null
    }

    try {
      const item = localStorage.getItem(key)
      if (!item) {
        console.log(`Storage.get: No item found for key ${key}`)
        return null
      }

      const parsed = JSON.parse(item)
      console.log(`Storage.get: Successfully retrieved item for key ${key}`)
      return parsed
    } catch (error) {
      const storageError = new StorageError(
        `Failed to retrieve item from storage: ${key}`,
        key,
        error instanceof Error ? error : undefined,
      )

      ErrorLogger.logStorageError(`Failed to retrieve item: ${key}`, "get", storageError)

      return null
    }
  }

  static set(key: string, value: any): boolean {
    if (!isBrowser()) {
      console.log(`Storage.set: Window not available for key ${key}`)
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      console.log(`Storage.set: Successfully stored item for key ${key}`)
      return true
    } catch (error) {
      const storageError = new StorageError(
        `Failed to store item in storage: ${key}`,
        key,
        error instanceof Error ? error : undefined,
      )

      ErrorLogger.logStorageError(`Failed to store item: ${key}`, "set", storageError)

      // If it's a quota error, try to clear some space
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.log("Storage quota exceeded, attempting to clear space")
        this.clearOldItems()

        // Try again after clearing space
        try {
          const serialized = JSON.stringify(value)
          localStorage.setItem(key, serialized)
          console.log(`Storage.set: Successfully stored item for key ${key} after clearing space`)
          return true
        } catch (retryError) {
          ErrorLogger.logStorageError(
            `Failed to store item after clearing space: ${key}`,
            "set-retry",
            new StorageError(
              `Failed to store item after clearing space: ${key}`,
              key,
              retryError instanceof Error ? retryError : undefined,
            ),
          )
          return false
        }
      }

      return false
    }
  }

  static remove(key: string): boolean {
    if (!isBrowser()) return false

    try {
      localStorage.removeItem(key)
      console.log(`Storage.remove: Successfully removed item for key ${key}`)
      return true
    } catch (error) {
      ErrorLogger.logStorageError(
        `Failed to remove item: ${key}`,
        "remove",
        new StorageError(`Failed to remove item from storage: ${key}`, key, error instanceof Error ? error : undefined),
      )
      return false
    }
  }

  static clear(): boolean {
    if (!isBrowser()) return false

    try {
      localStorage.clear()
      console.log("Storage.clear: Successfully cleared all storage")
      return true
    } catch (error) {
      ErrorLogger.logStorageError(
        "Failed to clear storage",
        "clear",
        new StorageError("Failed to clear storage", undefined, error instanceof Error ? error : undefined),
      )
      return false
    }
  }

  // Helper method to clear old items if storage is full
  private static clearOldItems(): void {
    if (!isBrowser()) return

    try {
      // Keep essential items, remove old diff queues
      const essentialKeys = ["note.current", "note.base", "settings"]

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && !essentialKeys.includes(key)) {
          localStorage.removeItem(key)
          console.log(`Removed non-essential item: ${key}`)
        }
      }
    } catch (error) {
      ErrorLogger.logStorageError(
        "Failed to clear old items",
        "clearOldItems",
        new StorageError("Failed to clear old items", undefined, error instanceof Error ? error : undefined),
      )
    }
  }
}

