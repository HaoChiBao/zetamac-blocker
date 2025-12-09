import { Game } from '../Game.js';
import { config } from './config.js';
import { WORD_DATA } from './word_hunt_data.js';

const STYLES = `
    .wh-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 500px;
        position: relative;
        font-family: 'Inter', sans-serif;
        user-select: none;
        touch-action: none;
    }

    .wh-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .wh-title {
        font-size: 24px;
        font-weight: 800;
        color: #333;
        margin-bottom: 5px;
    }

    .wh-subtitle {
        font-size: 14px;
        color: #666;
    }

    .wh-progress-bar {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
        background: #f0f0f0;
        padding: 5px 15px;
        border-radius: 20px;
    }

    .wh-current-word {
        height: 40px;
        font-size: 28px;
        font-weight: 700;
        color: #000;
        margin-bottom: 20px;
        letter-spacing: 2px;
        text-transform: uppercase;
        min-width: 100px;
        text-align: center;
        transition: transform 0.1s;
    }
    
    .wh-current-word.shake {
        animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        color: #e74c3c;
    }
    
    .wh-current-word.success {
        animation: pulse 0.3s ease-out;
        color: #27ae60;
    }

    .wh-board {
        position: relative;
        width: 360px;
        height: 360px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wh-ring {
        position: absolute;
        width: 340px;
        height: 340px;
        border: 2px solid #000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
    }

    .wh-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .wh-letter {
        position: absolute;
        width: 50px;
        height: 50px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 700;
        color: #333;
        /* No shadow */
        transform: translate(-50%, -50%);
        z-index: 2;
        transition: background 0.2s, color 0.2s, left 0.3s ease, top 0.3s ease;
        /* No border */
    }

    .wh-letter.active {
        background: #000;
        color: #fff;
        /* Simple highlight, no scale/shadow */
    }
    
    .wh-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-bottom: 10px;
    }
    
    .wh-btn {
        background: none;
        border: 2px solid #e0e0e0;
        border-radius: 20px;
        padding: 5px 15px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        color: #666;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .wh-btn:hover {
        border-color: #333;
        color: #333;
    }
    
    .wh-btn svg {
        width: 14px;
        height: 14px;
    }
    
    .wh-preview-list {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        min-height: 30px;
    }

    .wh-found-word {
        font-size: 14px;
        color: #fff;
        background: #000;
        padding: 6px 12px;
        border-radius: 0px;
        font-weight: 700;
        opacity: 0; /* Hidden initally, revealed after animation */
        animation: popIn 0.3s forwards;
    }
    
    .wh-flying-word {
        position: fixed;
        background: #000;
        color: #fff;
        font-size: 28px; /* Start at current-word size */
        font-weight: 700;
        padding: 6px 12px;
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        transform-origin: center;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Transition controlled by JS or class */
        transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .wh-stats-footer {
        margin-top: 20px;
        font-size: 11px;
        color: #888;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes popIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
`;

