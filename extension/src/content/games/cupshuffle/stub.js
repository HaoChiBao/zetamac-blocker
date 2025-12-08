import { Game } from '../Game.js';
import { config, CONSTANTS } from './config.js';
import { pickRandom, pickRandomDistinctPair } from '../../../common/random.js';

const STYLES = `
.cup-game-container {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', sans-serif;
    user-select: none;
}

.cup-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #000;
}

.cup-instructions {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.cup-stage {
    position: relative;
    width: 100%;
    max-width: 95vw;
    height: 250px; /* Reduced height */
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center; 
}

/* Container for cups to define the track width */
.cup-track {
    position: relative;
    width: 100%;
    height: 100%;
}

.cup-wrapper {
    position: absolute;
    bottom: 20px;
    width: 120px; /* 240 / 2 */
    height: 150px; /* 300 / 2 */
    cursor: pointer;
    transition: transform 0.1s linear;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.cup-img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 5px 8px rgba(0,0,0,0.3)); /* Scaled shadow */
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease-out;
    transform-origin: bottom center;
}

.ball-img {
    position: absolute;
    bottom: 8px; /* Adjusted */
    width: 45px; /* 90 / 2 */
    height: 45px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    display: none;
}

/* States */
.cup-wrapper.lifted .cup-img {
    transform: translateY(-90px); /* 180 / 2 */
}

.cup-controls {
    display: flex;
    gap: 15px;
}

.cup-btn {
    padding: 12px 24px;
    background: #eee;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    color: #333;
    transition: background 0.2s;
}

.cup-btn:hover {
    background: #e0e0e0;
}

.cup-status {
    height: 30px;
    margin-top: 15px;
    font-weight: 600;
    font-size: 18px;
    color: #444;
}
`;

