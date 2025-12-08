import { Storage } from '../../src/common/storage.js';
import { Registry } from '../../src/content/games/registry.js';

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    const settingsBtn = document.getElementById('settingsBtn');
    const backBtn = document.getElementById('backBtn');
    const historyBtn = document.getElementById('historyBtn');
    const historyView = document.getElementById('historyView');
    const historyBackBtn = document.getElementById('historyBackBtn');
    const historyList = document.getElementById('historyList');
    
    const siteInput = document.getElementById('siteInput');
    const addBtn = document.getElementById('addBtn');
    const siteList = document.getElementById('siteList');
    
    const currentSiteContainer = document.getElementById('currentSiteContainer');
    const currentSitePreview = document.getElementById('currentSitePreview');
    const addCurrentBtn = document.getElementById('addCurrentBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    const countdownContainer = document.getElementById('countdownContainer');
    const countdownTimer = document.getElementById('countdownTimer');
    const resetTimerBtn = document.getElementById('resetTimerBtn');

    // Settings Elements
    const targetScoreInput = document.getElementById('targetScore');
    const opAdd = document.getElementById('opAdd');
    const opSub = document.getElementById('opSub');
    const opMul = document.getElementById('opMul');
    const opDiv = document.getElementById('opDiv');
    
    const addMin1 = document.getElementById('addMin1');
    const addMax1 = document.getElementById('addMax1');
    const addMin2 = document.getElementById('addMin2');
    const addMax2 = document.getElementById('addMax2');
    
    const mulMin1 = document.getElementById('mulMin1');
    const mulMax1 = document.getElementById('mulMax1');
    const mulMin2 = document.getElementById('mulMin2');
    const mulMax2 = document.getElementById('mulMax2');
    
    const cooldownMinutes = document.getElementById('cooldownMinutes');
    const gamesToggleList = document.getElementById('gamesToggleList');

    let countdownInterval;

    // Default Settings
    const defaultSettings = {
        targetScore: 5,
        ops: ['+', '-', '*', '/'],
        addRange: { min1: 2, max1: 100, min2: 2, max2: 100 },
        mulRange: { min1: 2, max1: 12, min2: 2, max2: 100 },
        cooldownMinutes: 5
    };

    // Load initial state
    loadSites();
    loadSettings();
    checkCurrentSite();
    startCountdown();
    initPauseBtn();

    // Navigation
    settingsBtn.addEventListener('click', () => {
        mainView.style.display = 'none';
        settingsView.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        settingsView.style.display = 'none';
        mainView.style.display = 'block';
    });

    historyBtn.addEventListener('click', () => {
        mainView.style.display = 'none';
        historyView.style.display = 'block';
        loadHistory();
    });

    historyBackBtn.addEventListener('click', () => {
        historyView.style.display = 'none';
        mainView.style.display = 'block';
    });

    function initPauseBtn() {
        chrome.storage.local.get(['isPaused'], (result) => {
            updatePauseBtn(result.isPaused);
        });

        pauseBtn.addEventListener('click', () => {
            chrome.storage.local.get(['isPaused'], (result) => {
                const newState = !result.isPaused;
                chrome.storage.local.set({ isPaused: newState }, () => {
                    updatePauseBtn(newState);
                });
            });
        });
    }

    function updatePauseBtn(isPaused) {
        if (isPaused) {
            pauseBtn.textContent = 'Resume Blocker';
            pauseBtn.style.background = '#27ae60'; // Green
        } else {
            pauseBtn.textContent = 'Pause Blocker';
            pauseBtn.style.background = '#f39c12'; // Orange
        }
    }

    function loadHistory() {
        chrome.storage.local.get(['gameHistory'], (result) => {
            const history = result.gameHistory || [];
            historyList.innerHTML = '';

            if (history.length === 0) {
                historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No games played yet.</div>';
                return;
            }

            // Sort by date desc
            history.sort((a, b) => b.date - a.date);

            history.forEach(game => {
                const date = new Date(game.date);
                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const avgSeconds = (game.avgTime / 1000).toFixed(1);
                
                let graphHtml = '';
                if (game.questionTimes && game.questionTimes.length > 0) {
                    const maxTime = Math.max(...game.questionTimes);
                    const bars = game.questionTimes.map(t => {
                        const heightPct = (t / maxTime) * 100;
                        return `<div class="history-bar" style="height: ${heightPct}%;" title="${(t/1000).toFixed(1)}s"></div>`;
                    }).join('');
                    
                    graphHtml = `<div class="history-graph-container">${bars}</div>`;
                }

                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <div style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <div class="history-date">${dateStr}</div>
                            <div class="history-stats">${avgSeconds}s avg</div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <div class="history-score">Score: ${game.score}</div>
                        </div>
                        ${graphHtml}
                    </div>
                `;
                historyList.appendChild(item);
            });
        });
    }

    // Settings Logic
    function loadSettings() {
        chrome.storage.local.get(['gameSettings'], async (result) => {
            const settings = result.gameSettings || defaultSettings;
            await applySettingsToUI(settings);
        });
    }

    async function applySettingsToUI(settings) {
        targetScoreInput.value = settings.targetScore;
        opAdd.checked = settings.ops.includes('+');
        opSub.checked = settings.ops.includes('-');
        opMul.checked = settings.ops.includes('*');
        opDiv.checked = settings.ops.includes('/');
        
        // Handle legacy settings or missing fields gracefully
        const ar = settings.addRange || defaultSettings.addRange;
        addMin1.value = ar.min1;
        addMax1.value = ar.max1;
        addMin2.value = ar.min2;
        addMax2.value = ar.max2;
        
        const mr = settings.mulRange || defaultSettings.mulRange;
        mulMin1.value = mr.min1;
        mulMax1.value = mr.max1;
        mulMin2.value = mr.min2;
        mulMax2.value = mr.max2;
        
        cooldownMinutes.value = settings.cooldownMinutes || 5;

        // --- NEW: Render Game Toggles ---
        // We need to fetch from the NEW storage system for enabled games
        const modularSettings = await Storage.getSettings();
        const configs = Registry.getAllConfigs();
        
        gamesToggleList.innerHTML = '';
        configs.forEach(config => {
            const isEnabled = modularSettings.enabledGames[config.id] !== false; // Default true if undefined, or strictly check
            
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'space-between';
            div.style.padding = '8px';
            div.style.background = '#f5f5f5';
            div.style.borderRadius = '6px';

            div.innerHTML = `
                <span style="font-weight: 600; font-size: 14px;">${config.name}</span>
                <label class="switch" style="position: relative; display: inline-block; width: 40px; height: 20px;">
                    <input type="checkbox" data-id="${config.id}" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                    <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            `;

            // Add basic CSS for the slider inside the element logic or valid global CSS
            // For simplicity, we assume we might need to inject the style or add inline styles for the "checked" state manually in JS if CSS isn't there.
            // But let's add a style block for the switch if not present.
            
            const checkbox = div.querySelector('input');
            const slider = div.querySelector('.slider');
            
            // Initial color
            if (checkbox.checked) slider.style.backgroundColor = '#2196F3';
            if (checkbox.checked) {
                 // slider:before logic is hard with inline styles. 
                 // Let's just rely on a helper or event.
            }

            checkbox.addEventListener('change', async (e) => {
                const checked = e.target.checked;
                slider.style.backgroundColor = checked ? '#2196F3' : '#ccc';
                
                // Save immediately
                const current = await Storage.getSettings();
                current.enabledGames[config.id] = checked;
                await Storage.saveSettings(current);
            });

            // Slider knob style (pseudo-element simulation)
            const knob = document.createElement('span');
            knob.style.position = 'absolute';
            knob.style.content = '""';
            knob.style.height = '14px';
            knob.style.width = '14px';
            knob.style.left = isEnabled ? '22px' : '3px';
            knob.style.bottom = '3px';
            knob.style.backgroundColor = 'white';
            knob.style.transition = '.4s';
            knob.style.borderRadius = '50%';
            slider.appendChild(knob);

            checkbox.addEventListener('change', (e) => {
                knob.style.left = e.target.checked ? '22px' : '3px';
            });

            gamesToggleList.appendChild(div);
        });
    }

    function saveSettings() {
        const ops = [];
        if (opAdd.checked) ops.push('+');
        if (opSub.checked) ops.push('-');
        if (opMul.checked) ops.push('*');
        if (opDiv.checked) ops.push('/');

        if (ops.length === 0) return;

        const newSettings = {
            targetScore: parseInt(targetScoreInput.value) || 10,
            ops: ops,
            addRange: {
                min1: parseInt(addMin1.value) || 2,
                max1: parseInt(addMax1.value) || 100,
                min2: parseInt(addMin2.value) || 2,
                max2: parseInt(addMax2.value) || 100
            },
            mulRange: {
                min1: parseInt(mulMin1.value) || 2,
                max1: parseInt(mulMax1.value) || 12,
                min2: parseInt(mulMin2.value) || 2,
                max2: parseInt(mulMax2.value) || 100
            },
            cooldownMinutes: parseInt(cooldownMinutes.value) || 5
        };

        chrome.storage.local.set({ gameSettings: newSettings }, () => {
            startCountdown();
        });
    }

    const settingsInputs = [
        targetScoreInput, cooldownMinutes,
        opAdd, opSub, opMul, opDiv,
        addMin1, addMax1, addMin2, addMax2,
        mulMin1, mulMax1, mulMin2, mulMax2
    ];

    settingsInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', saveSettings);
            input.addEventListener('change', saveSettings);
        }
    });

    // Site Management Logic
    addBtn.addEventListener('click', () => {
        const site = siteInput.value.trim();
        if (site) {
            addSite(site);
            siteInput.value = '';
        }
    });

    siteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const site = siteInput.value.trim();
            if (site) {
                addSite(site);
                siteInput.value = '';
            }
        }
    });

    function loadSites() {
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sites = result.blockedSites || [];
            renderList(sites);
        });
    }

    function addSite(site) {
        site = site.replace(/^https?:\/\//, '').replace(/^www\./, '');
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sites = result.blockedSites || [];
            if (!sites.includes(site)) {
                sites.push(site);
                chrome.storage.local.set({ blockedSites: sites }, () => {
                    renderList(sites);
                });
            }
        });
    }

    function removeSite(site) {
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sites = result.blockedSites || [];
            const newSites = sites.filter(s => s !== site);
            chrome.storage.local.set({ blockedSites: newSites }, () => {
                renderList(newSites);
            });
        });
    }

    function renderList(sites) {
        siteList.innerHTML = '';
        sites.forEach(site => {
            const li = document.createElement('li');
            li.textContent = site;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => removeSite(site);
            li.appendChild(removeBtn);
            siteList.appendChild(li);
        });
    }

    function checkCurrentSite() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs && tabs[0] && tabs[0].url) {
                try {
                    const url = new URL(tabs[0].url);
                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                        const hostname = url.hostname.replace(/^www\./, '');
                        currentSitePreview.textContent = hostname;
                        currentSiteContainer.style.display = 'block';
                        addCurrentBtn.onclick = () => addSite(hostname);
                    }
                } catch (e) {}
            }
        });
    }

    // Countdown Logic
    resetTimerBtn.addEventListener('click', () => {
        chrome.storage.local.set({ lastCompletion: 0 }, () => {
            clearInterval(countdownInterval);
            countdownContainer.style.display = 'none';
        });
    });

    function startCountdown() {
        clearInterval(countdownInterval); // Clear existing interval if any

        chrome.storage.local.get(['lastCompletion', 'gameSettings'], (result) => {
            const lastCompletion = result.lastCompletion || 0;
            const settings = result.gameSettings || defaultSettings;
            const cooldownMs = (settings.cooldownMinutes || 5) * 60 * 1000;
            
            const updateTimer = () => {
                const now = Date.now();
                const timeRemaining = (lastCompletion + cooldownMs) - now;

                if (timeRemaining > 0) {
                    countdownContainer.style.display = 'block';
                    const minutes = Math.floor(timeRemaining / 60000);
                    const seconds = Math.floor((timeRemaining % 60000) / 1000);
                    countdownTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    countdownContainer.style.display = 'none';
                    clearInterval(countdownInterval);
                }
            };

            updateTimer(); // Run immediately
            countdownInterval = setInterval(updateTimer, 1000); // Run every second
        });
    }
});
