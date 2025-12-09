export const GateOverlay = {
    create: (onSwitch) => {
        let host = document.getElementById('lowkey-smarter-host');
        let shadow, container, overlay;

        if (host) {
            console.log('[GateOverlay] Reusing existing overlay host');
            shadow = host.shadowRoot;
            overlay = shadow.getElementById('gate-overlay-root');
            container = overlay.querySelector('.gate-container');
            
            // Clear previous game content but keep container
            container.innerHTML = '';
        } else {
            console.log('[GateOverlay] Creating new overlay host');
            host = document.createElement('div');
            host.id = 'lowkey-smarter-host';
            shadow = host.attachShadow({mode: 'open'});

            // Helper to load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('src/content/overlay/overlay.css');
            shadow.appendChild(link);

            overlay = document.createElement('div');
            overlay.id = 'gate-overlay-root';
            
            container = document.createElement('div');
            container.className = 'gate-container';
            
            overlay.appendChild(container);
            shadow.appendChild(overlay);
            document.body.appendChild(host);
        }
        
        document.body.style.overflow = 'hidden';

        // Re-inject core elements (Switch Btn + Brand)
        // Switch Button
        let switchBtn = null;
        if (onSwitch) {
            switchBtn = document.createElement('button');
            switchBtn.className = 'gate-switch-btn';
            switchBtn.title = 'Play A Different Game';
            switchBtn.innerHTML = 'PLAY A DIFFERENT GAME';
            switchBtn.onclick = onSwitch;
            
            // Inline generic styles for the button to ensure it looks good immediately
            switchBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: #000;
                color: #fff;
                border: none;
                border-radius: 0;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 700;
                font-family: 'Inter', sans-serif;
                letter-spacing: 1px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, transform 0.2s;
                z-index: 10;
            `;
            // Hover effect via JS since inline pseudo-classes are hard
            switchBtn.onmouseenter = () => {
                switchBtn.style.background = '#333';
            };
            switchBtn.onmouseleave = () => {
                switchBtn.style.background = '#000';
            };

            container.appendChild(switchBtn);
        }
        
        // Branding
        
        // Branding
        const brand = document.createElement('div');
        brand.className = 'gate-brand';
        brand.textContent = 'LOWKEY SMARTER';
        brand.style.cssText = `
            font-family: 'Inter', sans-serif;
            font-size: 24px;
            font-weight: 800;
            color: #333;
            margin-bottom: 20px;
            letter-spacing: -0.02em;
        `;
        container.appendChild(brand);

        overlay.appendChild(container);

        shadow.appendChild(overlay);
        document.body.appendChild(host);
        document.body.style.overflow = 'hidden';

        return {
            shadow,
            host,
            container,
            remove: () => {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    host.remove();
                    document.body.style.overflow = '';
                }, 400);
            },
            
            reset: () => {
                container.style.transition = 'none';
                container.style.opacity = '1';
                container.innerHTML = '';
                container.appendChild(brand);
                if (switchBtn) container.appendChild(switchBtn);
            },
            
            showCompletion: (gameName, stats, onExit, onPlayAgain) => {
                // 1. Initial Delay before fading out
                setTimeout(() => {
                    // 2. Fade Out
                    container.style.transition = 'opacity 0.5s ease-in-out';
                    container.style.opacity = '0';

                    // 3. Wait for Fade Out, then Swap Content
                    setTimeout(() => {
                        container.innerHTML = ''; // Clear game

                        // Inject Sleek Styles
                        const style = document.createElement('style');
                        style.textContent = `
                            .gate-main-wrapper {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                max-width: 800px;
                                width: 90%;
                                /* Flattened Look */
                                background: transparent;
                                padding: 0;
                                box-shadow: none;
                                text-align: left;
                            }
                            
                            .gate-header-row {
                                width: 100%;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #000; /* Black underline */
                                padding-bottom: 20px;
                                text-align: center;
                            }

                            .gate-brand-completion {
                                font-family: 'Inter', sans-serif;
                                font-size: 28px;
                                font-weight: 800;
                                color: #000;
                                letter-spacing: -0.02em;
                                text-transform: uppercase;
                            }

                            .gate-split-body {
                                display: flex;
                                gap: 40px;
                                width: 100%;
                                align-items: stretch; /* Equal height */
                            }

                            .gate-left-col {
                                flex: 1;
                                display: flex;
                                /* Sharp corners */
                                border-radius: 0;
                                overflow: visible;
                                aspect-ratio: 1; /* Force Square */
                            }

                            .gate-completion-gif {
                                width: 100%;
                                height: 100%;
                                object-fit: cover; /* Fills square */
                                display: block;
                                /* No borders or shadows */
                                border-radius: 0;
                                box-shadow: none;
                            }

                            .gate-right-col {
                                flex: 1.2;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                            }

                            .gate-congrats-msg {
                                font-family: 'Inter', sans-serif;
                                font-size: 24px;
                                color: #000;
                                font-weight: 700;
                                margin-bottom: 20px;
                                line-height: 1.3;
                            }

                            .gate-stat-row {
                                display: flex;
                                flex-wrap: wrap; 
                                gap: 30px;
                                margin-bottom: 30px;
                            }

                            .gate-stat-item {
                                display: flex;
                                flex-direction: column;
                                min-width: 80px;
                            }

                            .gate-stat-value {
                                font-family: 'Inter', sans-serif;
                                font-size: 32px;
                                font-weight: 700;
                                color: #000;
                            }

                            .gate-stat-label {
                                font-family: 'Inter', sans-serif;
                                font-size: 11px;
                                color: #888;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                margin-top: 5px;
                                font-weight: 600;
                            }

                            .gate-btn-row {
                                display: flex;
                                gap: 15px;
                                margin-top: auto; /* Push to bottom if space permits */
                            }

                            .gate-exit-btn {
                                background: #000;
                                color: white;
                                border: none;
                                padding: 14px 28px;
                                font-size: 14px;
                                border-radius: 0;
                                cursor: pointer;
                                font-family: 'Inter', sans-serif;
                                font-weight: 700;
                                transition: transform 0.2s, background 0.2s;
                                letter-spacing: 0.5px;
                                text-transform: uppercase;
                            }
                            .gate-exit-btn:hover {
                                background: #333;
                                transform: translateY(-2px);
                            }
                        `;
                        container.appendChild(style);

                        // Main Wrapper
                        const mainWrapper = document.createElement('div');
                        mainWrapper.className = 'gate-main-wrapper';

                        // --- HEADER ROW ---
                        const headerRow = document.createElement('div');
                        headerRow.className = 'gate-header-row';
                        
                        const brand = document.createElement('div');
                        brand.className = 'gate-brand-completion';
                        // "Lowkey Smarter: The Name of the Game"
                        brand.textContent = `LOWKEY SMARTER: ${gameName || 'GAME'}`;
                        headerRow.appendChild(brand);
                        
                        mainWrapper.appendChild(headerRow);

                        // --- SPLIT BODY ---
                        const splitBody = document.createElement('div');
                        splitBody.className = 'gate-split-body';

                        // Left (GIF)
                        const leftCol = document.createElement('div');
                        leftCol.className = 'gate-left-col';
                        
                        const gifNum = Math.floor(Math.random() * 15) + 1;
                        const gifStr = String(gifNum).padStart(3, '0');
                        const gifUrl = chrome.runtime.getURL(`images/completion/completion${gifStr}.gif`);
                        
                        const gifImg = document.createElement('img');
                        gifImg.className = 'gate-completion-gif';
                        gifImg.src = gifUrl;
                        leftCol.appendChild(gifImg);
                        splitBody.appendChild(leftCol);

                        // Right (Content)
                        const rightCol = document.createElement('div');
                        rightCol.className = 'gate-right-col';

                        // Message
                        const msg = document.createElement('div');
                        msg.className = 'gate-congrats-msg';
                        msg.textContent = 'Congrats on completing the session!';
                        rightCol.appendChild(msg);

                        // Stats
                        if (stats) {
                            const row = document.createElement('div');
                            row.className = 'gate-stat-row';
                            
                            Object.entries(stats).forEach(([key, value]) => {
                                const item = document.createElement('div');
                                item.className = 'gate-stat-item';
                                // Format CamelCase -> Title Case
                                const labelText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                
                                item.innerHTML = `
                                    <div class="gate-stat-value">${value}</div>
                                    <div class="gate-stat-label">${labelText}</div>
                                `;
                                row.appendChild(item);
                            });
                            rightCol.appendChild(row);
                        }

                        // Buttons
                        const btnContainer = document.createElement('div');
                        btnContainer.className = 'gate-btn-row';

                        const btnAgain = document.createElement('button');
                        btnAgain.className = 'gate-exit-btn';
                        btnAgain.textContent = 'PLAY AGAIN';
                        btnAgain.style.background = 'white';
                        btnAgain.style.color = 'black';
                        btnAgain.style.border = '2px solid black';
                        btnAgain.onclick = () => onPlayAgain && onPlayAgain();
                        btnAgain.onmouseenter = () => { btnAgain.style.background = '#f0f0f0'; };
                        btnAgain.onmouseleave = () => { btnAgain.style.background = 'white'; };

                        const btnExit = document.createElement('button');
                        btnExit.className = 'gate-exit-btn';
                        btnExit.textContent = 'ENTER SITE';
                        btnExit.onclick = () => onExit();
                        
                        btnContainer.appendChild(btnAgain);
                        btnContainer.appendChild(btnExit);
                        rightCol.appendChild(btnContainer);

                        splitBody.appendChild(rightCol);
                        mainWrapper.appendChild(splitBody);

                        container.appendChild(mainWrapper);

                        // 4. Fade In New Content
                        // Force Reflow
                        void container.offsetWidth;
                        container.style.opacity = '1';

                    }, 500); // End Fade Out Wait
                }, 500); // End Initial Delay
            }
        };
    }
};
