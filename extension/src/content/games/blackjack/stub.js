import { Game } from '../Game.js';
import { config } from './config.js';
import { pickRandom, shuffle } from '../../../common/random.js';

const STYLES = `
.bj-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background: transparent;
    padding: 20px;
    box-sizing: border-box;
    color: #000000;
    font-family: 'Inter', sans-serif;
    position: relative;
}

.bj-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
}

.bj-bankroll {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bj-target {
    color: #666;
}

.bj-main-area {
    display: flex;
    justify-content: center; /* Center everything together */
    align-items: flex-end; /* Align bottom */
    width: 100%;
    flex: 1;
    position: relative;
    gap: 20px; /* Bring stack closer */
}

.bj-game-center {
    /* Removed flex: 1 to prevent pushing stack away */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    min-width: 300px; /* Ensure space for cards */
}

.bj-bet-stack-area {
    width: 60px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    position: relative;
    /* Removed absolute positioning or wide margins */
}

.bj-bet-label {
    position: absolute;
    bottom: -25px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
}

/* 3D CHIP STYLES - THICKER */
.chip-3d {
    width: 50px;
    height: 16px; /* Increased thickness for stack spacing */
    position: relative;
    margin-top: -10px; /* Overlap */
    transition: transform 0.2s;
    cursor: pointer;
}

/* The Side/Body of the coin */
.chip-3d::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 20px; /* Height of the cylinder side */
    background: inherit;
    border-radius: 50%; /* Bottom rounded edge */
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    z-index: 1;
}

/* The Top Face */
.chip-3d::before {
    content: attr(data-val);
    position: absolute;
    top: -5px; /* Shift up to create thickness */
    left: 0;
    width: 50px;
    height: 25px; /* Oval shape */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    border: 1px solid rgba(0,0,0,0.2);
    box-sizing: border-box;
    z-index: 2;
    background: inherit; /* Will be overridden by specific colors */
}

/* B/W Theme Chips */
.chip-5 { background: #999; } /* Side color */
.chip-5::before { background: #fff; color: #000; border-color: #000; } /* Top face */

.chip-10 { background: #333; }
.chip-10::before { background: #666; color: #fff; border-color: #000; }

.chip-25 { background: #000; }
.chip-25::before { background: #000; color: #fff; border: 1px solid #fff; }


.bj-hands-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 20px;
    width: 100%;
}

.bj-hand-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    transition: opacity 0.3s;
}

.bj-hand-container.inactive {
    opacity: 0.5;
}

.bj-hand-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    color: #000;
}

.bj-hand-bet {
    font-size: 10px;
    color: #666;
    margin-top: -10px;
}

.bj-cards {
    display: flex;
    justify-content: center;
    gap: 15px;
    height: 120px;
}

/* CARD STYLES */
.card {
    width: 80px;
    height: 112px;
    background: white;
    border: 2px solid #000;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
    box-sizing: border-box;
    color: #000;
    font-weight: bold;
    position: relative;
    animation: deal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    user-select: none;
    box-shadow: 4px 4px 0px rgba(0,0,0,1);
}

@keyframes deal {
    from { transform: translateY(-20px) scale(0.9); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
}

.card.red { color: #e74c3c; border-color: #e74c3c; box-shadow: 4px 4px 0px #e74c3c; }
.card.black { color: #000; }

.card-top { font-size: 16px; line-height: 1; text-align: left; }
.card-center { 
    position: absolute; 
    top: 50%; left: 50%; 
    transform: translate(-50%, -50%); 
    font-size: 32px; 
}
.card-bottom { font-size: 16px; line-height: 1; text-align: right; transform: rotate(180deg); }

.card.hidden {
    background: #000;
    border: 2px solid #000;
    box-shadow: 4px 4px 0px #666;
}
.card.hidden * { display: none; }

/* CONTROLS */
.bj-controls {
    display: flex;
    flex-direction: column; /* Stack vertically */
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center; /* Center items */
    width: 100%;
}

.bj-betting-row {
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;
}

.bj-btn {
    padding: 15px 30px;
    background: #000;
    color: #fff;
    border: none;
    font-weight: 700;
    cursor: pointer;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
    min-width: 100px;
}

.bj-btn:hover {
    background: #333;
    transform: translateY(-2px);
}

.bj-btn:active { transform: translateY(0); }
.bj-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

.btn-hit { background: #000; }
.btn-stand { background: #fff; color: #000; border: 2px solid #000; }
.btn-deal { width: 100%; max-width: 300px; }

/* Chip Buttons in Controls */
.chip-btn-wrapper {
    display: flex;
    gap: 15px;
}

.btn-chip-select {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.1s;
    background: transparent;
    color: #000;
}
.btn-chip-select:hover { transform: scale(1.1); }
.btn-chip-select:active { transform: scale(0.95); }

.btn-chip-select.val-5 { background: #fff; }
.btn-chip-select.val-10 { background: #ccc; }
.btn-chip-select.val-25 { background: #000; color: #fff; }

.btn-clear { background: transparent; color: #000; border: 1px solid #000; min-width: 80px; padding: 10px 20px; }

.bj-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000;
    color: #fff;
    padding: 20px 40px;
    font-size: 24px;
    font-weight: 800;
    text-transform: uppercase;
    text-align: center;
    z-index: 100;
    pointer-events: none;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 10px 10px 0px rgba(0,0,0,0.2);
}

@keyframes popIn {
    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
`;

