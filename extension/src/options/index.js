import { Storage } from '../common/storage.js';
// We need to import configs directly here, or use the registry. The registry is in content/games, which might be weird to import from options if we are strictly separating, but it's fine for this structure.
// Actually, options page is a separate entry point. It can import from ../content/games/registry.js as long as that file doesn't depend on DOM specific things that break in options page (it shouldn't).
import { Registry } from '../content/games/registry.js';

const gamesList = document.getElementById('games-list');
const enableAllBtn = document.getElementById('enableAll');
const disableAllBtn = document.getElementById('disableAll');

async function render() {
    const settings = await Storage.getSettings();
    const configs = Registry.getAllConfigs();

    gamesList.innerHTML = '';

    configs.forEach(config => {
        const div = document.createElement('div');
        div.className = 'game-item';
        div.innerHTML = `
            <div class="game-info">
                <div class="game-name">${config.name}</div>
                <div class="game-desc">${config.description}</div>
            </div>
            <label class="switch">
                <input type="checkbox" data-id="${config.id}" ${settings.enabledGames[config.id] !== false ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        `;
        gamesList.appendChild(div);
    });

    // Add listeners
    gamesList.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const enabled = e.target.checked;
            const newSettings = await Storage.getSettings();
            newSettings.enabledGames[id] = enabled;
            await Storage.saveSettings(newSettings);
        });
    });
}

enableAllBtn.addEventListener('click', async () => {
    const settings = await Storage.getSettings();
    const configs = Registry.getAllConfigs();
    configs.forEach(c => settings.enabledGames[c.id] = true);
    await Storage.saveSettings(settings);
    render();
});

disableAllBtn.addEventListener('click', async () => {
    const settings = await Storage.getSettings();
    const configs = Registry.getAllConfigs();
    configs.forEach(c => settings.enabledGames[c.id] = false);
    await Storage.saveSettings(settings);
    render();
});

render();
