import { GateController } from './gating/gateController.js';
import { GateOverlay } from './overlay/gateOverlay.js';

(async () => {
    // State management
    let ui = null;
    let currentGame = null; 
    let currentGameId = null;

    const runGame = async (excludeId = null) => {
        // Cleanup old game logic
        if (currentGame) {
             if (currentGame.destroy) currentGame.destroy();
             currentGame = null;
        }
        
        // Cleanup UI content if reusing
        if (ui) {
            ui.reset();
        }

        console.log('[ContentScript] Initializing module... excludeId:', excludeId);
        // Pass excludeId to init to get a different game
        const controller = await GateController.init(excludeId);
        
        if (controller) {
            currentGameId = controller.config.id;
            console.log('[ContentScript] Gate controller active. Game:', currentGameId);
            
            // Create UI if needed
            if (!ui) {
                 ui = GateOverlay.create(() => {
                     console.log('[ContentScript] Switch clicked. Switching game...');
                     runGame(currentGameId); // Pass current ID to pivot away from it
                 });
            }
            
            const container = ui.container;
            
            // Render stub
            console.log('[ContentScript] Creating game instance...');
            currentGame = controller.factory(controller.metrics);
            
            console.log('[ContentScript] Rendering game...');
            currentGame.render(container, {
                config: controller.config, // Pass config for reading settings
                onComplete: (result) => {
                    console.log('[ContentScript] Game complete', result);
                    if (result.passed) {
                        console.log('[ContentScript] Game passed. Showing completion screen.');
                        if (currentGame && currentGame.destroy) currentGame.destroy(); 
                        currentGame = null;
                        
                        // Show completion UI
                        ui.showCompletion(result.meta, () => {
                            console.log('[ContentScript] User clicked exit. Removing overlay.');
                            ui.remove();
                            GateController.onComplete(true);
                        });
                    }
                }
            });
        } else {
            console.log('[ContentScript] No gate required.');
        }
    }
    
    // Start
    runGame();
    
    // Listen for SPA navigation
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'CHECK_GATE') {
            console.log('[ContentScript] Navigation detected. Re-checking gate...');
            runGame();
        }
    });
})();
