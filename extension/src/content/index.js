import { GateController } from './gating/gateController.js';
import { GateOverlay } from './overlay/gateOverlay.js';

(async () => {
    // State management
    let ui = null;
    let currentGame = null; 
    let currentGameId = null;

    const runGame = async (options = {}) => {
        // Handle legacy string argument or new options object
        const initOptions = typeof options === 'string' ? { excludeId: options } : options;
        
        // Cleanup old game logic
        if (currentGame) {
             if (currentGame.destroy) currentGame.destroy();
             currentGame = null;
        }
        
        // Cleanup UI content if reusing
        if (ui) {
            ui.reset();
        }

        console.log('[ContentScript] Initializing module... Options:', initOptions);
        
        // Pass options to init
        const controller = await GateController.init(initOptions);
        
        if (controller) {
            currentGameId = controller.config.id;
            console.log('[ContentScript] Gate controller active. Game:', currentGameId);
            
            // Create UI if needed
            if (!ui) {
                 ui = GateOverlay.create(() => {
                     console.log('[ContentScript] Switch clicked. Switching game...');
                     runGame({ excludeId: currentGameId }); // Pass as object for clarity
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
                        ui.showCompletion(
                            controller.config.name,
                            result.meta, 
                            () => {
                                console.log('[ContentScript] User clicked exit. Removing overlay.');
                                ui.remove();
                                GateController.onComplete(true);
                            },
                            () => {
                                console.log('[ContentScript] User clicked Play Again. Restarting game...');
                                runGame({ forceId: currentGameId });
                            }
                        );
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
