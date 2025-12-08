/** @type {import('../../../common/types').GameConfig} */
export const config = {
    id: 'wordhunt',
    name: 'Word Hunt',
    description: 'Connect letters to form valid words.',
    category: 'Puzzle',
    estimatedTimeSec: 60,
    defaultEnabled: true,
    completionMetrics: {
        lettersCount: 5,
        requiredValidWords: 3,
        minWordLength: 3
    },
    difficultyPresets: {
        easy: { requiredValidWords: 3, minWordLength: 3 },
        medium: { requiredValidWords: 4, minWordLength: 3 },
        hard: { requiredValidWords: 5, minWordLength: 4 }
    }
};
