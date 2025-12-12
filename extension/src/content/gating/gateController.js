import { Registry } from '../games/registry.js';
import { Storage } from '../../common/storage.js';
import { pickRandom, shuffle } from '../../common/random.js';
import { SessionManager } from './sessionManager.js';

export const GateController = {
    init: async (options = {}) => {
        const { excludeId = null, forceId = null } = typeof options === 'string' ? { excludeId: options } : options;
        
        console.log('[GateController] Init started. Options:', { excludeId, forceId });
        const settings = await Storage.getSettings();
        console.log('[GateController] Settings loaded:', settings);
        const currentHost = window.location.hostname.replace(/^www\./, '');
        
        // Simple allowlist check
        const blocked = settings.blockedDomains.some(site => currentHost === site || currentHost.endsWith('.' + site));
        
        if (settings.isPaused) {
            console.log('[GateController] Extension is paused. Allowing access.');
            return null;
        }

        const isGlobalSessionActive = await SessionManager.isSessionActive();
        console.log(`[GateController] checking host: ${currentHost}, blocked? ${blocked}, sessionActive? ${isGlobalSessionActive}`);
        
        if (!blocked) return null;

        if (isGlobalSessionActive) {
            console.log('[GateController] Global session active. Allowing access.');
            return null; 
        }

        // Select Game
        let gameId = forceId; 
        
        if (!gameId) {
            let enabledConfigs = Registry.getEnabledGames(settings.enabledGames);
            console.log('[GateController] Enabled games:', enabledConfigs.map(c => c.id));

            if (enabledConfigs.length === 0) {
                // Fallback to math
                console.log('[GateController] No games enabled, falling back to math');
                gameId = 'math';
            } else {
                // Check if enabled games changed since last queue fill
                const currentEnabledIds = enabledConfigs.map(c => c.id).sort().join(',');
                if (GateController.queueSourceIds !== currentEnabledIds) {
                    console.log('[GateController] Enabled games changed. Clearing queue.');
                    GateController.gameQueue = [];
                }

                // Initialize or refresh queue if needed
                if (!GateController.gameQueue || GateController.gameQueue.length === 0) {
                     console.log('[GateController] Refreshing game queue...');
                     // Create a fresh list of IDs
                     const ids = enabledConfigs.map(c => c.id);
                     GateController.gameQueue = shuffle(ids);
                     GateController.queueSourceIds = currentEnabledIds;
                     console.log('[GateController] New queue:', GateController.gameQueue);
                }

                // If we need to exclude a specific ID (e.g. current game)
                if (excludeId) {
                    // Check if the next game is the one we want to avoid
                    // But only if we have other options
                    if (GateController.gameQueue.length > 0 && GateController.gameQueue[0] === excludeId) {
                         // If we have more than 1 game left, swap the first with a random other one
                         if (GateController.gameQueue.length > 1) {
                             const swapIdx = Math.floor(Math.random() * (GateController.gameQueue.length - 1)) + 1;
                             [GateController.gameQueue[0], GateController.gameQueue[swapIdx]] = [GateController.gameQueue[swapIdx], GateController.gameQueue[0]];
                             console.log('[GateController] Swapped to avoid repeat. New head:', GateController.gameQueue[0]);
                         } else {
                             // If it's the ONLY game left, we might have to refill immediately
                             // But if it's the ONLY enabled game overall, we can't avoid repeating
                             if (enabledConfigs.length > 1) {
                                 console.log('[GateController] Only excluded game left. Refilling...');
                                 const ids = enabledConfigs.map(c => c.id);
                                 // Shuffle but ensure first isn't excludeId
                                 let newQueue = shuffle(ids);
                                 if (newQueue[0] === excludeId) {
                                     // Move to end
                                     newQueue.push(newQueue.shift());
                                 }
                                 GateController.gameQueue = newQueue;
                             }
                         }
                    }
                }

                // Pop the next game
                gameId = GateController.gameQueue.shift();
                
                // Safety check: if queue logic failed or empty, fallback to random
                if (!gameId) {
                     const picked = pickRandom(enabledConfigs);
                     gameId = picked.id;
                }
                
                console.log('[GateController] Selected from queue:', gameId, 'Remaining:', GateController.gameQueue);
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
        const preset = gameEntry.config.difficultyPresets[diff] || gameEntry.config.difficultyPresets['medium'];
        let metrics = { ...gameEntry.config.completionMetrics, ...preset };
        
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
