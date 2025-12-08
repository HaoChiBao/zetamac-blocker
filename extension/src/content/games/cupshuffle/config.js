/** @type {import('../../../common/types').GameConfig} */

export const CONSTANTS = {
    // These paths must be relative to the extension root when loaded via chrome.runtime.getURL
    CUP_IMAGE: 'images/cup.png',
    BALL_IMAGE: 'images/ping_pong_ball.png',
    
    // Animation defaults (base values, modified by speed setting)
    SWAP_DURATION_BASE_MS: 600,
    REVEAL_DURATION_MS: 500
};

export const config = {
    id: 'cupshuffle',
    name: 'Cup Shuffle',
    description: 'Keep your eye on the ball as the cups shuffle.',
    category: 'Memory',
    estimatedTimeSec: 15,
    defaultEnabled: true,
    completionMetrics: {
        cupsCount: 3,
        shuffleSpeed: 1.0,
        shuffleRounds: 5
    },
    difficultyPresets: {
        easy: { cupsCount: 3, shuffleSpeed: 0.8, shuffleRounds: 3 },
        medium: { cupsCount: 3, shuffleSpeed: 1.2, shuffleRounds: 5 },
        hard: { cupsCount: 4, shuffleSpeed: 1.5, shuffleRounds: 7 }
    }
};
