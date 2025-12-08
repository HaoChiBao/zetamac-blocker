import { Registry } from '../games/registry.js';
import { Storage } from '../../common/storage.js';
import { pickRandom } from '../../common/random.js';
import { SessionManager } from './sessionManager.js';

export const GateController = {
    init: async (excludeGameId = null) => {
        console.log('[GateController] Init started');
        const settings = await Storage.getSettings();
        console.log('[GateController] Settings loaded:', settings);
        const currentHost = window.location.hostname.replace(/^www\./, '');
        
        // Simple allowlist check
        const blocked = settings.blockedDomains.some(site => currentHost === site || currentHost.endsWith('.' + site));
        const isGlobalSessionActive = await SessionManager.isSessionActive();
        console.log(`[GateController] checking host: ${currentHost}, blocked? ${blocked}, sessionActive? ${isGlobalSessionActive}`);
        
        if (!blocked) return null;

        if (isGlobalSessionActive) {
            console.log('[GateController] Global session active. Allowing access.');
            return null; 
        }

        // Select Game
        let gameId = null; 
        
        if (!gameId) {
            let enabledConfigs = Registry.getEnabledGames(settings.enabledGames);
            console.log('[GateController] Enabled games:', enabledConfigs.map(c => c.id));
            
            // If switching, try to filter out the current one
            if (excludeGameId && enabledConfigs.length > 1) {
                const filtered = enabledConfigs.filter(c => c.id !== excludeGameId);
                if (filtered.length > 0) {
                    enabledConfigs = filtered;
                }
            }

            if (enabledConfigs.length === 0) {
                // Fallback to math
                console.log('[GateController] No games enabled, falling back to math');
                gameId = 'math';
            } else {
                const picked = pickRandom(enabledConfigs);
                gameId = picked.id;
                console.log('[GateController] Randomly picked:', gameId);
            }
            SessionManager.setSessionGame(currentHost, gameId);
        }

        const gameEntry = Registry.getGame(gameId);
        if (!gameEntry) {
            console.error(`[GateController] Game ${gameId} not found in registry`);
            return null;
        }

        // Determine metrics
        // 1. Start with defaults or presets
        const diff = settings.difficulty || 'medium';
        let metrics = gameEntry.config.difficultyPresets[diff] || gameEntry.config.difficultyPresets['medium'];
        
        console.log('[GateController] Base metrics from preset:', metrics);
        console.log('[GateController] Full Settings:', settings);
        
        // 2. Merge user-configured overrides if any
        if (settings[gameId]) {
            console.log(`[GateController] Merging custom settings for ${gameId}:`, settings[gameId]);
            metrics = { ...metrics, ...settings[gameId] };
        } else {
            console.log(`[GateController] No custom settings found for key: ${gameId}`);
        }
        
        console.log('[GateController] Returning game controller:', { id: gameId, metrics });

        return {
            factory: gameEntry.factory,
            config: gameEntry.config,
            metrics: metrics
        };
    },

    onComplete: (success) => {
        if (success) {
            console.log('[GateController] Game passed. Extending global session.');
            SessionManager.extendSession();
        }
    }
};
