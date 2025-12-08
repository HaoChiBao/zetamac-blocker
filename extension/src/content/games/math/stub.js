import { Game } from '../Game.js';
import { config } from './config.js';

const STYLES = `
.zetamac-game-container {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.zetamac-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 40px;
    color: #000000;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
}

.zetamac-problem {
    font-size: 80px;
    font-weight: 700;
    margin: 30px 0;
    color: #000000;
    line-height: 1;
    font-family: 'Inter', sans-serif;
}

.zetamac-input {
    font-family: 'Inter', sans-serif;
    font-size: 40px;
    padding: 15px;
    width: 200px;
    text-align: center;
    border: none;
    border-bottom: 4px solid #000000;
    background: transparent;
    outline: none;
    color: #000000;
    font-weight: 600;
    margin-bottom: 20px;
}

.zetamac-input::placeholder {
    color: #ccc;
}

.zetamac-score {
    margin-top: 30px;
    font-size: 16px;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Inter', sans-serif;
}

/* Stats Screen */
.zetamac-stats-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.5s ease;
}

.stat-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 40px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #000;
}

.stat-label {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 5px;
}

/* Graph */
.zetamac-graph {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
    height: 150px;
    width: 100%;
    margin-bottom: 40px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
}

.graph-bar {
    background-color: #000;
    width: 20px;
    min-height: 2px;
    transition: height 0.5s ease;
    position: relative;
    border-radius: 2px 2px 0 0;
}

.graph-bar:hover::after {
    content: attr(data-time);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    margin-bottom: 5px;
    white-space: nowrap;
}

.zetamac-exit-btn {
    padding: 15px 40px;
    background-color: #000000;
    color: #ffffff;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
}

.zetamac-exit-btn:hover {
    background-color: #333;
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

export class MathGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        this.score = 0;
        this.currentAnswer = 0;
        this.questionStartTime = 0;
        this.questionTimes = [];
        this.container = null;
    }

    render(container, context) {
        this.container = container;
        
        // Inject Styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        // Initial HTML
        const gameDiv = document.createElement('div');
        gameDiv.className = 'zetamac-game-container';
        gameDiv.innerHTML = `
            <div class="zetamac-title">${this.config.name}</div>
            <div class="zetamac-problem"></div>
            <input type="number" class="zetamac-input" autofocus autocomplete="off" placeholder="?">
            <div class="zetamac-score">0 / ${this.metrics.requiredCorrect}</div>
        `;
        container.appendChild(gameDiv);

        this.problemDisplay = gameDiv.querySelector('.zetamac-problem');
        this.input = gameDiv.querySelector('.zetamac-input');
        this.scoreDisplay = gameDiv.querySelector('.zetamac-score');

        // Event Listeners
        this.input.addEventListener('input', () => this.checkAnswer(context));
        
        // Auto-focus helper
        this.input.addEventListener('blur', () => {
            if (document.contains(this.input)) {
                setTimeout(() => this.input.focus(), 10);
            }
        });

        this.generateProblem();
        this.input.focus();
    }

    generateProblem() {
        const ops = this.metrics.ops || ['add', 'sub', 'mul']; // Map config ops to logic?
        // Old code used '+', '-', '*', '/' strings. New config uses 'add', 'sub', 'mul', 'div'.
        // Let's normalize or handle both.
        
        const opMap = {
            'add': '+',
            'sub': '-',
            'mul': '*',
            'div': '/'
        };

        const availableOps = ops.map(o => opMap[o] || o).filter(o => ['+', '-', '*', '/'].includes(o));
        if (availableOps.length === 0) availableOps.push('+');

        const op = availableOps[Math.floor(Math.random() * availableOps.length)];
        let a, b;

        // Use hardcoded reasonably difficult ranges if not provided in metrics (metrics from difficulty presets)
        // Presets in config.js don't define ranges, so we define defaults here similar to original.
        const addRange = { min1: 2, max1: 100, min2: 2, max2: 100 };
        const mulRange = { min1: 2, max1: 12, min2: 2, max2: 100 };

        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        if (op === '+') {
            a = rand(addRange.min1, addRange.max1);
            b = rand(addRange.min2, addRange.max2);
            this.currentAnswer = a + b;
        } else if (op === '-') {
            const val1 = rand(addRange.min1, addRange.max1);
            const val2 = rand(addRange.min2, addRange.max2);
            a = val1 + val2;
            b = val1;
            this.currentAnswer = val2;
        } else if (op === '*') {
            a = rand(mulRange.min1, mulRange.max1);
            b = rand(mulRange.min2, mulRange.max2);
            this.currentAnswer = a * b;
        } else if (op === '/') {
            const val1 = rand(mulRange.min1, mulRange.max1);
            const val2 = rand(mulRange.min2, mulRange.max2);
            a = val1 * val2;
            b = val1;
            this.currentAnswer = val2;
        }

        const displayOp = op === '*' ? '×' : op === '/' ? '÷' : op;
        this.problemDisplay.textContent = `${a} ${displayOp} ${b}`;
        this.input.value = '';
        this.input.focus();
        this.questionStartTime = Date.now();
    }

    checkAnswer(context) {
        const val = parseInt(this.input.value);
        if (val === this.currentAnswer) {
            const timeTaken = Date.now() - this.questionStartTime;
            this.questionTimes.push(timeTaken);
            
            this.score++;
            this.scoreDisplay.textContent = `${this.score} / ${this.metrics.requiredCorrect}`;
            
            if (this.score >= this.metrics.requiredCorrect) {
            if (this.score >= this.metrics.requiredCorrect) {
                 this.finishGame(context);
            } else {
                this.generateProblem();
            }
            } else {
                this.generateProblem();
            }
        }
    }

    finishGame(context) {
        const totalTime = this.questionTimes.reduce((a, b) => a + b, 0);
        const avgTime = Math.round(totalTime / this.questionTimes.length);
        const totalSeconds = (totalTime / 1000).toFixed(1);
        const avgSeconds = (avgTime / 1000).toFixed(1);

        // We can save history to local storage here if we want to preserve that feature
        chrome.storage.local.get(['gameHistory'], (result) => {
            const history = result.gameHistory || [];
            const newRecord = {
                date: Date.now(),
                score: this.metrics.requiredCorrect,
                totalTime: totalTime,
                avgTime: avgTime,
                questionTimes: this.questionTimes
            };
            history.push(newRecord);
            chrome.storage.local.set({ gameHistory: history });
            
            // Calculate best
            const bestAvg = history.reduce((min, r) => Math.min(min, r.avgTime), Infinity);
            const bestAvgSeconds = (bestAvg !== Infinity) ? (bestAvg / 1000).toFixed(1) + 's' : avgSeconds + 's';

            // Pass stats to global completion handler
            context.onComplete({
                passed: true,
                meta: {
                    totalTime: totalSeconds + 's',
                    avgTime: avgSeconds + 's',
                    bestAvg: bestAvgSeconds
                }
            });
        });
    }

    renderStatsView(context, totalSeconds, avgSeconds, bestAvgSeconds) {
        const maxTime = Math.max(...this.questionTimes);
        const graphBars = this.questionTimes.map((t) => {
            const height = Math.max((t / maxTime) * 100, 5);
            const seconds = (t / 1000).toFixed(1);
            return `<div class="graph-bar" style="height: ${height}%;" data-time="${seconds}s"></div>`;
        }).join('');

        // Clear current content (except style tag, but easier to just clear and re-add or just clear innerHTML of the gameDiv)
        // We'll replace the game content
        const gameDiv = this.container.querySelector('.zetamac-game-container');
        gameDiv.innerHTML = `
            <div class="zetamac-title">Session Complete</div>
            
            <div class="zetamac-stats-container">
                <div class="stat-row">
                    <div class="stat-item">
                        <div class="stat-value">${totalSeconds}s</div>
                        <div class="stat-label">Total Time</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${avgSeconds}s</div>
                        <div class="stat-label">Avg / Problem</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${bestAvgSeconds}s</div>
                        <div class="stat-label">Best Avg</div>
                    </div>
                </div>

                <div class="zetamac-graph">
                    ${graphBars}
                </div>

                <button class="zetamac-exit-btn">Enter Site</button>
            </div>
        `;

        gameDiv.querySelector('.zetamac-exit-btn').addEventListener('click', () => {
             context.onComplete({ passed: true });
        });
    }

    destroy() {
        // Cleanup if needed
        this.container = null;
    }
}

export function createGame(metrics) {
    return new MathGame(metrics);
}
