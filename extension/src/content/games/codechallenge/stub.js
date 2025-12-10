import { Game } from '../Game.js';
import { config } from './config.js';
import { BACKEND_URL } from './api.js';
import { Modal } from '../../components/Modal.js';

const STYLES = `
.code-game-container {
    width: 100%;
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    color: #000;
    background: #fff;
}

.code-layout {
    display: flex;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    gap: 40px;
}

.left-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-right: 10px;
    text-align: left; /* Force left alignment */
}

.right-panel {
    flex: 1.5;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.code-title {
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 20px;
    letter-spacing: -1px;
    text-transform: uppercase;
    text-align: left;
}

.code-description {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 30px;
    font-weight: 500;
    text-align: left;
}

.test-cases-section {
    margin-top: auto;
    border-top: 2px solid #000;
    padding-top: 20px;
    text-align: left;
}

.section-label {
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 15px;
    letter-spacing: 1px;
}

.example-case {
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #000;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    word-wrap: break-word;
}

.example-label {
    font-weight: 700;
    margin-right: 10px;
}

.editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 2px solid #000;
    position: relative;
    background: #fff;
}

.editor-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
}

.code-textarea, .code-highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    margin: 0;
    border: none;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.6;
    tab-size: 4;
    -moz-tab-size: 4;
    box-sizing: border-box;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left; /* Force left alignment */
}

.code-textarea {
    z-index: 1;
    color: transparent;
    background: transparent;
    caret-color: #000;
    resize: none;
    outline: none;
}

.code-highlight {
    z-index: 0;
    color: #000;
    pointer-events: none;
    overflow: hidden;
}

/* Syntax Highlighting Colors */
.token-keyword { color: #0000ff; font-weight: bold; }
.token-def { color: #a000a0; font-weight: bold; }
.token-type { color: #008000; }
.token-string { color: #a31515; }
.token-number { color: #098658; }
.token-comment { color: #008000; font-style: italic; }
.token-builtin { color: #0000ff; }

.controls-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-top: 2px solid #000;
    background: #fff;
}

.btn-group {
    display: flex;
    gap: 10px;
}

.code-btn {
    padding: 10px 20px;
    border: 2px solid #000;
    background: #fff;
    color: #000;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.1s;
    font-family: 'Inter', sans-serif;
}

.code-btn:hover {
    background: #000;
    color: #fff;
}

.code-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #fff;
    color: #000;
}

.btn-reset {
    border-color: #000;
    background: #f0f0f0;
}

.console-area {
    height: 150px;
    border-top: 2px solid #000;
    background: #f0f0f0;
    overflow-y: auto;
    padding: 15px;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    display: none;
    text-align: left;
}

.console-header {
    font-weight: 700;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.result-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
}

.result-pass { color: #008000; font-weight: 700; }
.result-fail { color: #d00000; font-weight: 700; }

.loading-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #000;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: 5px;
}

@keyframes spin { to { transform: rotate(360deg); } }
`;

export class CodeChallengeGame extends Game {
    constructor(metrics) {
        super(config, metrics);
        this.problem = null;
        this.container = null;
        this.backendUrl = BACKEND_URL;
        this.defaultCode = '';
    }

