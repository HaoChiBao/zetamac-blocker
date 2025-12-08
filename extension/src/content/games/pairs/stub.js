import { Game } from '../Game.js';
import { config, CONSTANTS } from './config.js';
import { pickRandom } from '../../../common/random.js'; // Assuming relative path correct

const STYLES = `
.pairs-game-container {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', sans-serif;
}

.pairs-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #000;
}

.pairs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 columns */
    gap: 15px;
    margin-bottom: 30px;
    width: 100%;
    max-width: 400px;
}

.card {
    aspect-ratio: 0.75;
    background-color: #333; /* Face down color */
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    color: white;
    user-select: none;
    transition: transform 0.3s, background-color 0.3s;
    transform-style: preserve-3d;
}

.card.face-up {
    background-color: #fff; /* Face up color */
    color: #000;
    border: 2px solid #000;
    transform: rotateY(180deg);
}

.card.matched {
    background-color: #eee;
    color: #ccc;
    border-color: #ccc;
    cursor: default;
}

.pairs-status {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
}

.pairs-reset-btn {
    padding: 10px 20px;
    background-color: transparent;
    color: #666;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.pairs-reset-btn:hover {
    background-color: #f5f5f5;
    color: #333;
}
`;

export class PairsGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        console.log('!!! MATCHING PAIRS GAME UPDATED CODE LOADED !!!');
        console.log('[PairsGame] Constructor called with metrics:', metrics);
        this.board = [];
        this.cards = []; // DOM elements
        this.firstSelectedIndex = null;
        this.secondSelectedIndex = null;
        this.isLocked = false;
        this.matchedPairs = 0;
        this.moves = 0;
    }

    render(container, context) {
        console.log('[PairsGame] Render called. Container:', container);
        this.container = container;
        this.context = context;

        // Inject Styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        // Build UI structure
        const gameDiv = document.createElement('div');
        gameDiv.className = 'pairs-game-container';
        gameDiv.innerHTML = `
            <div class="pairs-title">${this.config.name}</div>
            <div class="pairs-status">Pairs matched: 0 / ${CONSTANTS.UNIQUE_LETTERS_COUNT}</div>
            <div class="pairs-grid"></div>
            <button class="pairs-reset-btn">Reset Board</button>
        `;
        container.appendChild(gameDiv);

        this.gridEl = gameDiv.querySelector('.pairs-grid');
        this.statusEl = gameDiv.querySelector('.pairs-status');
        this.resetBtn = gameDiv.querySelector('.pairs-reset-btn');

        this.resetBtn.addEventListener('click', () => this.startNewGame());

        this.startNewGame();
    }

    startNewGame() {
        // Reset State
        this.firstSelectedIndex = null;
        this.secondSelectedIndex = null;
        this.isLocked = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.updateStatus();

        // Generate Board Logic
        // Create pairs: A, A, B, B, etc.
        const letters = [];
        for (let i = 0; i < CONSTANTS.UNIQUE_LETTERS_COUNT; i++) {
            const char = CONSTANTS.LETTER_SET[i];
            letters.push(char, char);
        }
        
        // Shuffle
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        this.board = letters.map((char, index) => ({
            id: index,
            value: char,
            isFlipped: false,
            isMatched: false
        }));

        this.renderBoard();
    }

    renderBoard() {
        this.gridEl.innerHTML = '';
        this.cards = [];

        this.board.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;
            // Initially face down (empty content visually, or handled by class)
            // We use class 'face-up' to show content
            
            cardEl.addEventListener('click', () => this.handleCardClick(index));
            this.gridEl.appendChild(cardEl);
            this.cards.push(cardEl);
        });
    }

    handleCardClick(index) {
        if (this.isLocked) return;
        
        const card = this.board[index];
        // Prevent clicking already flipped or matched cards
        if (card.isFlipped || card.isMatched) return;

        // Flip logic
        this.flipCard(index, true);

        if (this.firstSelectedIndex === null) {
            // First card
            this.firstSelectedIndex = index;
        } else {
            // Second card
            this.secondSelectedIndex = index;
            this.moves++;
            this.checkForMatch();
        }
    }

    flipCard(index, isFaceUp) {
        const card = this.board[index];
        const el = this.cards[index];
        
        card.isFlipped = isFaceUp;
        if (isFaceUp) {
            el.classList.add('face-up');
            el.textContent = card.value;
        } else {
            el.classList.remove('face-up');
            el.textContent = '';
        }
    }

    checkForMatch() {
        const first = this.board[this.firstSelectedIndex];
        const second = this.board[this.secondSelectedIndex];

        if (first.value === second.value) {
            // Match!
            first.isMatched = true;
            second.isMatched = true;
            this.cards[this.firstSelectedIndex].classList.add('matched');
            this.cards[this.secondSelectedIndex].classList.add('matched');
            
            this.matchedPairs++;
            this.updateStatus();
            
            this.firstSelectedIndex = null;
            this.secondSelectedIndex = null;

            if (this.matchedPairs === CONSTANTS.UNIQUE_LETTERS_COUNT) {
                setTimeout(() => {
                    this.context.onComplete({ 
                        passed: true, 
                        meta: { moves: this.moves, matchedPairs: this.matchedPairs } 
                    });
                }, 500); // Short delay to see the last match
            }
        } else {
            // No Match
            this.isLocked = true;
            setTimeout(() => {
                this.flipCard(this.firstSelectedIndex, false);
                this.flipCard(this.secondSelectedIndex, false);
                this.firstSelectedIndex = null;
                this.secondSelectedIndex = null;
                this.isLocked = false;
            }, 1000); // 1s delay to see cards
        }
    }

    updateStatus() {
        this.statusEl.textContent = `Pairs matched: ${this.matchedPairs} / ${CONSTANTS.UNIQUE_LETTERS_COUNT}`;
    }

    destroy() {
        this.container = null;
        this.cards = [];
        this.board = [];
    }
}

export function createGame(metrics) {
    return new PairsGame(metrics);
}
