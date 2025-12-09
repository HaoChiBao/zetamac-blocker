/** @type {import('../../../common/types').GameConfig} */
export const config = {
    id: 'wordhunt',
    name: 'Word Hunt',
    description: 'Find words by connecting letters in the circle.',
    category: 'Word Puzzle',
    estimatedTimeSec: 45,
    defaultEnabled: true,
    completionMetrics: {
        targetWords: 3
    },
    difficultyPresets: {
        easy: { targetWords: 3 },
        medium: { targetWords: 5 },
        hard: { targetWords: 7 }
    }
};