    async render(container, context) {
        this.container = container;
        
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        container.appendChild(styleEl);

        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<div class="loading-spinner"></div> LOADING PROBLEM...';
        loadingDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
        `;
        container.appendChild(loadingDiv);

        try {
            const response = await fetch(`${this.backendUrl}/problems/random?difficulty=${this.metrics.difficulty || 'easy'}`);
            if (!response.ok) throw new Error('Failed to fetch problem');
            this.problem = await response.json();
            
            container.removeChild(loadingDiv);
            this.renderGameUI(container, context);
        } catch (e) {
            console.error(e);
            container.innerHTML = '';
            
            const errorContainer = document.createElement('div');
            errorContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-family: 'Inter', sans-serif;
                text-align: center;
            `;

            const msg = document.createElement('div');
            msg.textContent = 'ERROR LOADING PROBLEM. THE BACKEND MIGHT BE DOWN.';
            msg.style.cssText = `
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 30px;
                color: #d00000;
            `;
            errorContainer.appendChild(msg);

            const btnRow = document.createElement('div');
            btnRow.style.display = 'flex';
            btnRow.style.gap = '20px';

            // Play Another Game
            const btnSwitch = document.createElement('button');
            btnSwitch.textContent = 'PLAY ANOTHER GAME';
            btnSwitch.style.cssText = `
                padding: 12px 24px;
                background: #000;
                color: #fff;
                border: none;
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                font-family: 'Inter', sans-serif;
            `;
            btnSwitch.onclick = () => {
                if (context.onSwitch) context.onSwitch();
                else window.location.reload();
            };
            btnRow.appendChild(btnSwitch);

            // Exit & Mark Complete
            const btnExit = document.createElement('button');
            btnExit.textContent = 'EXIT & MARK COMPLETE';
            btnExit.style.cssText = `
                padding: 12px 24px;
                background: #fff;
                color: #000;
                border: 2px solid #000;
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                font-family: 'Inter', sans-serif;
            `;
            btnExit.onclick = () => {
                context.onComplete({ passed: true });
            };
            btnRow.appendChild(btnExit);

            errorContainer.appendChild(btnRow);
            container.appendChild(errorContainer);
        }
    }

    renderGameUI(container, context) {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'code-game-container';
        
        // Prepare default code
        const params = this.problem.function.params.map(p => `${p.name}: ${this.mapTypeToPython(p.type)}`).join(', ');
        const returnType = this.mapTypeToPython(this.problem.function.returns);
        const signature = `def ${this.problem.function.name}(${params}) -> ${returnType}:`;
        this.defaultCode = `${signature}\n    # Write your code here\n    pass`;

        // Prepare examples (first 3 tests)
        // FIX: Use t.input instead of t.args, and t.output instead of t.expected
        const examples = this.problem.tests.slice(0, 3).map((t, i) => `
            <div class="example-case">
                <div><span class="example-label">INPUT:</span> ${JSON.stringify(t.input)}</div>
                <div><span class="example-label">OUTPUT:</span> ${JSON.stringify(t.output)}</div>
            </div>
        `).join('');

        gameDiv.innerHTML = `
            <div class="code-layout">
                <div class="left-panel">
                    <div class="code-title">${this.problem.title}</div>
                    <div class="code-description">${this.problem.description}</div>
                    
                    <div class="test-cases-section">
                        <div class="section-label">Example Test Cases</div>
                        ${examples}
                    </div>
                </div>
                
                <div class="right-panel">
                    <div class="editor-container">
                        <div class="editor-wrapper">
                            <pre class="code-highlight" aria-hidden="true"></pre>
                            <textarea class="code-textarea" spellcheck="false">${this.defaultCode}</textarea>
                        </div>
                        <div class="console-area" id="console-area"></div>
                        <div class="controls-area">
                            <button class="code-btn btn-reset" id="btn-reset">Reset</button>
                            <div class="btn-group">
                                <button class="code-btn" id="btn-run">Run Code</button>
                                <button class="code-btn" id="btn-submit">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(gameDiv);

        const textarea = gameDiv.querySelector('.code-textarea');
        const highlight = gameDiv.querySelector('.code-highlight');
        const btnRun = gameDiv.querySelector('#btn-run');
        const btnSubmit = gameDiv.querySelector('#btn-submit');
        const btnReset = gameDiv.querySelector('#btn-reset');
        const consoleArea = gameDiv.querySelector('#console-area');

        // Initial highlight
        this.updateHighlight(textarea.value, highlight);

        // Sync scroll and highlight
        textarea.addEventListener('input', () => this.updateHighlight(textarea.value, highlight));
        textarea.addEventListener('scroll', () => {
            highlight.scrollTop = textarea.scrollTop;
            highlight.scrollLeft = textarea.scrollLeft;
        });

        // Tab and Enter support
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const val = textarea.value;
                // Insert tab character
                textarea.value = val.substring(0, start) + '\t' + val.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
                this.updateHighlight(textarea.value, highlight);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const val = textarea.value;
                
                // Find current line's indentation
                const lineStart = val.lastIndexOf('\n', start - 1) + 1;
                const currentLine = val.substring(lineStart, start);
                const match = currentLine.match(/^[\t ]*/);
                const indentation = match ? match[0] : '';
                
                // Check if previous line ended with colon (simple python auto-indent)
                const extraIndent = currentLine.trim().endsWith(':') ? '\t' : '';
                
                const insertion = '\n' + indentation + extraIndent;
                
                textarea.value = val.substring(0, start) + insertion + val.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
                this.updateHighlight(textarea.value, highlight);
            }
        });

        this.modal = new Modal(container);

        btnReset.addEventListener('click', async () => {
            const confirmed = await this.modal.confirm(
                'Reset Code?', 
                'Are you sure you want to reset your code to the default state? This cannot be undone.',
                'Reset Code',
                'Cancel'
            );
            
            if (confirmed) {
                textarea.value = this.defaultCode;
                this.updateHighlight(textarea.value, highlight);
            }
        });

        const handleExecution = async (type) => {
            const code = textarea.value;
            const btn = type === 'run' ? btnRun : btnSubmit;
            const originalText = btn.textContent;
            
            btnRun.disabled = true;
            btnSubmit.disabled = true;
            btnReset.disabled = true;
            btn.innerHTML = '<div class="loading-spinner"></div>';
            
            consoleArea.style.display = 'none';

            try {
                const res = await fetch(`${this.backendUrl}/submissions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        problemId: this.problem.id,
                        code: code,
                        type: type
                    })
                });
                
                const result = await res.json();
                this.displayResults(result, consoleArea, context, type);
            } catch (e) {
                consoleArea.style.display = 'block';
                consoleArea.innerHTML = `<div style="color: red; font-weight: bold;">ERROR: ${e.message}</div>`;
            } finally {
                btnRun.disabled = false;
                btnSubmit.disabled = false;
                btnReset.disabled = false;
                btn.textContent = originalText;
            }
        };

        btnRun.addEventListener('click', () => handleExecution('run'));
        btnSubmit.addEventListener('click', () => handleExecution('submit'));
    }

    updateHighlight(text, element) {
        // Robust highlighter using placeholders to avoid regex collisions
        const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // 1. Extract strings and comments to protect them
        const parts = [];
        let lastIndex = 0;
        // Match strings ('...', "...") or comments (#...)
        const regex = /((?:'[^']*')|(?:"[^"]*")|(?:#.*$))/gm;
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            // Push preceding code
            if (match.index > lastIndex) {
                parts.push({ type: 'code', content: text.substring(lastIndex, match.index) });
            }
            // Push string/comment
            const content = match[0];
            const type = content.startsWith('#') ? 'comment' : 'string';
            parts.push({ type, content });
            lastIndex = regex.lastIndex;
        }
        // Push remaining code
        if (lastIndex < text.length) {
            parts.push({ type: 'code', content: text.substring(lastIndex) });
        }

        // 2. Process parts
        const processed = parts.map(part => {
            if (part.type === 'comment') {
                return `<span class="token-comment">${escapeHtml(part.content)}</span>`;
            }
            if (part.type === 'string') {
                return `<span class="token-string">${escapeHtml(part.content)}</span>`;
            }
            
            // Process code
            let code = escapeHtml(part.content);
            
            // Use placeholders for replacements to avoid nested tag issues
            // We use a random-ish prefix to avoid collisions with user code
            const P = '___PH___'; 
            const replacements = [];
            const addPlaceholder = (tag, content) => {
                const id = replacements.length;
                replacements.push({ tag, content });
                return `${P}${id}${P}`;
            };

            // Keywords
            code = code.replace(/\b(def|return|if|else|elif|for|while|in|pass|import|from|class|try|except)\b/g, 
                (m) => addPlaceholder('token-keyword', m));
            
            // Builtins
            code = code.replace(/\b(print|len|range|list|dict|set|int|str|bool|float)\b/g, 
                (m) => addPlaceholder('token-builtin', m));
            
            // Function def (lookahead for name)
            code = code.replace(/(def\s+)(\w+)/g, (m, defKw, name) => {
                // defKw might already be replaced if we did keywords first? 
                // Actually, if we replaced 'def', it's now a placeholder.
                // So regex won't match 'def '. 
                // Better to do specific patterns first or handle overlap.
                // Since we replaced keywords, 'def' is hidden.
                // Let's rely on the fact that 'def' is a keyword. 
                // We just want to highlight the function name.
                // But we can't see 'def' anymore.
                return m; // Skip for now, or implement better ordering.
            });
            
            // Types
            code = code.replace(/\b(List|Dict|Set|Optional|Any)\b/g, 
                (m) => addPlaceholder('token-type', m));
                
            // Numbers
            code = code.replace(/\b(\d+)\b/g, 
                (m) => addPlaceholder('token-number', m));

            // Restore placeholders
            return code.replace(new RegExp(`${P}(\\d+)${P}`, 'g'), (m, id) => {
                const r = replacements[parseInt(id)];
                return `<span class="${r.tag}">${r.content}</span>`;
            });
        });

        let html = processed.join('');
        
        // Handle trailing newline
        if (text.endsWith('\n')) {
            html += ' ';
        }

        element.innerHTML = html;
    }

    displayResults(result, container, context, type) {
        container.style.display = 'block';
        container.innerHTML = '';

        if (result.error) {
            container.innerHTML = `<div style="color: #d00000; font-weight: bold; white-space: pre-wrap;">RUNTIME ERROR:\n${result.error}</div>`;
            return;
        }

        const header = document.createElement('div');
        header.className = 'console-header';
        if (result.allPassed) {
            header.style.color = '#008000';
            header.textContent = type === 'submit' ? 'ACCEPTED' : 'ALL TESTS PASSED (RUN MODE)';
        } else {
            header.style.color = '#d00000';
            header.textContent = 'WRONG ANSWER';
        }
        container.appendChild(header);

        result.results.forEach(r => {
            // Container for the whole row (header + details)
            const rowContainer = document.createElement('div');
            rowContainer.style.borderBottom = '1px solid #eee';
            rowContainer.style.marginBottom = '5px';

            // Header (Clickable)
            const rowHeader = document.createElement('div');
            rowHeader.className = 'result-row';
            rowHeader.style.cursor = 'pointer';
            rowHeader.style.display = 'flex';
            rowHeader.style.justifyContent = 'space-between';
            rowHeader.style.padding = '8px 5px';
            rowHeader.style.backgroundColor = '#fff';
            
            const nameSpan = document.createElement('span');
            nameSpan.innerHTML = `<span style="margin-right: 5px;">▶</span> ${r.name}`;
            nameSpan.style.fontWeight = '500';
            
            const statusSpan = document.createElement('span');
            statusSpan.className = r.pass ? 'result-pass' : 'result-fail';
            statusSpan.textContent = r.pass ? 'PASS' : 'FAIL';
            
            rowHeader.appendChild(nameSpan);
            rowHeader.appendChild(statusSpan);
            rowContainer.appendChild(rowHeader);

            // Details Section (Hidden by default)
            const detailsDiv = document.createElement('div');
            detailsDiv.style.display = 'none';
            detailsDiv.style.padding = '10px';
            detailsDiv.style.backgroundColor = '#f9f9f9';
            detailsDiv.style.fontSize = '12px';

            // Toggle logic
            rowHeader.addEventListener('click', () => {
                const isHidden = detailsDiv.style.display === 'none';
                detailsDiv.style.display = isHidden ? 'block' : 'none';
                nameSpan.innerHTML = `<span style="margin-right: 5px;">${isHidden ? '▼' : '▶'}</span> ${r.name}`;
            });

            // Expected / Received (only if failed)
            if (!r.pass && r.expected !== undefined) {
                const comparison = document.createElement('div');
                comparison.style.marginBottom = '10px';
                comparison.innerHTML = `
                    <div style="margin-bottom: 4px;"><strong>Expected:</strong> <code style="background:#eee; padding:2px 4px; border-radius:3px;">${JSON.stringify(r.expected)}</code></div>
                    <div><strong>Received:</strong> <code style="background:#eee; padding:2px 4px; border-radius:3px;">${JSON.stringify(r.received)}</code></div>
                `;
                detailsDiv.appendChild(comparison);
            }

            // Console Output
            if (r.logs && r.logs.trim()) {
                const logsContainer = document.createElement('div');
                logsContainer.style.marginTop = '10px';
                
                const logsLabel = document.createElement('div');
                logsLabel.textContent = 'Console Output:';
                logsLabel.style.fontWeight = 'bold';
                logsLabel.style.color = '#555';
                logsLabel.style.marginBottom = '5px';
                
                const logsContent = document.createElement('pre');
                logsContent.textContent = r.logs;
                logsContent.style.backgroundColor = '#333';
                logsContent.style.color = '#fff';
                logsContent.style.padding = '8px';
                logsContent.style.borderRadius = '4px';
                logsContent.style.whiteSpace = 'pre-wrap';
                logsContent.style.margin = '0';

                logsContainer.appendChild(logsLabel);
                logsContainer.appendChild(logsContent);
                detailsDiv.appendChild(logsContainer);
            } else if (!r.logs || !r.logs.trim()) {
                 const noLogs = document.createElement('div');
                 noLogs.textContent = 'No console output.';
                 noLogs.style.color = '#999';
                 noLogs.style.fontStyle = 'italic';
                 detailsDiv.appendChild(noLogs);
            }

            rowContainer.appendChild(detailsDiv);
            container.appendChild(rowContainer);
        });

        if (result.allPassed && type === 'submit') {
            setTimeout(() => {
                context.onComplete({
                    passed: true,
                    meta: {
                        problem: this.problem.title,
                        difficulty: this.problem.difficulty
                    }
                });
            }, 1500);
        }
    }

    mapTypeToPython(type) {
        if (type === 'number') return 'int';
        if (type === 'string') return 'str';
        if (type === 'boolean') return 'bool';
        if (type === 'number[]') return 'List[int]';
        if (type === 'string[]') return 'List[str]';
        if (type === 'ListNode') return 'Optional[ListNode]';
        if (type === 'TreeNode') return 'Optional[TreeNode]';
        return 'Any';
    }

    destroy() {
        this.container = null;
    }
}

export function createGame(metrics) {
    return new CodeChallengeGame(metrics);
}
