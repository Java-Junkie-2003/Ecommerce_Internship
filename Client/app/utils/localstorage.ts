// Utility functions for localStorage operations
export const localStorage = {
    // Set an item in localStorage
    setItem: (key: string, value: any): void => {
        try {
            const serializedValue = JSON.stringify(value);
            window.localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error setting localStorage item:', error);
        }
    },

    // Get an item from localStorage
    getItem: <T>(key: string): T | null => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting localStorage item:', error);
            return null;
        }
    },

    // Remove an item from localStorage
    removeItem: (key: string): void => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage item:', error);
        }
    },

    // Clear all localStorage
    clear: (): void => {
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },

    // Check if a key exists in localStorage
    hasItem: (key: string): boolean => {
        return window.localStorage.getItem(key) !== null;
    }
};