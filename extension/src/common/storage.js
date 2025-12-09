import { Difficulty } from './types.js';

/** @type {import('./types').UserSettings} */
const DEFAULT_SETTINGS = {
    difficulty: 'medium', // Legacy support
    cooldownMinutes: 5,
    blockedDomains: [
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "tiktok.com",
        "reddit.com",
        "youtube.com",
        "linkedin.com"
    ],
    enabledGames: {
        'math': true,
        'blackjack': false,
        'wordhunt': false,
        'pairs': true,
        'cupshuffle': true
    },
    // Detailed Game Settings
    math: {
        targetScore: 5,
        ops: ['+', '-', '*', '/'],
        addRange: { min1: 2, max1: 100, min2: 2, max2: 100 },
        mulRange: { min1: 2, max1: 12, min2: 2, max2: 100 }
    },
    pairs: {
        pairsToClear: 4
    },
    cupshuffle: {
        cupsCount: 3,
        shuffleSpeed: 1.0,
        shuffleRounds: 5
    }
};

export const Storage = {
    // Expose defaults for reference if needed
    defaultSettings: DEFAULT_SETTINGS,

    /**
     * Get user settings with full defaults applied.
     * @returns {Promise<import('./types').UserSettings>}
     */
    getSettings: async () => {
        return new Promise((resolve) => {
            // Read game preferences from SYNC
            chrome.storage.sync.get(['settings'], (syncResult) => {
                // Read blocklist and legacy settings from LOCAL
                chrome.storage.local.get(['blockedSites', 'gameSettings', 'enabledGames', 'isPaused'], (localResult) => {
                    const loadedSync = syncResult.settings || {};
                    const storedGameSettings = localResult.gameSettings || {};
                    const storedEnabledGames = localResult.enabledGames || {};
                    const blockedSites = localResult.blockedSites || [];
                    const isPaused = localResult.isPaused || false;
                    
                    // DEEP MERGE STRATEGY
                    const settings = {
                        ...DEFAULT_SETTINGS,
                        ...loadedSync, // Sync overrides defaults (legacy)
                        
                        // Local Overrides
                        blockedDomains: blockedSites.length > 0 ? blockedSites : DEFAULT_SETTINGS.blockedDomains,
                        isPaused: isPaused,
                        
                        // Merge Enabled Games
                        enabledGames: {
                            ...DEFAULT_SETTINGS.enabledGames,
                            ...storedEnabledGames
                        },

                        // Merge Game Specific Settings
                        math: {
                            ...DEFAULT_SETTINGS.math,
                            ...(storedGameSettings.math || {})
                        },
                        pairs: {
                            ...DEFAULT_SETTINGS.pairs,
                            ...(storedGameSettings.pairs || {})
                        },
                        cupshuffle: {
                            ...DEFAULT_SETTINGS.cupshuffle,
                            ...(storedGameSettings.cupshuffle || {})
                        },
                        blackjack: {
                            ...DEFAULT_SETTINGS.blackjack,
                            ...(storedGameSettings.blackjack || {})
                        },
                        
                        // General override
                        cooldownMinutes: storedGameSettings.cooldownMinutes || DEFAULT_SETTINGS.cooldownMinutes
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
            // Split settings into their respective storage keys to match getSettings logic
            const { enabledGames, blockedDomains, ...gameSettings } = settings;
            
            chrome.storage.local.set({ 
                gameSettings: gameSettings,
                enabledGames: enabledGames,
                blockedSites: blockedDomains
            }, () => {
                resolve();
            });
        });
    }
};