export class CupShuffleGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        // Metrics: { cupsCount, shuffleSpeed (multiplier), shuffleRounds }
        this.cupsCount = Math.min(Math.max(this.metrics.cupsCount || 3, 3), 6);
        this.speedMultiplier = this.metrics.shuffleSpeed || 1.0;
        this.rounds = this.metrics.shuffleRounds || 5;

        // State
        this.cups = []; // Array of DOM elements
        this.ballIndex = -1; // Where the ball is (0 to cupsCount-1)
        this.isShuffling = false;
        this.isInteracting = false;
        
        // Logical positions: positions[i] = cupIndex currently at slot i
        this.slots = []; 
        // We also need to track where each cup element is.
        // Simplified: this.cups[i] is the cup element created as "Cup i".
        // this.cupCurrentSlot[i] = current slot index (0..N) of Cup i.
        this.cupCurrentSlot = [];
        
        console.log('[CupShuffle] Init', { count: this.cupsCount, speed: this.speedMultiplier, rounds: this.rounds });
    }

    render(container, context) {
        this.container = container;
        this.context = context;

        // Styles
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        // HTML
        const gameDiv = document.createElement('div');
        gameDiv.className = 'cup-game-container';
        gameDiv.innerHTML = `
            <div class="cup-title">${this.config.name}</div>
            <div class="cup-instructions">Watch the ball carefully!</div>
            <div class="cup-stage">
                <div class="cup-track" id="cupTrack"></div>
            </div>
            <div class="cup-status" id="cupStatus"></div>
            <div class="cup-controls">
                <button class="cup-btn" id="resetBtn">Restart</button>
            </div>
        `;
        container.appendChild(gameDiv);

        this.trackEl = gameDiv.querySelector('#cupTrack');
        this.statusEl = gameDiv.querySelector('#cupStatus');
        this.resetBtn = gameDiv.querySelector('#resetBtn');
        
        this.resetBtn.addEventListener('click', () => {
            if (!this.isShuffling) this.startNewGame();
        });

        this.startNewGame();
    }

    async startNewGame() {
        this.isShuffling = false;
        this.isInteracting = false;
        this.statusEl.textContent = '';
        this.resetBtn.style.display = 'none';

        // 1. Create Cups
        this.trackEl.innerHTML = '';
        this.cups = [];
        this.cupCurrentSlot = [];
        this.slots = []; // slots[slotIndex] = cupIndex
        
        const cupUrl = chrome.runtime.getURL(CONSTANTS.CUP_IMAGE);
        const ballUrl = chrome.runtime.getURL(CONSTANTS.BALL_IMAGE);

        // Pre-calculate slot width %
        // We leave some margin. e.g. 3 cups -> 33% each. nice and centered.
        const slotWidthPercent = 100 / this.cupsCount;

        for (let i = 0; i < this.cupsCount; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cup-wrapper';
            // wrapper.style.left = calculated later per slot
            
            wrapper.innerHTML = `
                <img src="${ballUrl}" class="ball-img">
                <img src="${cupUrl}" class="cup-img">
            `;
            
            // Interaction
            wrapper.onclick = () => this.handleCupClick(i);
            
            this.trackEl.appendChild(wrapper);
            this.cups.push(wrapper);
            this.cupCurrentSlot[i] = i; // Starts at slot i
            this.slots[i] = i; // Slot i holds Cup i
            
            // Set initial position
            this.updateCupPosition(i, i, false); 
        }

        // 2. Hide ball
        this.ballIndex = Math.floor(Math.random() * this.cupsCount);
        // Show ball initially
        const ballCup = this.cups[this.ballIndex];
        const ballImg = ballCup.querySelector('.ball-img');
        ballImg.style.display = 'block';

        // 3. Intro Sequence
        await this.wait(500);
        await this.liftCup(this.ballIndex);
        await this.wait(800);
        await this.dropCup(this.ballIndex);
        await this.wait(500);

        // 4. Shuffle!
        this.statusEl.textContent = 'Shuffling...';
        this.isShuffling = true;
        await this.performShuffle();
        
        this.isShuffling = false;
        this.isInteracting = true;
        this.statusEl.textContent = 'Pick a cup!';
        this.resetBtn.style.display = 'block';
    }

    handleCupClick(cupIndex) {
        if (!this.isInteracting) return;
        
        this.isInteracting = false; // Prevent double clicks
        
        const isCorrect = (cupIndex === this.ballIndex);
        
        // Reveal this cup
        this.liftCup(cupIndex).then(() => {
            if (isCorrect) {
                this.statusEl.textContent = 'Correct!';
                this.statusEl.style.color = 'green';
                
                // Done
                setTimeout(() => {
                    this.context.onComplete({
                        passed: true,
                        meta: {
                            cupsCount: this.cupsCount,
                            shuffleSpeed: this.speedMultiplier,
                            rounds: this.rounds
                        }
                    });
                }, 1000);
            } else {
                this.statusEl.textContent = 'Wrong! Try again.';
                this.statusEl.style.color = 'red';
                
                // Reveal the actual ball too for fairness/feedback
                setTimeout(async () => {
                    await this.liftCup(this.ballIndex);
                    // Wait then reset
                    await this.wait(1500);
                    this.dropCup(cupIndex);
                    this.dropCup(this.ballIndex);
                    this.statusEl.textContent = '';
                    this.startNewGame();
                }, 500);
            }
        });
    }

    async performShuffle() {
        // Duration logic: Base duration / speedMultiplier
        const duration = CONSTANTS.SWAP_DURATION_BASE_MS / this.speedMultiplier;

        for (let r = 0; r < this.rounds; r++) {
            // Pick two distinct slots to swap
            const [slotA, slotB] = pickRandomDistinctPair(0, this.cupsCount - 1);
            
            // Find which cups are at these slots
            const cupA = this.slots[slotA];
            const cupB = this.slots[slotB];

            // Animate swap
            await this.swapCups(cupA, cupB, slotA, slotB, duration);

            // Update data model
            this.slots[slotA] = cupB;
            this.slots[slotB] = cupA;
            this.cupCurrentSlot[cupA] = slotB;
            this.cupCurrentSlot[cupB] = slotA;
            
            // Small pause between swaps?
            // Maybe tiny overlap? user requested 'sequence'.
            // Sequential for clarity first.
        }
    }

    /**
     * Swaps two cups visually from current slots to target slots.
     */
    swapCups(cupIdxA, cupIdxB, slotA, slotB, duration) {
        return new Promise(resolve => {
            const elA = this.cups[cupIdxA];
            const elB = this.cups[cupIdxB];
            
            const start = Date.now();
            
            // Depth illusion logic
            // One goes 'front' (A), one goes 'back' (B) randomly?
            // Or deterministic? Let's alternate or random.
            const aIsFront = Math.random() > 0.5;
            
            // Set Z-index based on front/back
            elA.style.zIndex = aIsFront ? 20 : 1;
            elB.style.zIndex = aIsFront ? 1 : 20;

            const animate = () => {
                const now = Date.now();
                const p = Math.min((now - start) / duration, 1);
                
                // Easing (SmoothStep or Sinusoidal)
                // t = p*p*(3-2*p) is smoothstep
                const t = p * p * (3 - 2 * p);

                // Interpolate positions
                // We need strict positions.
                // slotA -> slotB
                // slotB -> slotA
                const posA = this.getInterpolatedPos(slotA, slotB, t);
                const posB = this.getInterpolatedPos(slotB, slotA, t);

                // Depth illusion (Scale & Y)
                // Sin wave for arc: sin(0..PI) goes 0->1->0
                const flow = Math.sin(p * Math.PI); 
                const scaleDelta = 0.25 * flow; // Increased scale variance (25%)
                const yDelta = 30 * flow; // Scaled down (30px)

                const scaleA = 1 + (aIsFront ? scaleDelta : -scaleDelta);
                const transYA = aIsFront ? -yDelta : yDelta; // Front moves UP (-Y), Back moves DOWN (+Y)
                
                const scaleB = 1 + (!aIsFront ? scaleDelta : -scaleDelta);
                const transYB = !aIsFront ? -yDelta : yDelta;

                // Apply
                this.setCupStyle(elA, posA, transYA, scaleA);
                this.setCupStyle(elB, posB, transYB, scaleB);

                if (p < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Reset styling to strict slot position (no scale/Z)
                    elA.style.zIndex = '';
                    elB.style.zIndex = '';
                    this.updateCupPosition(cupIdxA, slotB, false);
                    this.updateCupPosition(cupIdxB, slotA, false);
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }

    getInterpolatedPos(slotFrom, slotTo, t) {
        // Return % left position
        const pFrom = this.getSlotLeftPercent(slotFrom);
        const pTo = this.getSlotLeftPercent(slotTo);
        return pFrom + (pTo - pFrom) * t;
    }

    getSlotLeftPercent(slotIdx) {
        // Center the cups.
        // If 3 cups, slots are: 16%, 50%, 83% roughly?
        // Let's divide width evenly.
        // Slot width = 100 / count.
        // Center of slot i = (i + 0.5) * slotWidth
        const slotWidth = 100 / this.cupsCount;
        return (slotIdx + 0.5) * slotWidth;
    }

    setCupStyle(el, leftPercent, translateY, scale) {
        el.style.left = leftPercent + '%';
        el.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${scale})`;
    }

    // Static position update (non-animated or instant)
    updateCupPosition(cupIdx, slotIdx, hidden = false) {
        const el = this.cups[cupIdx];
        const left = this.getSlotLeftPercent(slotIdx);
        el.style.left = left + '%';
        // Base transform is just centering X (-50%).
        // We preserve 'lifted' class state if needed? logic handles lift separately.
        // Reset scale/translateY from animation.
        el.style.transform = `translateX(-50%)`;
        el.style.display = hidden ? 'none' : 'flex';
    }

    liftCup(cupIdx) {
        return new Promise(resolve => {
            this.cups[cupIdx].classList.add('lifted');
            setTimeout(resolve, CONSTANTS.REVEAL_DURATION_MS);
        });
    }

    dropCup(cupIdx) {
        return new Promise(resolve => {
            this.cups[cupIdx].classList.remove('lifted');
            // Wait for transition
            setTimeout(resolve, 300);
        });
    }

    wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}


export function createGame(metrics) {
    return new CupShuffleGame(metrics);
}