export class BlackjackGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        this.deck = [];
        this.dealerHand = [];
        this.playerHands = []; 
        this.activeHandIndex = 0;
        
        this.bankroll = 0; 
        this.currentBet = 0;
        this.betStack = []; // Array of chip values [5, 5, 10, 25]
        this.gameState = 'betting'; 
        
        // Stats
        this.handsPlayed = 0;
        this.handsWon = 0;
    }

    render(container, context) {
        this.container = container;
        this.context = context;

        if (context.config) {
            this.config = { ...this.config, ...context.config };
        }
        
        this.bankroll = this.metrics.initialBankroll;
        this.currentBet = 0;
        this.betStack = [];

        // Override container styles
        this.container.style.background = 'transparent';
        this.container.style.boxShadow = 'none';
        this.container.style.maxWidth = '100%';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.padding = '0';
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';

        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        this.container.appendChild(styleEl);

        this.gameEl = document.createElement('div');
        this.gameEl.className = 'bj-table';
        this.container.appendChild(this.gameEl);

        this.updateUI();
    }

    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }
        shuffle(this.deck);
    }

    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        if (card.value === 'A') return 11;
        return parseInt(card.value);
    }

    getHandValue(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            value += this.getCardValue(card);
            if (card.value === 'A') aces++;
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    // --- Betting Actions ---

    addToBet(amount) {
        if (this.bankroll >= amount) {
            this.bankroll -= amount;
            this.currentBet += amount;
            this.betStack.push(amount);
            this.updateUI();
        }
    }

    clearBet() {
        this.bankroll += this.currentBet;
        this.currentBet = 0;
        this.betStack = [];
        this.updateUI();
    }

    deal() {
        if (this.currentBet === 0) return;

        this.createDeck();
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        
        this.playerHands = [{
            cards: [this.deck.pop(), this.deck.pop()],
            bet: this.currentBet,
            status: 'playing'
        }];
        this.activeHandIndex = 0;
        
        this.gameState = 'playing';
        this.message = null;
        
        const pVal = this.getHandValue(this.playerHands[0].cards);
        if (pVal === 21) {
            this.playerHands[0].status = 'blackjack';
            this.resolveGame();
        } else {
            this.updateUI();
        }
    }

    // --- Game Actions ---

    hit() {
        const hand = this.playerHands[this.activeHandIndex];
        hand.cards.push(this.deck.pop());
        const val = this.getHandValue(hand.cards);
        
        if (val > 21) {
            hand.status = 'bust';
            this.nextHand();
        } else if (val === 21) {
             this.nextHand();
        } else {
            this.updateUI();
        }
    }

    stand() {
        this.playerHands[this.activeHandIndex].status = 'stand';
        this.nextHand();
    }

    doubleDown() {
        const hand = this.playerHands[this.activeHandIndex];
        if (this.bankroll >= hand.bet) {
            this.bankroll -= hand.bet;
            hand.bet *= 2;
            hand.cards.push(this.deck.pop());
            
            const val = this.getHandValue(hand.cards);
            if (val > 21) hand.status = 'bust';
            else hand.status = 'stand'; 
            
            this.nextHand();
        }
    }

    split() {
        const hand = this.playerHands[this.activeHandIndex];
        if (this.bankroll >= hand.bet) {
            this.bankroll -= hand.bet;
            
            const splitCard = hand.cards.pop();
            const newHand = {
                cards: [splitCard],
                bet: hand.bet,
                status: 'playing'
            };
            
            hand.cards.push(this.deck.pop());
            newHand.cards.push(this.deck.pop());
            
            this.playerHands.splice(this.activeHandIndex + 1, 0, newHand);
            
            this.updateUI();
        }
    }

    nextHand() {
        if (this.activeHandIndex < this.playerHands.length - 1) {
            this.activeHandIndex++;
            this.updateUI();
        } else {
            this.gameState = 'dealer';
            this.updateUI();
            setTimeout(() => this.playDealer(), 500);
        }
    }

    playDealer() {
        const allBusted = this.playerHands.every(h => h.status === 'bust');
        if (allBusted) {
            this.resolveGame();
            return;
        }

        let dVal = this.getHandValue(this.dealerHand);
        if (dVal < this.metrics.dealerStandsOn) {
            this.dealerHand.push(this.deck.pop());
            this.updateUI();
            setTimeout(() => this.playDealer(), 800);
        } else {
            this.resolveGame();
        }
    }

    resolveGame() {
        this.gameState = 'resolution';
        const dVal = this.getHandValue(this.dealerHand);
        let totalWinnings = 0;
        let anyWin = false;

        this.playerHands.forEach(hand => {
            const pVal = this.getHandValue(hand.cards);
            let winAmount = 0;

            if (hand.status === 'bust') {
                // Loss
            } else if (hand.status === 'blackjack') {
                winAmount = hand.bet + (hand.bet * 1.5);
                anyWin = true;
            } else {
                if (dVal > 21) {
                    winAmount = hand.bet * 2;
                    anyWin = true;
                } else if (pVal > dVal) {
                    winAmount = hand.bet * 2;
                    anyWin = true;
                } else if (pVal === dVal) {
                    winAmount = hand.bet;
                }
            }
            totalWinnings += winAmount;
        });

        this.bankroll += totalWinnings;
        
        if (anyWin) this.handsWon++;
        this.handsPlayed++;
        
        if (totalWinnings > 0) {
             this.message = `WON $${totalWinnings}`;
        } else {
             this.message = "DEALER WINS";
        }

        this.updateUI();

        if (this.bankroll >= this.metrics.targetBankroll) {
            setTimeout(() => {
                this.context.onComplete({
                    passed: true,
                    meta: {
                        finalBankroll: this.bankroll,
                        handsPlayed: this.handsPlayed,
                        handsWon: this.handsWon
                    }
                });
            }, 1500);
        }
        
        if (this.bankroll < 5) { 
             setTimeout(() => {
                 this.bankroll = this.metrics.bankrollFloor;
                 this.currentBet = 0;
                 this.betStack = [];
                 this.gameState = 'betting';
                 this.dealerHand = []; // Clear dealer hand
                 this.playerHands = []; // Clear player hands
                 this.updateUI();
             }, 2000);
        }
    }

    updateUI() {
        if (!this.gameEl) return;

        const dVal = this.gameState === 'playing' ? '?' : this.getHandValue(this.dealerHand);

        // Header
        const headerHtml = `
            <div class="bj-header">
                <div class="bj-bankroll">
                    <span>🏦 $${Math.floor(this.bankroll)}</span>
                    <span class="bj-target">/ $${this.metrics.targetBankroll}</span>
                </div>
            </div>
        `;

        // Dealer Area
        let dealerCardsHtml = '';
        if (this.dealerHand.length > 0) {
            dealerCardsHtml = this.dealerHand.map((card, i) => {
                if (i === 1 && this.gameState === 'playing') {
                    return `<div class="card hidden"></div>`;
                }
                return this.renderCard(card);
            }).join('');
        }

        // Player Area (Multiple Hands)
        let playerAreaHtml = '';
        if (this.gameState === 'betting') {
             playerAreaHtml = `
                <div class="bj-hand-container">
                    <div class="bj-cards" style="opacity: 0.3">
                        <div class="card black" style="border-style: dashed"><div class="card-center">?</div></div>
                        <div class="card black" style="border-style: dashed"><div class="card-center">?</div></div>
                    </div>
                    <div class="bj-hand-label">Place Your Bet</div>
                </div>
             `;
        } else {
            const handsHtml = this.playerHands.map((hand, index) => {
                const isActive = index === this.activeHandIndex && this.gameState === 'playing';
                const pVal = this.getHandValue(hand.cards);
                const cardsHtml = hand.cards.map(c => this.renderCard(c)).join('');
                
                return `
                    <div class="bj-hand-container ${isActive ? 'active' : 'inactive'}">
                        <div class="bj-cards">${cardsHtml}</div>
                        <div class="bj-hand-label">
                            ${hand.status === 'playing' ? pVal : hand.status.toUpperCase()}
                        </div>
                        <div class="bj-hand-bet">$${hand.bet}</div>
                    </div>
                `;
            }).join('');
            
            playerAreaHtml = `<div class="bj-hands-wrapper">${handsHtml}</div>`;
        }

        // Chip Stack (Right Side)
        const chipStackHtml = this.betStack.map(val => `
            <div class="chip-3d chip-${val}" data-val="$${val}"></div>
        `).join('');
        
        const betStackArea = `
            <div class="bj-bet-stack-area">
                ${chipStackHtml}
                <div class="bj-bet-label">BET: $${this.currentBet}</div>
            </div>
        `;

        // Controls
        let controlsHtml = '';
        if (this.gameState === 'betting') {
            controlsHtml = `
                <div class="bj-betting-row">
                    <div class="chip-btn-wrapper">
                        <button class="btn-chip-select val-5" id="chip-5">5</button>
                        <button class="btn-chip-select val-10" id="chip-10">10</button>
                        <button class="btn-chip-select val-25" id="chip-25">25</button>
                    </div>
                    <button class="bj-btn btn-clear" id="btn-clear">CLEAR</button>
                </div>
                <button class="bj-btn btn-deal" id="btn-deal" ${this.currentBet === 0 ? 'disabled' : ''}>DEAL</button>
            `;
        } else if (this.gameState === 'resolution') {
            controlsHtml = `<button class="bj-btn btn-deal" id="btn-reset">NEW HAND</button>`;
        } else if (this.gameState === 'playing') {
            const activeHand = this.playerHands[this.activeHandIndex];
            const canSplit = this.metrics.allowSplit && 
                             activeHand.cards.length === 2 && 
                             this.getCardValue(activeHand.cards[0]) === this.getCardValue(activeHand.cards[1]) &&
                             this.bankroll >= activeHand.bet;
                             
            const canDouble = this.metrics.allowDouble && 
                              activeHand.cards.length === 2 &&
                              this.bankroll >= activeHand.bet;

            controlsHtml = `
                <div class="bj-betting-row">
                    <button class="bj-btn btn-hit" id="btn-hit">HIT</button>
                    <button class="bj-btn btn-stand" id="btn-stand">STAND</button>
                </div>
                ${canDouble || canSplit ? `
                    <div class="bj-betting-row">
                        ${canDouble ? `<button class="bj-btn" id="btn-double">DOUBLE</button>` : ''}
                        ${canSplit ? `<button class="bj-btn" id="btn-split">SPLIT</button>` : ''}
                    </div>
                ` : ''}
            `;
        }

        // Message
        const messageHtml = this.message ? `<div class="bj-message">${this.message}</div>` : '';

        this.gameEl.innerHTML = `
            ${headerHtml}
            
            <div class="bj-main-area">
                <div class="bj-game-center">
                    <div class="bj-hand-container">
                        <div class="bj-hand-label">Dealer ${this.dealerHand.length > 0 ? `(${dVal})` : ''}</div>
                        <div class="bj-cards" style="min-height: 112px">${dealerCardsHtml}</div>
                    </div>

                    ${messageHtml}

                    ${playerAreaHtml}
                </div>
                
                ${betStackArea}
            </div>

            <div class="bj-controls">
                ${controlsHtml}
            </div>
        `;

        // Bind Events
        if (this.gameState === 'betting') {
            this.bindClick('#chip-5', () => this.addToBet(5));
            this.bindClick('#chip-10', () => this.addToBet(10));
            this.bindClick('#chip-25', () => this.addToBet(25));
            this.bindClick('#btn-clear', () => this.clearBet());
            this.bindClick('#btn-deal', () => this.deal());
        } else if (this.gameState === 'resolution') {
            this.bindClick('#btn-reset', () => {
                this.currentBet = 0;
                this.betStack = [];
                this.gameState = 'betting';
                this.message = null;
                this.dealerHand = []; // Clear dealer hand
                this.playerHands = []; // Clear player hands
                this.updateUI();
            });
        } else if (this.gameState === 'playing') {
            this.bindClick('#btn-hit', () => this.hit());
            this.bindClick('#btn-stand', () => this.stand());
            this.bindClick('#btn-double', () => this.doubleDown());
            this.bindClick('#btn-split', () => this.split());
        }
    }

    bindClick(selector, handler) {
        const el = this.gameEl.querySelector(selector);
        if (el) el.onclick = handler;
    }

    renderCard(card) {
        const isRed = ['♥', '♦'].includes(card.suit);
        return `
            <div class="card ${isRed ? 'red' : 'black'}">
                <div class="card-top">${card.value}<br>${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div class="card-bottom">${card.value}<br>${card.suit}</div>
            </div>
        `;
    }
}

export function createGame(metrics) {
    return new BlackjackGame(metrics);
}
