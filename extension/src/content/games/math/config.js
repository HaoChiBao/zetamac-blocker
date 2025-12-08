/** @type {import('../../../common/types').GameConfig} */
export const config = {
    id: 'math',
    name: 'Math Questions',
    description: 'A structured arithmetic gate that requires a short set of correct answers before unlocking.',
    category: 'Mental Math',
    estimatedTimeSec: 60,
    defaultEnabled: true,
    completionMetrics: {
        requiredCorrect: 5,
        timeCapSec: 60,
        missPenaltyExtraQuestion: 1
    },
    difficultyPresets: {
        easy: { requiredCorrect: 5, ops: ["add", "sub"] },
        medium: { requiredCorrect: 5, ops: ["add", "sub", "mul"] },
        hard: { requiredCorrect: 5, ops: ["add", "sub", "mul", "div"] }
    }
};
