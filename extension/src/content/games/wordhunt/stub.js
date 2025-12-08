import { Game } from '../Game.js';
import { config } from './config.js';

export class WordHuntGame extends Game {
    constructor(metrics) {
        super(config, metrics);
    }
}

export function createGame(metrics) {
    return new WordHuntGame(metrics);
}
