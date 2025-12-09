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
            switchBtn.title = 'Switch Game';
            switchBtn.innerHTML = '🔀'; // Shuffle icon
            switchBtn.onclick = onSwitch;
            
            // Inline generic styles for the button to ensure it looks good immediately
            switchBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.05);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, transform 0.2s;
                z-index: 10;
            `;
            // Hover effect via JS since inline pseudo-classes are hard
            switchBtn.onmouseenter = () => {
                switchBtn.style.background = 'rgba(0, 0, 0, 0.1)';
                switchBtn.style.transform = 'rotate(180deg)';
            };
            switchBtn.onmouseleave = () => {
                switchBtn.style.background = 'rgba(0, 0, 0, 0.05)';
                switchBtn.style.transform = 'rotate(0deg)';
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
                container.innerHTML = '';
                container.appendChild(brand);
                if (switchBtn) container.appendChild(switchBtn);
            },
            
            showCompletion: (stats, onExit) => {
                container.innerHTML = ''; // Clear game

                // Inject Sleek Styles
                const style = document.createElement('style');
                style.textContent = `
                    .gate-stat-row {
                        display: flex;
                        justify-content: center;
                        gap: 40px;
                        width: 100%;
                        margin: 30px 0;
                    }
                    .gate-stat-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 120px;
                        text-align: center;
                    }
                    .gate-stat-value {
                        font-family: 'Inter', sans-serif;
                        font-size: 36px;
                        font-weight: 700;
                        color: #000;
                        line-height: 1.2;
                    }
                    .gate-stat-label {
                        font-family: 'Inter', sans-serif;
                        font-size: 12px;
                        color: #888;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-top: 5px;
                        font-weight: 500;
                    }
                    .gate-exit-btn {
                        background: #000;
                        color: white;
                        border: none;
                        padding: 14px 32px;
                        font-size: 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        font-weight: 600;
                        transition: transform 0.2s, background 0.2s;
                        letter-spacing: 0.5px;
                    }
                    .gate-exit-btn:hover {
                        background: #333;
                        transform: translateY(-2px);
                    }
                `;
                container.appendChild(style);
                
                // Branding
                const brand = document.createElement('div');
                brand.className = 'gate-brand';
                brand.textContent = 'Low Key Smarter';
                brand.style.cssText = `
                    font-family: 'Inter', sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: #333;
                    margin-bottom: 10px;
                    letter-spacing: -0.02em;
                `;
                container.appendChild(brand);

                // Success Message
                const title = document.createElement('div');
                title.textContent = 'Session Unlocked';
                title.style.cssText = `
                    font-family: 'Inter', sans-serif;
                    font-size: 16px;
                    color: #27ae60;
                    margin-bottom: 20px;
                    font-weight: 600;
                    background: #e8f5e9;
                    padding: 6px 12px;
                    border-radius: 20px;
                `;
                container.appendChild(title);

                // Stats
                if (stats) {
                    const row = document.createElement('div');
                    row.className = 'gate-stat-row';
                    
                    Object.entries(stats).forEach(([key, value]) => {
                        const item = document.createElement('div');
                        item.className = 'gate-stat-item';
                        
                        const labelText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        
                        item.innerHTML = `
                            <div class="gate-stat-value">${value}</div>
                            <div class="gate-stat-label">${labelText}</div>
                        `;
                        row.appendChild(item);
                    });
                    container.appendChild(row);
                }

                // Exit Button
                const btn = document.createElement('button');
                btn.className = 'gate-exit-btn';
                btn.textContent = 'Enter Site';
                btn.onclick = () => onExit();
                container.appendChild(btn);
            }
        };
    }
};
