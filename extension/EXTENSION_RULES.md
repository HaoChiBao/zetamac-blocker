# Low Key Smarter - Extension Rules & Documentation

This document serves as the primary context and source of truth for the **Low Key Smarter** Chrome extension. It details the architecture, file structure, coding standards, and the history of features implemented ("Prompts").

## 1. Project Overview

**Low Key Smarter** is a Chrome extension designed to reduce procrastination.

- **Core Functionality**: Blocks user-defined websites (e.g., twitter.com) and forces the user to play a short, cognitive mini-game to unlock the site for a set duration (cooldown).
- **Design Philosophy**: "Low Key" but "Sleek". Using Shadow DOM for isolation, vanilla CSS for performance, and a modular architecture for extensibility.

## 2. File Structure & Architecture

The project uses a monolithic `extension/` folder structure but with strict modular separation within `src/`.

```
extension/
├── manifest.json             # Extension Entry Point (MV3)
├── images/                   # Assets (cup.png, ball.png)
└── src/
    ├── common/               # Shared Utilities
    │   ├── types.js          # JSDoc Type Definitions
    │   ├── storage.js        # Wrapper for chrome.storage (Deep Merge Logic)
    │   └── random.js         # Random helpers (pickRandom, distinctPair)
    │
    ├── content/              # Content Scripts (Runs on Webpages)
    │   ├── loader.js         # Entry point (imports index.js)
    │   ├── index.js          # Bootstrapper (creates GateController)
    │   ├── overlay/          # UI Logic
    │   │   ├── gateOverlay.js    # Shadow DOM UI Manager
    │   │   └── overlay.css       # Inline/File styles
    │   ├── gating/           # Business Logic
    │   │   ├── gateController.js # Orchestrator (Check URL -> Show Game -> Unlock)
    │   │   └── sessionManager.js # Manages Cooldown/Expiry
    │   └── games/            # Modular Game System
    │       ├── registry.js       # Central Registry of all games
    │       ├── Game.js           # Base Class
    │       ├── math/             # Math Game Module
    │       ├── pairs/            # Pairs (Memory) Module
    │       ├── cupshuffle/       # Cup Shuffle Module
    │       └── [new_game]/       # Future games go here
    │
    ├── popup/                # Extension Popup UI
    │   ├── index.html        # Views: Main, Settings, GameSpecificSettings
    │   ├── style.css         # Popup Styling
    │   └── script.js         # Popup Logic (Settings UI, Navigation)
    └── options/              # (Optional) Full page settings
```

## 3. The Game Module System

To allow infinite expandability, games are **modular**.

### **Anatomy of a Game**

Each game lives in `src/content/games/[gameId]/` and must have:

1.  **`config.js`**: Metadata and Default Settings.
    ```javascript
    export const config = {
        id: 'mygame',
        name: 'My Game',
        defaultEnabled: true,
        completionMetrics: { diff: 1, ... } // Default settings
    };
    ```
2.  **`stub.js`**: The Game Logic. Must extend the base `Game` class.
    ```javascript
    import { Game } from "../../Game.js";
    export class MyGame extends Game {
      render(container, context) {
        // Build UI into container
        // Call context.onComplete({ passed: true, meta: ... }) when done
      }
    }
    ```

## 6. Comprehensive Guide: How to Add a New Game

Follow these exact steps to add a new game module (e.g., "Space Invaders").

### **Step 1: Create the Game Module**

Create a folder: `src/content/games/spaceinvaders/`.

**A. Create `config.js`**
Defines the game's metadata and **default settings**.

```javascript
export const config = {
  id: "spaceinvaders", // Unique ID
  name: "Space Invaders", // Display Name
  description: "Shoot the aliens.",
  defaultEnabled: true,
  // These keys become available in chrome.storage.local.gameSettings.spaceinvaders
  completionMetrics: {
    scoreToWin: 500,
    enemySpeed: 1.0,
    shipLives: 3,
  },
};
```

**B. Create `stub.js`**
The game logic. Must extend `Game`.

