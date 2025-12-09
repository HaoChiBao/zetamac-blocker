import { Storage } from '../common/storage.js';
import { Registry } from '../content/games/registry.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Views
    const views = {
        main: document.getElementById('mainView'),
        settings: document.getElementById('settingsView'),
        history: document.getElementById('historyView'),
        math: document.getElementById('mathSettingsView'),
        pairs: document.getElementById('pairsSettingsView'),
        cupshuffle: document.getElementById('cupShuffleSettingsView')
    };
    
    // Navigation Buttons
    const nav = {
        settingsBtn: document.getElementById('settingsBtn'),
        historyBtn: document.getElementById('historyBtn'),
        
        settingsBackBtn: document.getElementById('settingsBackBtn'),
        historyBackBtn: document.getElementById('historyBackBtn'),
        
        mathBackBtn: document.getElementById('mathBackBtn'),
        pairsBackBtn: document.getElementById('pairsBackBtn'),
        cupShuffleBackBtn: document.getElementById('cupShuffleBackBtn'),

        resetMathBtn: document.getElementById('resetMathBtn'),
        resetPairsBtn: document.getElementById('resetPairsBtn'),
        resetCupShuffleBtn: document.getElementById('resetCupShuffleBtn')
    };

    // Main Inputs
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
    const cooldownMinutes = document.getElementById('cooldownMinutes');
    const gamesListContainer = document.getElementById('gamesList');

    // Math Settings Inputs
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

    // Pairs Settings Inputs
    const pairsDifficulty = document.getElementById('pairsDifficulty');

    // Cup Shuffle Inputs
    const cupsCount = document.getElementById('cupsCount');
    const cupsCountVal = document.getElementById('cupsCountVal');
    const shuffleSpeed = document.getElementById('shuffleSpeed');
    const shuffleSpeedVal = document.getElementById('shuffleSpeedVal');
    const shuffleRounds = document.getElementById('shuffleRounds');
    const shuffleRoundsVal = document.getElementById('shuffleRoundsVal');

    // State
    const defaultSettings = {
        cooldownMinutes: 5,
        math: {
            targetScore: 5,
            ops: ['+', '-', '*', '/'],
            addRange: { min1: 2, max1: 100, min2: 2, max2: 100 },
            mulRange: { min1: 2, max1: 12, min2: 2, max2: 100 }
        },
        pairs: {
            pairsToClear: 4
        },
        cupshuffle: {
            cupsCount: 3,
            shuffleSpeed: 1.0,
            shuffleRounds: 5
        }
    };
    
    let countdownInterval;

    // Initialization
    loadSites();
    await loadSettings();
    checkCurrentSite();
    startCountdown();
    initPauseBtn();

    // --- Navigation Logic ---
    function showView(viewName) {
        Object.values(views).forEach(el => el.style.display = 'none');
        if (views[viewName]) views[viewName].style.display = 'block';
    }

    nav.settingsBtn.addEventListener('click', () => showView('settings'));
    nav.historyBtn.addEventListener('click', () => { showView('history'); loadHistory(); });
    
    nav.settingsBackBtn.addEventListener('click', () => showView('main'));
    nav.historyBackBtn.addEventListener('click', () => showView('main'));
    
    nav.mathBackBtn.addEventListener('click', () => showView('settings'));
    nav.pairsBackBtn.addEventListener('click', () => showView('settings'));
    nav.cupShuffleBackBtn.addEventListener('click', () => showView('settings'));


    // --- Settings Logic ---
    
    async function loadSettings() {
        const result = await chrome.storage.local.get(['gameSettings']);
        const stored = result.gameSettings || {};
        
        // Global
        cooldownMinutes.value = stored.cooldownMinutes || defaultSettings.cooldownMinutes;

        // Math
        const mathSettings = stored.math || {};
        targetScoreInput.value = mathSettings.targetScore || stored.targetScore || defaultSettings.math.targetScore;
        const ops = mathSettings.ops || stored.ops || defaultSettings.math.ops;
        opAdd.checked = ops.includes('+');
        opSub.checked = ops.includes('-');
        opMul.checked = ops.includes('*');
        opDiv.checked = ops.includes('/');

        const ar = mathSettings.addRange || stored.addRange || defaultSettings.math.addRange;
        addMin1.value = ar.min1; addMax1.value = ar.max1;
        addMin2.value = ar.min2; addMax2.value = ar.max2;

        const mr = mathSettings.mulRange || stored.mulRange || defaultSettings.math.mulRange;
        mulMin1.value = mr.min1; mulMax1.value = mr.max1;
        mulMin2.value = mr.min2; mulMax2.value = mr.max2;

        // Pairs
        const pairsSettings = stored.pairs || {};
        pairsDifficulty.value = pairsSettings.pairsToClear || defaultSettings.pairs.pairsToClear;

        // Cup Shuffle
        // Ensure defaults are applied locally if stored is missing key
        const cs = stored.cupshuffle || {};
        cupsCount.value = cs.cupsCount || defaultSettings.cupshuffle.cupsCount;
        shuffleSpeed.value = cs.shuffleSpeed || defaultSettings.cupshuffle.shuffleSpeed;
        shuffleRounds.value = cs.shuffleRounds || defaultSettings.cupshuffle.shuffleRounds;
        
        // Update display labels
        updateCupLabels();

        // Render Game List
        renderGameList();
    }

    function updateCupLabels() {
        cupsCountVal.textContent = cupsCount.value;
        shuffleSpeedVal.textContent = shuffleSpeed.value;
        shuffleRoundsVal.textContent = shuffleRounds.value;
    }

    async function saveSettings() {
        // Update labels purely visual
        updateCupLabels();

        const ops = [];
        if (opAdd.checked) ops.push('+');
        if (opSub.checked) ops.push('-');
        if (opMul.checked) ops.push('*');
        if (opDiv.checked) ops.push('/');

        // Reconstruct the full object
        const newSettings = {
            cooldownMinutes: parseInt(cooldownMinutes.value) || 5,
            
            math: {
                targetScore: parseInt(targetScoreInput.value) || 5,
                ops: ops,
                addRange: {
                    min1: parseInt(addMin1.value) || 2, max1: parseInt(addMax1.value) || 100,
                    min2: parseInt(addMin2.value) || 2, max2: parseInt(addMax2.value) || 100
                },
                mulRange: {
                    min1: parseInt(mulMin1.value) || 2, max1: parseInt(mulMax1.value) || 12,
                    min2: parseInt(mulMin2.value) || 2, max2: parseInt(mulMax2.value) || 100
                }
            },
            
            pairs: {
                pairsToClear: parseInt(pairsDifficulty.value) || 4
            },

            cupshuffle: {
                cupsCount: parseInt(cupsCount.value) || 3,
                shuffleSpeed: parseFloat(shuffleSpeed.value) || 1.0,
                shuffleRounds: parseInt(shuffleRounds.value) || 5
            },
            
            // Preserve Enabled Games
            enabledGames: (await Storage.getSettings()).enabledGames || {} 
        };

        await Storage.saveSettings(newSettings);
        
        startCountdown(); 
    }

    // --- Modal Logic ---
    const modal = {
        overlay: document.getElementById('modalOverlay'),
        message: document.getElementById('modalMessage'),
        confirmBtn: document.getElementById('modalConfirmBtn'),
        cancelBtn: document.getElementById('modalCancelBtn')
    };

    function showConfirmModal(msg, onConfirm) {
        modal.message.textContent = msg;
        modal.overlay.style.display = 'flex';
        
        const cleanup = () => {
            modal.overlay.style.display = 'none';
            modal.confirmBtn.onclick = null;
            modal.cancelBtn.onclick = null;
        };

        modal.confirmBtn.onclick = () => {
            cleanup();
            onConfirm();
        };

        modal.cancelBtn.onclick = () => {
            cleanup();
        };
    }

    // --- Reset Logic ---
    nav.resetMathBtn.addEventListener('click', () => {
        showConfirmModal('Reset Math settings to default?', async () => {
            const defaults = Storage.defaultSettings.math;
            
            targetScoreInput.value = defaults.targetScore;
            opAdd.checked = defaults.ops.includes('+');
            opSub.checked = defaults.ops.includes('-');
            opMul.checked = defaults.ops.includes('*');
            opDiv.checked = defaults.ops.includes('/');
            
            addMin1.value = defaults.addRange.min1; addMax1.value = defaults.addRange.max1;
            addMin2.value = defaults.addRange.min2; addMax2.value = defaults.addRange.max2;
            mulMin1.value = defaults.mulRange.min1; mulMax1.value = defaults.mulRange.max1;
            mulMin2.value = defaults.mulRange.min2; mulMax2.value = defaults.mulRange.max2;
            
            await saveSettings();
        });
    });

    nav.resetPairsBtn.addEventListener('click', () => {
        showConfirmModal('Reset Pairs settings to default?', async () => {
            pairsDifficulty.value = Storage.defaultSettings.pairs.pairsToClear;
            await saveSettings();
        });
    });

    nav.resetCupShuffleBtn.addEventListener('click', () => {
        showConfirmModal('Reset Cup Shuffle settings to default?', async () => {
            const defaults = Storage.defaultSettings.cupshuffle;
            cupsCount.value = defaults.cupsCount;
            shuffleSpeed.value = defaults.shuffleSpeed;
            shuffleRounds.value = defaults.shuffleRounds;
            await saveSettings();
        });
    });

    // Attach Listeners to ALL inputs
    const allInputs = [
        cooldownMinutes, targetScoreInput, 
        opAdd, opSub, opMul, opDiv,
        addMin1, addMax1, addMin2, addMax2,
        mulMin1, mulMax1, mulMin2, mulMax2,
        pairsDifficulty,
        cupsCount, shuffleSpeed, shuffleRounds
    ];
    
    allInputs.forEach(el => {
        el.addEventListener('change', saveSettings);
        el.addEventListener('input', saveSettings);
    });


    // --- Game List Logic ---
    async function renderGameList() {
        const modularSettings = await Storage.getSettings();
        const configs = Registry.getAllConfigs();
        
        gamesListContainer.innerHTML = '';
        
        configs.forEach(config => {
            const isEnabled = modularSettings.enabledGames[config.id] !== false; 
            
            // Container
            const row = document.createElement('div');
            row.className = 'game-list-row';
            row.style.cssText = `
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                padding: 12px; 
                background: #f9f9f9; 
                border-radius: 8px; 
                cursor: pointer;
                transition: background 0.2s;
            `;
            row.onmouseover = () => row.style.background = '#f0f0f0';
            row.onmouseout = () => row.style.background = '#f9f9f9';

            // Left: Toggle
            const toggleContainer = document.createElement('div');
            toggleContainer.onclick = (e) => e.stopPropagation(); // Prevents nav click
            
            const label = document.createElement('label');
            label.className = 'switch';
            label.style.cssText = 'position: relative; display: inline-block; width: 40px; height: 20px; margin-right: 12px;';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = isEnabled;
            input.style.cssText = 'opacity: 0; width: 0; height: 0;';
            
            const slider = document.createElement('span');
            slider.className = 'slider';
            slider.style.cssText = `
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
                background-color: ${isEnabled ? '#2196F3' : '#ccc'}; 
                transition: .4s; border-radius: 34px;
            `;
            
            const knob = document.createElement('span');
            knob.style.cssText = `
                position: absolute; content: ""; height: 14px; width: 14px; 
                left: ${isEnabled ? '22px' : '3px'}; bottom: 3px; 
                background-color: white; transition: .4s; border-radius: 50%;
            `;
            slider.appendChild(knob);
            
            label.appendChild(input);
            label.appendChild(slider);
            toggleContainer.appendChild(label);
            
            // EventListener for Toggle
            input.addEventListener('change', async (e) => {
                e.stopPropagation(); // Double safety
                const checked = e.target.checked;
                slider.style.backgroundColor = checked ? '#2196F3' : '#ccc';
                knob.style.left = checked ? '22px' : '3px';
                
                const current = await Storage.getSettings();
                current.enabledGames[config.id] = checked;
                await Storage.saveSettings(current);
            });


            // Middle: Info
            const info = document.createElement('div');
            info.style.cssText = 'flex: 1;';
            info.innerHTML = `
                <div style="font-weight: 600; font-size: 15px; color: #333;">${config.name}</div>
                <div style="font-size: 12px; color: #666; margin-top: 2px;">${config.description}</div>
            `;

            // Right: Chevron
            const chevron = document.createElement('div');
            chevron.textContent = '›';
            chevron.style.cssText = 'font-size: 20px; color: #999; margin-left: 10px; font-weight: 300;';

            
            // Assemble
            row.appendChild(toggleContainer);
            row.appendChild(info);
            row.appendChild(chevron);
            
            // Row Click -> Nav
            row.addEventListener('click', () => {
                if (config.id === 'math') showView('math');
                else if (config.id === 'pairs') showView('pairs');
                else if (config.id === 'cupshuffle') showView('cupshuffle');
                else alert('Settings not yet available for ' + config.name);
            });

            gamesListContainer.appendChild(row);
        });
    }


    // --- Other Logic (Site List, Pause, History, Countdown) ---
    function initPauseBtn() {
        chrome.storage.local.get(['isPaused'], (result) => updatePauseBtn(result.isPaused));
        pauseBtn.addEventListener('click', () => {
            chrome.storage.local.get(['isPaused'], (result) => {
                const newState = !result.isPaused;
                chrome.storage.local.set({ isPaused: newState }, () => updatePauseBtn(newState));
            });
        });
    }

    function updatePauseBtn(isPaused) {
        if (isPaused) {
            pauseBtn.textContent = 'Resume Blocker';
            pauseBtn.style.background = '#27ae60';
        } else {
            pauseBtn.textContent = 'Pause Blocker';
            pauseBtn.style.background = '#f39c12';
        }
    }

    // Site Management
    addBtn.addEventListener('click', () => addSite(siteInput.value.trim()));
    siteInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addSite(siteInput.value.trim()); });
    
    function loadSites() {
        chrome.storage.local.get(['blockedSites'], (result) => renderSiteList(result.blockedSites || []));
    }
    
    function addSite(site) {
        if (!site) return;
        site = site.replace(/^https?:\/\//, '').replace(/^www\./, '');
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sites = result.blockedSites || [];
            if (!sites.includes(site)) {
                sites.push(site);
                chrome.storage.local.set({ blockedSites: sites }, () => {
                    renderSiteList(sites);
                    siteInput.value = '';
                });
            }
        });
    }

    function removeSite(site) {
        chrome.storage.local.get(['blockedSites'], (result) => {
            const sites = result.blockedSites || [];
            const newSites = sites.filter(s => s !== site);
            chrome.storage.local.set({ blockedSites: newSites }, () => renderSiteList(newSites));
        });
    }

    function renderSiteList(sites) {
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
                    if (['http:', 'https:'].includes(url.protocol)) {
                        const hostname = url.hostname.replace(/^www\./, '');
                        currentSitePreview.textContent = hostname;
                        currentSiteContainer.style.display = 'block';
                        addCurrentBtn.onclick = () => addSite(hostname);
                    }
                } catch (e) {}
            }
        });
    }

    // History
    const historyList = document.getElementById('historyList');
    function loadHistory() {
        chrome.storage.local.get(['gameHistory'], (result) => {
            const history = result.gameHistory || [];
            historyList.innerHTML = '';
            if (history.length === 0) {
                historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No games played yet.</div>';
                return;
            }
            history.sort((a, b) => b.date - a.date);
            history.forEach(game => {
                const date = new Date(game.date);
                const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `<div><div class="history-date">${dateStr}</div><div class="history-score">Score/Time: ${game.score || game.totalTime}</div></div>`;
                historyList.appendChild(item);
            });
        });
    }

    // Countdown
    resetTimerBtn.addEventListener('click', () => {
        chrome.storage.local.set({ sessionExpiry: 0 }, () => {
            clearInterval(countdownInterval);
            countdownContainer.style.display = 'none';
        });
    });

    function startCountdown() {
        clearInterval(countdownInterval);
        chrome.storage.local.get(['sessionExpiry'], (result) => {
            const expiry = result.sessionExpiry || 0;
            const updateTimer = () => {
                const now = Date.now();
                const timeRemaining = expiry - now;
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
            updateTimer();
            countdownInterval = setInterval(updateTimer, 1000);
        });
    }
});
