// Default Settings
const DEFAULT_SETTINGS = {
    targetScore: 10,
    ops: ['+', '-', '*'],
    addRange: { min1: 2, max1: 100, min2: 2, max2: 100 },
    mulRange: { min1: 2, max1: 12, min2: 2, max2: 100 },
    cooldownMinutes: 5
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

#zetamac-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    z-index: 2147483647;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    color: #000000;
}

#zetamac-game-container {
    text-align: center;
    padding: 60px;
    background: white;
    max-width: 600px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#zetamac-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 40px;
    color: #000000;
    letter-spacing: -0.5px;
    text-transform: uppercase;
}

#zetamac-problem {
    font-size: 80px;
    font-weight: 700;
    margin: 30px 0;
    color: #000000;
    line-height: 1;
}

#zetamac-input {
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

#zetamac-input::placeholder {
    color: #ccc;
}

#zetamac-score {
    margin-top: 30px;
    font-size: 16px;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Stats Screen */
#zetamac-stats-container {
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
#zetamac-graph {
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

#zetamac-exit-btn {
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
}

#zetamac-exit-btn:hover {
    background-color: #333;
    transform: translateY(-2px);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Check status periodically
function checkStatus() {
    chrome.storage.local.get(['blockedSites', 'lastCompletion', 'gameSettings', 'isPaused'], (result) => {
        // If paused, ensure no overlay and return
        if (result.isPaused) {
            const host = document.getElementById('zetamac-host');
            if (host) {
                host.remove();
                document.body.style.overflow = '';
            }
            return;
        }

        // If overlay already exists, don't do anything
        if (document.getElementById('zetamac-host')) {
            return;
        }

        const blockedSites = result.blockedSites || [];
        const settings = result.gameSettings || DEFAULT_SETTINGS;
        const cooldownMs = (settings.cooldownMinutes || 5) * 60 * 1000;

        const currentHost = window.location.hostname.replace(/^www\./, '');
        const isBlocked = blockedSites.some(site => currentHost === site || currentHost.endsWith('.' + site));

        if (isBlocked) {
            const lastCompletion = result.lastCompletion || 0;
            const now = Date.now();

            if (now - lastCompletion > cooldownMs) {
                console.log(`Zetamac Blocker: Cooldown period has passed. Initializing game.`);
                initGame(settings);
            }
        }
    });
}

// Run immediately and then every 5 second
checkStatus();
setInterval(checkStatus, 5000);

function initGame(settings) {
    document.body.style.overflow = 'hidden';

    // Create Host and Shadow DOM
    const host = document.createElement('div');
    host.id = 'zetamac-host';
    const shadow = host.attachShadow({mode: 'open'});

    // Add Styles
    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.appendChild(style);

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'zetamac-overlay';
    
    // Initial Game HTML
    overlay.innerHTML = `
        <div id="zetamac-game-container">
            <div id="zetamac-title">Zetamac Blocker</div>
            <div id="zetamac-problem"></div>
            <input type="number" id="zetamac-input" autofocus autocomplete="off" placeholder="?">
            <div id="zetamac-score">0 / ${settings.targetScore}</div>
        </div>
    `;

    shadow.appendChild(overlay);
    document.body.appendChild(host);

    const input = shadow.getElementById('zetamac-input');
    const problemDisplay = shadow.getElementById('zetamac-problem');
    const scoreDisplay = shadow.getElementById('zetamac-score');
    const container = shadow.getElementById('zetamac-game-container');
    
    let score = 0;
    let currentAnswer = 0;
    
    // Stats tracking
    let questionStartTime = 0;
    const questionTimes = [];

    function generateProblem() {
        const ops = settings.ops || ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b;

        // Helper to get random int between min and max (inclusive)
        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const ar = settings.addRange || DEFAULT_SETTINGS.addRange;
        const mr = settings.mulRange || DEFAULT_SETTINGS.mulRange;

        if (op === '+') {
            a = rand(ar.min1, ar.max1);
            b = rand(ar.min2, ar.max2);
            currentAnswer = a + b;
        } else if (op === '-') {
            const val1 = rand(ar.min1, ar.max1);
            const val2 = rand(ar.min2, ar.max2);
            a = val1 + val2;
            b = val1;
            currentAnswer = val2;
        } else if (op === '*') {
            a = rand(mr.min1, mr.max1);
            b = rand(mr.min2, mr.max2);
            currentAnswer = a * b;
        } else if (op === '/') {
            const val1 = rand(mr.min1, mr.max1);
            const val2 = rand(mr.min2, mr.max2);
            a = val1 * val2;
            b = val1;
            currentAnswer = val2;
        }

        problemDisplay.textContent = `${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b}`;
        input.value = '';
        input.focus();
        questionStartTime = Date.now();
    }

    input.addEventListener('input', () => {
        const val = parseInt(input.value);
        if (val === currentAnswer) {
            const timeTaken = Date.now() - questionStartTime;
            questionTimes.push(timeTaken);
            
            score++;
            scoreDisplay.textContent = `${score} / ${settings.targetScore}`;
            
            if (score >= settings.targetScore) {
                showStats();
            } else {
                generateProblem();
            }
        }
    });

    input.addEventListener('blur', () => {
        // Re-focus logic needs to check if element still exists in shadow
        if (shadow.getElementById('zetamac-input')) {
            setTimeout(() => input.focus(), 10);
        }
    });

    generateProblem();

    function showStats() {
        const totalTime = questionTimes.reduce((a, b) => a + b, 0);
        const avgTime = Math.round(totalTime / questionTimes.length);
        const totalSeconds = (totalTime / 1000).toFixed(1);
        const avgSeconds = (avgTime / 1000).toFixed(1);

        // Save to history
        chrome.storage.local.get(['gameHistory'], (result) => {
            const history = result.gameHistory || [];
            const newRecord = {
                date: Date.now(),
                score: settings.targetScore,
                totalTime: totalTime,
                avgTime: avgTime,
                questionTimes: questionTimes
            };
            history.push(newRecord);
            
            const bestAvg = history.reduce((min, r) => Math.min(min, r.avgTime), Infinity);
            const bestAvgSeconds = (bestAvg / 1000).toFixed(1);

            chrome.storage.local.set({ gameHistory: history });

            const maxTime = Math.max(...questionTimes);
            const graphBars = questionTimes.map((t, i) => {
                const height = Math.max((t / maxTime) * 100, 5);
                const seconds = (t / 1000).toFixed(1);
                return `<div class="graph-bar" style="height: ${height}%;" data-time="${seconds}s"></div>`;
            }).join('');

            container.innerHTML = `
                <div id="zetamac-title">Session Complete</div>
                
                <div id="zetamac-stats-container">
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

                    <div id="zetamac-graph">
                        ${graphBars}
                    </div>

                    <button id="zetamac-exit-btn">Enter Site</button>
                </div>
            `;

            shadow.getElementById('zetamac-exit-btn').addEventListener('click', completeGame);
        });
    }

    function completeGame() {
        chrome.storage.local.set({ lastCompletion: Date.now() }, () => {
            host.remove();
            document.body.style.overflow = '';
        });
    }
}
