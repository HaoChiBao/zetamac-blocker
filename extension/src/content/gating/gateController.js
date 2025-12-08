import { Registry } from '../games/registry.js';
import { Storage } from '../../common/storage.js';
import { pickRandom } from '../../common/random.js';
import { SessionManager } from './sessionManager.js';

export const GateController = {
    init: async () => {
        console.log('[GateController] Init started');
        const settings = await Storage.getSettings();
        console.log('[GateController] Settings loaded:', settings);
        const currentHost = window.location.hostname.replace(/^www\./, '');
        
        // Simple allowlist check
        const blocked = settings.blockedDomains.some(site => currentHost === site || currentHost.endsWith('.' + site));
        console.log(`[GateController] checking host: ${currentHost}, blocked? ${blocked}`);
        if (!blocked) return null;

        if (SessionManager.isAllowed(currentHost)) {
            console.log('[GateController] Host allowed in session (IGNORING FOR DEBUGGING - Game should show)');
            // return null; // DEBUG: forcing game to show
        }

        // Select Game
        let gameId = SessionManager.getSessionGame(currentHost);
        console.log('[GateController] Session stored gameId:', gameId);

        // Check if stored game is still enabled
        if (gameId && settings.enabledGames[gameId] === false) {
             console.log(`[GateController] Stored game ${gameId} is now disabled. Re-rolling.`);
             gameId = null;
        }

        if (!gameId) {
            const enabledConfigs = Registry.getEnabledGames(settings.enabledGames);
            console.log('[GateController] Enabled games:', enabledConfigs.map(c => c.id));
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

        // Determine metrics based on difficulty
        const diff = settings.difficulty;
        const metrics = gameEntry.config.difficultyPresets[diff] || gameEntry.config.difficultyPresets['medium'];
        
        console.log('[GateController] Returning game controller:', { id: gameId, metrics });

        return {
            factory: gameEntry.factory,
            config: gameEntry.config,
            metrics: metrics
        };
    },

    onComplete: (success) => {
        if (success) {
            const currentHost = window.location.hostname.replace(/^www\./, '');
            SessionManager.allowHost(currentHost);
        }
    }
};
