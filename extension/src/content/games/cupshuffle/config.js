/** @type {import('../../../common/types').GameConfig} */
export const config = {
    id: 'cupshuffle',
    name: 'Cup Shuffle',
    description: 'Follow the hidden item as cups swap.',
    category: 'Attention',
    estimatedTimeSec: 30,
    defaultEnabled: true,
    completionMetrics: {
        cupsCountDefault: 3,
        requiredCorrectRounds: 1,
        swapCountRange: [2, 5]
    },
    difficultyPresets: {
        easy: { cupsCount: 3, swapCount: 2, requiredCorrectRounds: 1 },
        medium: { cupsCount: 3, swapCount: 4, requiredCorrectRounds: 1 },
        hard: { cupsCount: 4, swapCount: 6, requiredCorrectRounds: 2 }
    }
};
