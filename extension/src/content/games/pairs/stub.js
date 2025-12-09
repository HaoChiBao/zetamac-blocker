import { Game } from '../Game.js';
import { config } from './config.js';

// Simple SVG Icons (24x24 viewBox defaults)
// Solid Black shapes
const ICONS = [
    '<svg viewBox="0 0 24 24" fill="black"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>', // Star
    '<svg viewBox="0 0 24 24" fill="black"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>', // Heart
    '<svg viewBox="0 0 24 24" fill="black"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>', // Power/Target
    '<svg viewBox="0 0 24 24" fill="black"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>', // Bulb
    '<svg viewBox="0 0 24 24" fill="black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>', // Info/Token
    '<svg viewBox="0 0 24 24" fill="black"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>', // Star Circle
    '<svg viewBox="0 0 24 24" fill="black"><path d="M7 3H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2a2 2 0 1 1 4 0V5c0-1.1-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2H5c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2zm10 4h2a2 2 0 1 1 0 4h-2c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2zm0-16h2a2 2 0 1 1 0 4h-2c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zM7 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>', // Dice/Grid
    '<svg viewBox="0 0 24 24" fill="black"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5h3V7h4v5h3l-5 5z"/></svg>', // Arrow Down Box
    '<svg viewBox="0 0 24 24" fill="black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>', // Globe
    '<svg viewBox="0 0 24 24" fill="black"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>', // Person
    '<svg viewBox="0 0 24 24" fill="black"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>', // Email
    '<svg viewBox="0 0 24 24" fill="black"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>' // Image/Mountain
];

const STYLES = `
.pairs-game-container {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', sans-serif;
    perspective: 1000px;
}

.pairs-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.pairs-grid {
    display: flex; /* Adaptive grid */
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
    width: 100%;
    max-width: 420px;
    justify-content: center;
}

.card {
    position: relative;
    width: 70px;
    height: 100px;
    cursor: pointer;
    background: transparent;
    user-select: none;
    /* 3D Transform Context */
    perspective: 1000px;
    transform-origin: center center;
}

/* Inner flipper container */
.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.3s cubic-bezier(0.4, 0.2, 0.2, 1);
    transform-style: preserve-3d;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform-origin: center center;
}

.card.flipped .card-inner {
    transform: rotateY(180deg);
}

/* Faces */
.card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #000;
    /* Fix jitter */
    top: 0;
    left: 0;
    box-sizing: border-box;
    transform-style: preserve-3d;
}

/* Back of card (Visual Front when face down) */
.card-front {
    background-color: #000;
    /* Optional geometric pattern for style */
    background-image: radial-gradient(circle, #333 1px, transparent 1px);
    background-size: 10px 10px;
    transform: rotateY(0deg); /* Default */
}

/* Face of card (Visual Back when revealed) - Contains Icon */
.card-back {
    background-color: #fff;
    transform: rotateY(180deg);
}

.card-icon {
    width: 60%;
    height: 60%;
}
.card-icon svg {
    width: 100%;
    height: 100%;
}

/* States */
.card.matched {
    cursor: default;
}
.card.matched .card-inner {
    animation: popMatch 0.3s forwards;
    box-shadow: none;
}
.card.matched .card-back {
    background-color: #f0f0f0;
    opacity: 0.5;
    border-color: #ccc;
    filter: grayscale(1);
}

.card.shake .card-inner {
    animation: shakeWrong 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes popMatch {
    0% { transform: rotateY(180deg) scale(1); }
    50% { transform: rotateY(180deg) scale(1.2); }
    100% { transform: rotateY(180deg) scale(1); }
}

@keyframes shakeWrong {
    10%, 90% { transform: rotateY(180deg) translateX(-2px); }
    20%, 80% { transform: rotateY(180deg) translateX(4px); }
    30%, 50%, 70% { transform: rotateY(180deg) translateX(-6px); }
    40%, 60% { transform: rotateY(180deg) translateX(6px); }
}

.pairs-status {
    font-size: 14px;
    font-weight: 700;
    color: #444;
    margin-bottom: 20px;
    text-transform: uppercase;
}

.pairs-reset-btn {
    padding: 12px 24px;
    background: #fff;
    border: 2px solid #000;
    color: #000;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
}

.pairs-reset-btn:hover {
    background: #000;
    color: #fff;
    transform: translateY(-2px);
}
`;

