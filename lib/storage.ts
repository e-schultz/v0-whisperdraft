// Storage abstraction for local-first approach
// Can be extended later to support Supabase or other backends

export class Storage {
  static get(key: string): any {
    if (typeof window === "undefined") {
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
      console.error(`Error getting item ${key} from storage:`, error)
      return null
    }
  }

  static set(key: string, value: any): void {
    if (typeof window === "undefined") {
      console.log(`Storage.set: Window not available for key ${key}`)
      return
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      console.log(`Storage.set: Successfully stored item for key ${key}`)
    } catch (error) {
      console.error(`Error setting item ${key} in storage:`, error)

      // If it's a quota error, try to clear some space
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.log("Storage quota exceeded, attempting to clear space")
        this.clearOldItems()
      }
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(key)
      console.log(`Storage.remove: Successfully removed item for key ${key}`)
    } catch (error) {
      console.error(`Error removing item ${key} from storage:`, error)
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.clear()
      console.log("Storage.clear: Successfully cleared all storage")
    } catch (error) {
      console.error("Error clearing storage:", error)
    }
  }

  // Helper method to clear old items if storage is full
  private static clearOldItems(): void {
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
      console.error("Error clearing old items:", error)
    }
  }
}

