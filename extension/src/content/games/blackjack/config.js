/** @type {import('../../../common/types').GameConfig} */
export const config = {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'Reach the target bankroll by playing Simplified Blackjack.',
    category: 'Card Game',
    estimatedTimeSec: 120,
    defaultEnabled: true,
    completionMetrics: {
        bankrollFloor: 100,
        initialBankroll: 100,
        targetBankroll: 150,
        defaultBet: 10,
        dealerHitsTo: 16,
        dealerStandsOn: 17,
        allowSplit: false,
        allowDouble: false
    },
    difficultyPresets: {
        easy: { targetBankroll: 140, defaultBet: 10 },
        medium: { targetBankroll: 150, defaultBet: 10 },
        hard: { targetBankroll: 170, defaultBet: 10 }
    }
};
