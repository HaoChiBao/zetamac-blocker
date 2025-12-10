import * as MathGame from './math/stub.js';
import * as MathConfig from './math/config.js';
import * as BlackjackGame from './blackjack/stub.js';
import * as BlackjackConfig from './blackjack/config.js';
import * as WordHuntGame from './wordhunt/stub.js';
import * as WordHuntConfig from './wordhunt/config.js';
import * as PairsGame from './pairs/stub.js';
import * as PairsConfig from './pairs/config.js';
import * as CupShuffleGame from './cupshuffle/stub.js';
import * as CupShuffleConfig from './cupshuffle/config.js';
import * as CodeChallengeGame from './codechallenge/stub.js';
import * as CodeChallengeConfig from './codechallenge/config.js';

const games = {
    [MathConfig.config.id]: { factory: MathGame.createGame, config: MathConfig.config },
    [BlackjackConfig.config.id]: { factory: BlackjackGame.createGame, config: BlackjackConfig.config },
    [WordHuntConfig.config.id]: { factory: WordHuntGame.createGame, config: WordHuntConfig.config },
    [PairsConfig.config.id]: { factory: PairsGame.createGame, config: PairsConfig.config },
    [CupShuffleConfig.config.id]: { factory: CupShuffleGame.createGame, config: CupShuffleConfig.config },
    [CodeChallengeConfig.config.id]: { factory: CodeChallengeGame.createGame, config: CodeChallengeConfig.config }
};

export const Registry = {
    getAllConfigs: () => Object.values(games).map(g => g.config),
    getGame: (id) => games[id],
    getEnabledGames: (enabledMap) => {
        return Object.values(games)
            .filter(g => enabledMap[g.config.id] !== false) // Default true
            .map(g => g.config);
    }
};
