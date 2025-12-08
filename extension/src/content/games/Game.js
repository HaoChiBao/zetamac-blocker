/**
 * Base class for all games.
 */
export class Game {
    /**
     * @param {import('../common/types').GameConfig} config 
     * @param {Object} metrics - Calculated metrics based on difficulty
     */
    constructor(config, metrics) {
        this.config = config;
        this.metrics = metrics;
    }

    /**
     * Render the game into the container.
     * @param {HTMLElement} container 
     * @param {Object} context
     * @param {function({ passed: boolean }): void} context.onComplete
     */
    render(container, context) {
        // Default stub implementation
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; font-family: 'Inter', sans-serif;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">${this.config.name}</h2>
                <p style="color: #666; margin-bottom: 20px;">${this.config.description}</p>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left; display: inline-block;">
                    <strong style="display: block; margin-bottom: 5px;">Current Metrics:</strong>
                    <pre style="margin: 0; font-size: 12px;">${JSON.stringify(this.metrics, null, 2)}</pre>
                </div>

                <div>
                    <button id="mock-complete-btn" style="
                        background: #000; 
                        color: #fff; 
                        border: none; 
                        padding: 10px 20px; 
                        font-size: 16px; 
                        font-weight: 600; 
                        cursor: pointer; 
                        border-radius: 4px;
                        transition: background 0.2s;
                    ">Mock Complete</button>
                </div>
            </div>
        `;

        container.querySelector('#mock-complete-btn').addEventListener('click', () => {
            context.onComplete({ passed: true });
        });
    }

    destroy() {
        // Cleanup if needed
    }
}