export class WordHuntGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        this.targetWords = parseInt(this.metrics.targetWords) || 3;
        
        // Game State
        this.puzzle = null;
        this.foundWords = new Set();
        this.currentPath = []; // Array of indices [0, 2, 5...]
        this.isDragging = false;
        
        // UI
        this.letterEls = []; // Array of { el: HTMLElement, char: string } to track elements
        this.center = { x: 180, y: 180 }; // 360/2
        this.radius = 120;
        
        this.startTime = Date.now();
    }

    render(container, context) {
        this.container = container;
        this.context = context;

        // Styles
        const style = document.createElement('style');
        style.textContent = STYLES;
        container.appendChild(style);

        // Init Data
        this.initPuzzle();

        // DOM Structure
        const wrapper = document.createElement('div');
        wrapper.className = 'wh-container';
        
        wrapper.innerHTML = `
            <div class="wh-header">
                <div class="wh-title">Word Hunt</div>
                <div class="wh-subtitle">Connect letters to find words</div>
            </div>
            
            <div class="wh-progress-bar" id="whProgress">
                Found: 0 / ${this.targetWords}
            </div>

            <div class="wh-current-word" id="whCurrentWord"></div>

            <div class="wh-board" id="whBoard">
                <div class="wh-ring"></div>
                <!-- 360x360 canvas -->
                <canvas class="wh-canvas" id="whCanvas" width="360" height="360"></canvas>
                <!-- Letters injected here -->
            </div>
            
            <div class="wh-actions">
                <button class="wh-btn" id="whShuffleBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <path d="M16 8l-4 4-4-4M16 16l-4-4-4 4"></path>
                    </svg>
                    SHUFFLE
                </button>
            </div>
            
            <div class="wh-preview-list" id="whFoundList"></div>
            
            <div class="wh-stats-footer" id="whStats">
                Possible words: ${this.puzzle.validWords.size}
            </div>
        `;

        container.appendChild(wrapper);

        this.els = {
            board: wrapper.querySelector('#whBoard'),
            canvas: wrapper.querySelector('#whCanvas'),
            currentWord: wrapper.querySelector('#whCurrentWord'),
            progress: wrapper.querySelector('#whProgress'),
            foundList: wrapper.querySelector('#whFoundList'),
            shuffleBtn: wrapper.querySelector('#whShuffleBtn')
        };
        
        this.ctx = this.els.canvas.getContext('2d');
        
        this.els.shuffleBtn.onclick = () => this.shuffleLetters();
        
        // Setup Board
        this.renderLetters();
        this.setupInteractions();
    }

    initPuzzle() {
        const getWordCount = (d) => {
            let c = 1; // source_word
            if (d.words) {
                Object.values(d.words).forEach(arr => c += arr.length);
            }
            return c;
        };

        // Filter suitable puzzles
        const suitable = WORD_DATA.filter(d => getWordCount(d) >= this.targetWords);
        
        let data;
        if (suitable.length > 0) {
            // Pick random valid puzzle
            const idx = Math.floor(Math.random() * suitable.length);
            data = suitable[idx];
        } else {
            // Fallback: Pick puzzle with max words
            console.warn('[WordHunt] No puzzle meets target requirements. Falling back to max available.');
            const sorted = [...WORD_DATA].sort((a, b) => getWordCount(b) - getWordCount(a));
            data = sorted[0];
            
            // Adjust requirements so game is winnable
            this.targetWords = getWordCount(data);
        }

        // Shuffle letters
        const letters = [...data.letters];
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        // Flatten valid words
        const validSet = new Set();
        if (data.words) {
            Object.values(data.words).forEach(list => {
                list.forEach(w => validSet.add(w.toLowerCase()));
            });
        }
        validSet.add(data.source_word.toLowerCase());

        this.puzzle = {
            letters: letters,
            validWords: validSet
        };
        
        console.log('[WordHunt] Puzzle loaded:', data.source_word, 'Target:', this.targetWords, 'Available:', validSet.size);
    }

    renderLetters() {
        // Clear existing interaction mapping but keep/create elements
        // If first render, create elements. If re-render (shuffle?), reusing would be best for animation but
        // sticking to simple recreation for now unless shuffle needs animation.
        // User requested: "animate the letters actually moving to the new shuffled location"
        


        this.ensureLetterElements();
        this.repositionLetters();
    }
    
    ensureLetterElements() {
        const count = this.puzzle.letters.length;
        const step = (2 * Math.PI) / count;
        const startAngle = -Math.PI / 2;

        this.letterCoords = []; // Store center {x, y} for each visually indexed letter
        
        // Map current puzzle.letters to locations
        // AND ensure the correct element (matching the char) moves there
        // WAIT. If I shuffle `this.puzzle.letters`, I have a new order. e.g. ['B', 'A'].
        // I need to find the element for 'B' and move it to slot 0.
        // I need to find the element for 'A' and move it to slot 1.
        // But what if duplicate letters? E.g. "APPLE". 2 Ps. 
        // Need to track elements by unique ID assignation initially.
        
        if (!this.letterIds) {
             // Assign IDs once on first load
             this.letterIds = this.puzzle.letters.map((char, i) => ({ id: i, char }));
             // Create elements mapped to these IDs
             this.letterEls = this.letterIds.map(item => {
                 const el = document.createElement('div');
                 el.className = 'wh-letter';
                 el.textContent = item.char;
                 this.els.board.appendChild(el);
                 return { el, id: item.id, char: item.char };
             });
        }
        
        // Now `this.puzzle.letters` is just an array of chars. It doesn't tell us WHICH 'P' is required where.
        // Actually, for the game logic (drag), we just need to know "Slot 0 is P".
        // For visual animation, we want "The P that was at slot 2 is now at slot 0".
        // So `shuffleLetters` should operate on `this.letterEls` (the array of specific elements).
        // Then regenerate `this.puzzle.letters` from the new order of elements.
    }

    shuffleLetters() {
        // Shuffle the element wrappers
        for (let i = this.letterEls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.letterEls[i], this.letterEls[j]] = [this.letterEls[j], this.letterEls[i]];
        }
        
        // Update puzzle data to match new visual order
        this.puzzle.letters = this.letterEls.map(item => item.char);
        
        // Clear drag path if any
        this.clearPath();
        
        // Animate to new positions
        this.repositionLetters();
    }

    repositionLetters() {
        const count = this.letterEls.length;
        const step = (2 * Math.PI) / count;
        const startAngle = -Math.PI / 2;
        
        this.letterCoords = [];

        this.letterEls.forEach((item, i) => {
            const angle = startAngle + (i * step);
            const x = this.center.x + this.radius * Math.cos(angle);
            const y = this.center.y + this.radius * Math.sin(angle);
            
            this.letterCoords.push({ x, y });
            
            item.el.style.left = x + 'px';
            item.el.style.top = y + 'px';
            item.el.dataset.index = i; // Crucial: update index for drag logic
        });
    }

    setupInteractions() {
        // Handle events on the Board container
        const board = this.els.board;

        const onStart = (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.currentPath = [];
            
            const point = this.getEventPoint(e);
            const idx = this.getNearestLetter(point);
            
            if (idx !== -1) {
                this.addToPath(idx);
            }
        };

        const onMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            
            const point = this.getEventPoint(e);
            
            // Draw line to current finger position
            this.drawPath(point);
            
            // Check if entered new letter
            const idx = this.getNearestLetter(point);
            if (idx !== -1) {
                // If it's the last one we added, do nothing
                if (this.currentPath.length > 0 && this.currentPath[this.currentPath.length - 1] === idx) {
                    return;
                }
                
                // If it's already in path (backtracking?), truncate path back to it?
                const existingIdx = this.currentPath.indexOf(idx);
                if (existingIdx !== -1) {
                    // Backtrack
                    this.removeFromPath(existingIdx + 1);
                } else {
                    // Add new
                    this.addToPath(idx);
                }
            }
        };

        const onEnd = (e) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.submitWord();
            this.clearPath();
        };

        board.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        board.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }

    getEventPoint(e) {
        const rect = this.els.board.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    getNearestLetter(point) {
        // Find letter within threshold distance
        const threshold = 30; // 30px radius hit testing
        
        for (let i = 0; i < this.letterCoords.length; i++) {
            const coord = this.letterCoords[i];
            const dx = point.x - coord.x;
            const dy = point.y - coord.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < threshold) {
                return i;
            }
        }
        return -1;
    }

    addToPath(idx) {
        this.currentPath.push(idx);
        this.letterEls[idx].el.classList.add('active'); // Access .el property
        this.updateCurrentWord();
        this.drawPath(); 
    }
    
    removeFromPath(startIndex) {
        const removed = this.currentPath.splice(startIndex);
        removed.forEach(idx => {
            this.letterEls[idx].el.classList.remove('active'); // Access .el property
        });
        this.updateCurrentWord();
        this.drawPath();
    }

    clearPath() {
        this.currentPath.forEach(idx => {
            this.letterEls[idx].el.classList.remove('active');
        });
        this.currentPath = [];
        this.drawPath(); 
        this.els.currentWord.textContent = '';
    }

    drawPath(dragPoint = null) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 360, 360); // 360 Size
        
        if (this.currentPath.length === 0) return;

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000';   
        
        // Move to first letter
        const first = this.letterCoords[this.currentPath[0]];
        ctx.moveTo(first.x, first.y);

        // Connect rest
        for (let i = 1; i < this.currentPath.length; i++) {
            const p = this.letterCoords[this.currentPath[i]];
            ctx.lineTo(p.x, p.y);
        }

        // Connect to drag point if exists
        if (dragPoint) {
            ctx.lineTo(dragPoint.x, dragPoint.y);
        }

        ctx.stroke();
    }

    updateCurrentWord() {
        // Use puzzle.letters which is updated on shuffle
        const word = this.currentPath.map(idx => this.puzzle.letters[idx]).join('');
        this.els.currentWord.textContent = word;
        this.els.currentWord.className = 'wh-current-word'; 
    }

    submitWord() {
        const word = this.currentPath.map(idx => this.puzzle.letters[idx]).join('').toLowerCase();
        
        if (word.length < 3) return; 

        if (this.puzzle.validWords.has(word)) {
            if (!this.foundWords.has(word)) {
                // SUCCESS
                this.foundWords.add(word);
                this.addFoundWordUI(word);
                this.els.currentWord.textContent = word.toUpperCase();
                this.els.currentWord.classList.add('success');
                this.updateProgress();
                
                if (this.foundWords.size >= this.targetWords) {
                    setTimeout(() => this.completeGame(), 800);
                }
            } else {
                // Already found
                this.els.currentWord.textContent = 'ALREADY FOUND';
                this.els.currentWord.classList.add('shake');
            }
        } else {
            // Invalid
             this.els.currentWord.classList.add('shake');
        }
    }

    addFoundWordUI(word) {
        // 1. Create Placeholder in List
        const targetEl = document.createElement('div');
        targetEl.className = 'wh-found-word';
        targetEl.textContent = word.toUpperCase();
        targetEl.style.opacity = '0'; // Keep hidden until flight arrives
        this.els.foundList.appendChild(targetEl); // This reserves the layout space

        // 2. Setup flight params
        const startEl = this.els.currentWord;
        const startRect = startEl.getBoundingClientRect();
        const endRect = targetEl.getBoundingClientRect();

        // 3. Create Flying Element
        const flyer = document.createElement('div');
        flyer.className = 'wh-flying-word';
        flyer.textContent = word.toUpperCase();
        
        // Initial State (Match current word header)
        // We use fixed positioning based on viewport rects
        flyer.style.left = startRect.left + 'px';
        flyer.style.top = startRect.top + 'px';
        flyer.style.width = startRect.width + 'px';
        flyer.style.height = startRect.height + 'px';
        flyer.style.fontSize = '28px'; // Match .wh-current-word
        
        document.body.appendChild(flyer);

        // 4. Animate
        requestAnimationFrame(() => {
            // Force reflow
            flyer.getBoundingClientRect();
            
            // Final State (Match target list item)
            flyer.style.left = endRect.left + 'px';
            flyer.style.top = endRect.top + 'px';
            flyer.style.width = endRect.width + 'px';
            flyer.style.height = endRect.height + 'px';
            flyer.style.fontSize = '14px'; // Match .wh-found-word
            flyer.style.padding = '6px 12px'; // Match target padding
            // Ensure background/color matches target
            flyer.style.background = '#000';
            flyer.style.color = '#fff';
        });

        // 5. Cleanup
        flyer.addEventListener('transitionend', () => {
            flyer.remove();
            targetEl.style.opacity = '1';
            targetEl.style.animation = 'none'; // Disable popIn since flight did the job
        });
    }

    updateProgress() {
        this.els.progress.textContent = `Found: ${this.foundWords.size} / ${this.targetWords}`;
    }

    completeGame() {
        const timeSpent = ((Date.now() - this.startTime) / 1000).toFixed(1) + 's';
        this.context.onComplete({
            passed: true,
            meta: {
                time: timeSpent,
                wordsFound: `${this.foundWords.size} / ${this.targetWords}`,
                totalPossible: this.puzzle.validWords.size
            }
        });
    }
}

export function createGame(metrics) {
    return new WordHuntGame(metrics);
}
