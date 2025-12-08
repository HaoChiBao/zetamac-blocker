import { Game } from '../Game.js';
import { config } from './config.js';

export class CupShuffleGame extends Game {
    constructor(metrics) {
        super(config, metrics);
    }
}

export function createGame(metrics) {
    return new CupShuffleGame(metrics);
}
