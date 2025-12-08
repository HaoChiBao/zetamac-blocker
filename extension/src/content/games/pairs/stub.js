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
    justify-content: center;
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

/* Un-mirror the text content when the card is flipped */
.card-content {
    transform: rotateY(180deg);
    display: inline-block;
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
        this.mistakes = 0;
        this.startTime = 0;
        this.isPreviewing = false;
    }

    render(container, context) {
        console.log('[PairsGame] Render called. Container:', container);
        this.container = container;
        this.context = context;

        // Inject Styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        const pairsCount = this.metrics.pairsToClear || 4;
        
        // Build UI structure
        const gameDiv = document.createElement('div');
        gameDiv.className = 'pairs-game-container';
        gameDiv.innerHTML = `
            <div class="pairs-title">${this.config.name}</div>
            <div class="pairs-status">Pairs matched: 0 / ${pairsCount}</div>
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
        this.mistakes = 0;
        this.startTime = Date.now();
        this.isPreviewing = true; // Start in preview mode
        this.updateStatus();

        // Generate Board Logic
        // Create pairs: A, A, B, B, etc.
        const pairsCount = this.metrics.pairsToClear || 4;
        const letters = [];
        for (let i = 0; i < pairsCount; i++) {
            const char = CONSTANTS.LETTER_SET[i % CONSTANTS.LETTER_SET.length];
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
        this.startPreview();
    }

    startPreview() {
        // Show all cards face up visually (logic state remains isFlipped: false for game purposes)
        this.cards.forEach((el, index) => {
            el.classList.add('face-up');
            el.innerHTML = `<span class="card-content">${this.board[index].value}</span>`;
        });

        // After delay, flip back
        setTimeout(() => {
            if (!this.container) return; // Guard if destroyed
            this.cards.forEach(el => {
                el.classList.remove('face-up');
                el.textContent = '';
            });
            this.isPreviewing = false;
            this.startTime = Date.now(); // Reset start time so preview doesn't count
        }, 2000);
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
        if (this.isLocked || this.isPreviewing) return;
        
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
            // Wait for flip animation interaction before checking match logic visuals
            // OR check immediately but delay the "matched" state
            this.checkForMatch(); 
        }
    }

    flipCard(index, isFaceUp) {
        const card = this.board[index];
        const el = this.cards[index];
        
        card.isFlipped = isFaceUp;
        if (isFaceUp) {
            el.classList.add('face-up');
            // Wrap text in a span that un-mirrors it
            el.innerHTML = `<span class="card-content">${card.value}</span>`;
        } else {
            el.classList.remove('face-up');
            el.textContent = '';
        }
    }

    checkForMatch() {
        // Lock immediately to prevent 3rd card click
        this.isLocked = true;

        const first = this.board[this.firstSelectedIndex];
        const second = this.board[this.secondSelectedIndex];

        if (first.value === second.value) {
            // Match found!
            // Wait for the flip animation (300ms) plus a beat (200ms) = 500ms
            setTimeout(() => {
                first.isMatched = true;
                second.isMatched = true;
                this.cards[this.firstSelectedIndex].classList.add('matched');
                this.cards[this.secondSelectedIndex].classList.add('matched');
                
                this.matchedPairs++;
                this.updateStatus();
                
                this.firstSelectedIndex = null;
                this.secondSelectedIndex = null;
                this.isLocked = false;

                if (this.matchedPairs === this.metrics.pairsToClear) {
                const endTime = Date.now();
                const totalTime = ((endTime - this.startTime) / 1000).toFixed(1) + 's';
                
                setTimeout(() => {
                    this.context.onComplete({ 
                        passed: true, 
                        meta: { 
                            totalTime: totalTime,
                            mistakes: this.mistakes,
                            totalMoves: this.moves 
                        } 
                    });
                }, 500); 
            }
        }, 600); // Allow flip to finish
        } else {
            // No Match
            this.mistakes++;
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
        const target = this.metrics.pairsToClear || 4;
        this.statusEl.textContent = `Pairs matched: ${this.matchedPairs} / ${target}`;
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
