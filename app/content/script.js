// Default Settings
const DEFAULT_SETTINGS = {
    targetScore: 10,
    ops: ['+', '-', '*'],
    addRange: { min1: 2, max1: 100, min2: 2, max2: 100 },
    mulRange: { min1: 2, max1: 12, min2: 2, max2: 100 },
    cooldownMinutes: 5
};

// Check status periodically
function checkStatus() {
    chrome.storage.local.get(['blockedSites', 'lastCompletion', 'gameSettings', 'isPaused'], (result) => {
        // If paused, ensure no overlay and return
        if (result.isPaused) {
            const overlay = document.getElementById('zetamac-overlay');
            if (overlay) {
                overlay.remove();
                document.body.style.overflow = '';
            }
            return;
        }

        // If overlay already exists, don't do anything
        if (document.getElementById('zetamac-overlay')) {
            return;
        }

        const blockedSites = result.blockedSites || [];
        const settings = result.gameSettings || DEFAULT_SETTINGS;
        const cooldownMs = (settings.cooldownMinutes || 5) * 60 * 1000;

        const currentHost = window.location.hostname.replace(/^www\./, '');
        const isBlocked = blockedSites.some(site => currentHost === site || currentHost.endsWith('.' + site));

        if (isBlocked) {
            // console.log(`Zetamac Blocker: Current site (${currentHost}) is blocked.`);
            const lastCompletion = result.lastCompletion || 0;
            const now = Date.now();

            if (now - lastCompletion > cooldownMs) {
                console.log(`Zetamac Blocker: Cooldown period has passed. Initializing game.`);
                initGame(settings);
            } else {
                // console.log(`Zetamac Blocker: Cooldown period is still active.`);
            }
        }
    });
}

// Run immediately and then every 5 second
checkStatus();
setInterval(checkStatus, 5000);

function initGame(settings) {
    document.body.style.overflow = 'hidden';

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

    document.body.appendChild(overlay);

    const input = document.getElementById('zetamac-input');
    const problemDisplay = document.getElementById('zetamac-problem');
    const scoreDisplay = document.getElementById('zetamac-score');
    const container = document.getElementById('zetamac-game-container');
    
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

        // Fallback for legacy settings if needed, though we updated defaults
        const ar = settings.addRange || DEFAULT_SETTINGS.addRange;
        const mr = settings.mulRange || DEFAULT_SETTINGS.mulRange;

        if (op === '+') {
            a = rand(ar.min1, ar.max1);
            b = rand(ar.min2, ar.max2);
            currentAnswer = a + b;
        } else if (op === '-') {
            // For subtraction, we generate an addition problem and reverse it
            // a + b = c  =>  c - a = b
            const val1 = rand(ar.min1, ar.max1);
            const val2 = rand(ar.min2, ar.max2);
            a = val1 + val2;
            b = val1; // or val2
            currentAnswer = val2;
        } else if (op === '*') {
            a = rand(mr.min1, mr.max1);
            b = rand(mr.min2, mr.max2);
            currentAnswer = a * b;
        } else if (op === '/') {
            // For division, generate multiplication and reverse
            // a * b = c => c / a = b
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
        if (document.getElementById('zetamac-input')) {
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
                avgTime: avgTime
            };
            history.push(newRecord);
            
            // Calculate Best Average (lower is better)
            // Filter for games with the same target score to be fair, or just all?
            // Usually "Best Average" implies same category, but for simplicity let's just show global best for now
            // or maybe best for this session's target score? Let's stick to global best avg for simplicity unless requested otherwise.
            // Actually, comparing 10 questions vs 100 questions, avg time should be comparable.
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

            document.getElementById('zetamac-exit-btn').addEventListener('click', completeGame);
        });
    }

    function completeGame() {
        chrome.storage.local.set({ lastCompletion: Date.now() }, () => {
            overlay.remove();
            document.body.style.overflow = '';
        });
    }
}
