import { Difficulty } from './types.js';

/** @type {import('./types').UserSettings} */
const DEFAULT_SETTINGS = {
    blockedDomains: [],
    enabledGames: {
        'math': false,
        'blackjack': false,
        'wordhunt': false,
        'pairs': true,
        'cupshuffle': false
    },
    difficulty: Difficulty.MEDIUM
};

export const Storage = {
    /**
     * Get user settings with full defaults applied.
     * @returns {Promise<import('./types').UserSettings>}
     */
    getSettings: async () => {
        return new Promise((resolve) => {
            // Read game preferences from SYNC
            chrome.storage.sync.get(['settings'], (syncResult) => {
                // Read blocklist and legacy settings from LOCAL
                chrome.storage.local.get(['blockedSites', 'gameSettings'], (localResult) => {
                    const loadedSync = syncResult.settings || {};
                    const blockedSites = localResult.blockedSites || [];
                    
                    // Merge with defaults
                    const settings = {
                        ...DEFAULT_SETTINGS,
                        ...loadedSync,
                        blockedDomains: blockedSites, // Use LOCAL blocked sites
                        enabledGames: {
                            ...DEFAULT_SETTINGS.enabledGames,
                            ...(loadedSync.enabledGames || {})
                        },
                        // We could also map legacy gameSettings here if we wanted custom diff/targetScore
                        // For now, ensuring blocked sites work is priority.
                    };
                    resolve(settings);
                });
            });
        });
    },

    /**
     * Save user settings.
     * @param {import('./types').UserSettings} settings 
     * @returns {Promise<void>}
     */
    saveSettings: async (settings) => {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ settings }, () => {
                resolve();
            });
        });
    }
};
