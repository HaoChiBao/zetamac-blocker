import { CONSTANTS } from '../../common/constants.js';

export const SessionManager = {
    // Returns the game ID stored for this specific host in the current tab session
    // We still keep this for "sticky" game selection if we wanted it, 
    // but we disabled it for randomness. We can keep the method for future use or remove.
    // For now, let's keep it as a wrapper around sessionStorage for game selection only.
    getSessionGame: (host) => {
        return sessionStorage.getItem(`gate_session_${host}`);
    },

    setSessionGame: (host, gameId) => {
        sessionStorage.setItem(`gate_session_${host}`, gameId);
    },

    // Checks if the global session is currently active
    isSessionActive: () => {
        return new Promise((resolve) => {
            chrome.storage.local.get(['sessionExpiry'], (result) => {
                const expiry = result.sessionExpiry || 0;
                resolve(Date.now() < expiry);
            });
        });
    },

    // Extends the global session by the duration constant
    extendSession: () => {
        return new Promise((resolve) => {
            // We can check for a custom cooldown setting here if we want, 
            // but for now we use the constant or fetch settings.
            // Let's fetch settings to respect the popup's cooldown config.
            chrome.storage.local.get(['gameSettings'], (result) => {
                const settings = result.gameSettings || {};
                const minutes = settings.cooldownMinutes || CONSTANTS.SESSION_DURATION_MINUTES;
                const durationMs = minutes * 60 * 1000;
                
                const newExpiry = Date.now() + durationMs;
                
                // We also store lastCompletion for the popup logic if it relies on it, 
                // but checking `sessionExpiry` is more direct.
                // The popup currently uses `lastCompletion` + `cooldownMinutes`.
                // Let's align them.
                // If we set `sessionExpiry`, the popup should use `sessionExpiry` for countdown.
                chrome.storage.local.set({ 
                    sessionExpiry: newExpiry,
                    lastCompletion: Date.now() // Keep this for reference if needed
                }, resolve);
            });
        });
    }
};
