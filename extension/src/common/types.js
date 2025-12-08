/**
 * @typedef {Object} GameCompletionMetrics
 * @property {number} [requiredCorrect]
 * @property {number} [timeCapSec]
 * @property {number} [bankrollFloor]
 * @property {number} [initialBankroll]
 * @property {number} [targetBankroll]
 * @property {number} [defaultBet]
 * @property {number} [lettersCount]
 * @property {number} [requiredValidWords]
 * @property {number} [minWordLength]
 * @property {number} [pairsToClear]
 * @property {number} [cupsCountDefault]
 * @property {number} [requiredCorrectRounds]
 * @property {number[]} [swapCountRange]
 */

/**
 * @typedef {Object} GameConfig
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} category
 * @property {number} estimatedTimeSec
 * @property {boolean} defaultEnabled
 * @property {GameCompletionMetrics} completionMetrics
 * @property {Object} difficultyPresets
 * @property {string} [uiHints]
 */

/**
 * @typedef {Object} UserSettings
 * @property {string[]} blockedDomains
 * @property {Object.<string, boolean>} enabledGames
 * @property {'easy' | 'medium' | 'hard'} difficulty
 */

export const Difficulty = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};
