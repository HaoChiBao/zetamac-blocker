/** @type {import('../../../common/types').GameConfig} */

export const CONSTANTS = {
    GRID_ROWS: 2,
    GRID_COLS: 4,
    TOTAL_CARDS: 8,
    UNIQUE_LETTERS_COUNT: 4,
    LETTER_SET: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    COMPLETION_RULE: "match_all_pairs"
};

export const config = {
    id: 'pairs',
    name: 'Pairs',
    description: 'Match all pairs to unlock the page.',
    category: 'Memory',
    estimatedTimeSec: 90,
    defaultEnabled: true,
    completionMetrics: {
        pairsToClear: 4 // Derived from TOTAL_CARDS / 2
    },
    difficultyPresets: {
        // Difficulty presets might affect other things in future, 
        // but for now the spec says 2x4 grid is fixed. 
        // So we keep metrics consistent with the fixed grid.
        easy: { pairsToClear: 4 },
        medium: { pairsToClear: 4 },
        hard: { pairsToClear: 4 }
    }
};