export class PairsGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        this.board = [];
        this.cards = []; // DOM elements (wrappers)
        this.firstSelectedIndex = null;
        this.secondSelectedIndex = null;
        this.isLocked = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.mistakes = 0;
        this.startTime = 0;
        this.isPreviewing = false;
        
        // Settings
        this.pairsToClear = this.metrics.pairsToClear || 4;
        // Cap at icons length
        if (this.pairsToClear > ICONS.length) this.pairsToClear = ICONS.length;
    }

    render(container, context) {
        this.container = container;
        this.context = context;

        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        const gameDiv = document.createElement('div');
        gameDiv.className = 'pairs-game-container';
        gameDiv.innerHTML = `
            <div class="pairs-title">${this.config.name}</div>
            <div class="pairs-status">Pairs matched: 0 / ${this.pairsToClear}</div>
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
        this.firstSelectedIndex = null;
        this.secondSelectedIndex = null;
        this.isLocked = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.mistakes = 0;
        this.isPreviewing = true;
        this.updateStatus();

        // 1. Pick Icons
        // Shuffle the ICONS array first to get random subset logic if needed, 
        // or just pick first N. Better to pick random subset.
        const shuffledIcons = [...ICONS].sort(() => Math.random() - 0.5);
        const selectedIcons = shuffledIcons.slice(0, this.pairsToClear);

        // 2. Duplicate and Shuffle
        const deck = [];
        selectedIcons.forEach((icon, idx) => {
            deck.push({ id: idx, icon: icon });
            deck.push({ id: idx, icon: icon });
        });

        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.board = deck.map((item, index) => ({
            ...item,
            index,
            isFlipped: false,
            isMatched: false
        }));

        this.renderBoard();   
        
        // Start Timer after preview? No, start logic after preview.
        this.startPreview();
    }

    renderBoard() {
        this.gridEl.innerHTML = '';
        this.cards = [];

        this.board.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            
            // Inner structure for 3D flip
            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <div class="card-icon">${card.icon}</div>
                    </div>
                </div>
            `;
            
            cardEl.addEventListener('click', () => this.handleCardClick(index));
            this.gridEl.appendChild(cardEl);
            this.cards.push(cardEl);
        });
    }

    startPreview() {
        // Show face up
        this.cards.forEach(el => el.classList.add('flipped'));

        // Hide after delay
        setTimeout(() => {
            if (!this.container) return;
            this.cards.forEach(el => el.classList.remove('flipped'));
            
            this.isPreviewing = false;
            this.startTime = Date.now();
        }, 1000);
    }

    handleCardClick(index) {
        if (this.isLocked || this.isPreviewing) return;
        
        const card = this.board[index];
        if (card.isFlipped || card.isMatched) return;

        // Flip
        this.flipCard(index, true);

        if (this.firstSelectedIndex === null) {
            this.firstSelectedIndex = index;
        } else {
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
            el.classList.add('flipped');
        } else {
            el.classList.remove('flipped');
        }
    }

    checkForMatch() {
        this.isLocked = true;

        const idx1 = this.firstSelectedIndex;
        const idx2 = this.secondSelectedIndex;
        const card1 = this.board[idx1];
        const card2 = this.board[idx2];
        const el1 = this.cards[idx1];
        const el2 = this.cards[idx2];

        if (card1.id === card2.id) {
            // Match
            setTimeout(() => {
                card1.isMatched = true;
                card2.isMatched = true;
                el1.classList.add('matched');
                el2.classList.add('matched');
                
                this.matchedPairs++;
                this.updateStatus();
                
                this.resetTurn();

                // Completion Check
                if (this.matchedPairs === this.pairsToClear) {
                    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1) + 's';
                    setTimeout(() => {
                        this.context.onComplete({
                            passed: true,
                            meta: { 
                                time: elapsed, 
                                moves: this.moves,
                                mistakes: this.mistakes 
                            }
                        });
                    }, 500);
                }
            }, 300);
        } else {
            // No Match
            this.mistakes++;
            setTimeout(() => {
                // Shake before flipping back? Or just shake then flip.
                // Let's add shake class
                el1.classList.add('shake');
                el2.classList.add('shake');
                
                setTimeout(() => {
                    el1.classList.remove('shake');
                    el2.classList.remove('shake');
                    this.flipCard(idx1, false);
                    this.flipCard(idx2, false);
                    this.resetTurn();
                }, 400); // Wait for shake
            }, 300); // Wait for initial flip see
        }
    }

    resetTurn() {
        this.firstSelectedIndex = null;
        this.secondSelectedIndex = null;
        this.isLocked = false;
    }

    updateStatus() {
        this.statusEl.textContent = `PAIRS MATCHED: ${this.matchedPairs} / ${this.pairsToClear}`;
    }
}

export function createGame(metrics) {
    return new PairsGame(metrics);
}
