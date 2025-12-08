import { GateController } from './gating/gateController.js';
import { GateOverlay } from './overlay/gateOverlay.js';

(async () => {
    console.log('[ContentScript] Initializing module...');
    const controller = await GateController.init();
    
    if (controller) {
        console.log('[ContentScript] Gate controller active. Creating overlay.');
        const ui = GateOverlay.create();
        const container = ui.container;
        
        // Render stub
        console.log('[ContentScript] Creating game instance...');
        const game = controller.factory(controller.metrics);
        console.log('[ContentScript] Rendering game...');
        game.render(container, {
            onComplete: (result) => {
                console.log('[ContentScript] Game complete', result);
                if (result.passed) {
                    game.destroy();
                    ui.remove();
                    GateController.onComplete(true);
                }
            }
        });
    } else {
        console.log('[ContentScript] No gate required.');
    }
})();