```javascript
import { Game } from "../../Game.js";

export class SpaceInvaders extends Game {
  /**
   * @param {HTMLElement} container - The DOM element to render into.
   * @param {Object} context - { config, onComplete }
   */
  render(container, context) {
    this.config = context.config; // Access settings (e.g., this.config.scoreToWin)

    // 1. Render UI (use Shadow DOM friendly styles)
    container.innerHTML = `<div id="game-canvas">...</div>`;
    const style = document.createElement("style");
    style.textContent = `...css...`;
    container.appendChild(style);

    // 2. Game Logic ...
    // Use this.config.enemySpeed to adjust difficulty.

    // 3. On Win/Loss
    // Meta data is displayed on the completion screen.
    context.onComplete({
      passed: true,
      meta: { score: 1000, livesLeft: 2 },
    });
  }
}
```

### **Step 2: Register the Game**

Open `src/content/games/registry.js`.

1.  Import your module.
2.  Add it to the export list.

```javascript
// ... other imports
import * as SpaceInvaders from "./spaceinvaders/config.js";
import { SpaceInvaders as SpaceInvadersGame } from "./spaceinvaders/stub.js";

export const games = {
  // ...
  spaceinvaders: { config: SpaceInvaders.config, factory: SpaceInvadersGame },
};
```

### **Step 3: Update Storage Logic (Optional)**

- **Automatic**: `src/common/storage.js` -> `getSettings()` automatically deep-merges the `completionMetrics` from your `config.js` into the user's stored settings.
- **Result**: You do **NOT** need to edit `storage.js` manualy. The defaults in `config.js` act as the source of truth if the user hasn't saved overrides yet.

### **Step 4: Add Settings to Popup UI**

Users need to be able to edit `scoreToWin` or `enemySpeed`.

**A. Edit `src/popup/index.html`**

1.  Create a "Settings View" `div` (hidden by default).
2.  Add a Back button and Inputs.
3.  **Crucial**: Use unique IDs for inputs.

```html
<!-- SPACE INVADERS SETTINGS VIEW -->
<div id="spaceInvadersSettingsView" style="display: none">
  <div class="header-row">
    <button id="spaceInvadersBackBtn" class="icon-btn">←</button>
    <h1>Space Invaders</h1>
  </div>
  <div class="settings-section">
    <div class="setting-item">
      <label>Score to Win</label>
      <input type="number" id="siTargetScore" value="500" />
    </div>
  </div>
</div>
```

**B. Edit `src/popup/script.js`**

1.  **Selectors**: Get references to your new View and Inputs.
2.  **Navigation**: Add logic to `showView()` or button clicks to toggle `#spaceInvadersSettingsView`.
    - _Note_: The "Playable Games" list in the main settings is auto-generated. You just need to handle the click on the "Gear" icon for your game.
    - In `renderGamesList()`, ensure your game ID maps to opening your new view.
3.  **Load Settings**: In `loadSettings()`, set input values from storage.
    ```javascript
    // config.spaceinvaders is safe because of deep merge
    document.getElementById("siTargetScore").value =
      settings.gameSettings.spaceinvaders.scoreToWin;
    ```
4.  **Save Settings**: Add listeners to inputs.
    ```javascript
    document.getElementById("siTargetScore").addEventListener("change", (e) => {
      saveGameSetting("spaceinvaders", "scoreToWin", parseInt(e.target.value));
    });
    ```
    - `saveGameSetting` is a helper in `script.js` that handles the `chrome.storage.local.set` logic for you.

### **Step 5: Verify & Test**

1.  **Reload Extension**: Go to `chrome://extensions` -> Reload.
2.  **Check Defaults**: Open Popup -> Settings -> Space Invaders. Do you see "500"?
3.  **Edit**: Change it to "1000".
4.  **Run**: Go to a blocked site. The `GateController` will load your game.
    - `this.config` in your `stub.js` should now have `{ scoreToWin: 1000 }`.

## 7. Reusing Code & Best Practices

- **Randomness**: Always use `import { pickRandom, randomInt } from '../../common/random.js'`, never `Math.random()` directly if seedable consistency matters (or just for cleaner code).
- **Styling**:
  - Use `overlay.css` rules for shared containers.
  - **Shadow DOM**: Your game is isolated. You must inject your own `<style>` into the container passed to `render()`.
- **Assets**:
  - Put images in `extension/images/`.
  - Reference them via `chrome.runtime.getURL('images/file.png')`.
  - **CRITICAL**: Add `images/*.png` to `web_accessible_resources` in `manifest.json`.

```

```
