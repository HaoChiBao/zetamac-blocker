export class Modal {
    constructor(container) {
        this.container = container;
        this.injectStyles();
    }

    injectStyles() {
        if (this.container.querySelector('#zetamac-modal-styles')) return;

        const styles = `
            .zetamac-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
                animation: fadeIn 0.2s ease-out;
            }
            .zetamac-modal {
                background: #fff;
                border: 2px solid #000;
                padding: 30px;
                width: 400px;
                max-width: 90%;
                box-shadow: 8px 8px 0px #000;
                transform: translateY(0);
                animation: slideUp 0.2s ease-out;
            }
            .zetamac-modal-title {
                font-size: 24px;
                font-weight: 900;
                text-transform: uppercase;
                margin-bottom: 15px;
                color: #000;
                letter-spacing: -0.5px;
            }
            .zetamac-modal-message {
                font-size: 14px;
                margin-bottom: 30px;
                line-height: 1.5;
                color: #000;
                font-weight: 500;
            }
            .zetamac-modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
            }
            .zetamac-modal-btn {
                padding: 12px 24px;
                border: 2px solid #000;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.1s;
                font-family: 'Inter', sans-serif;
            }
            .zetamac-modal-btn-confirm {
                background: #000;
                color: #fff;
            }
            .zetamac-modal-btn-confirm:hover {
                background: #333;
                transform: translate(-2px, -2px);
                box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
            }
            .zetamac-modal-btn-confirm:active {
                transform: translate(0, 0);
                box-shadow: none;
            }
            .zetamac-modal-btn-cancel {
                background: #fff;
                color: #000;
            }
            .zetamac-modal-btn-cancel:hover {
                background: #f0f0f0;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'zetamac-modal-styles';
        styleEl.textContent = styles;
        this.container.appendChild(styleEl); 
    }

    confirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'zetamac-modal-overlay';
            overlay.innerHTML = `
                <div class="zetamac-modal">
                    <div class="zetamac-modal-title">${title}</div>
                    <div class="zetamac-modal-message">${message}</div>
                    <div class="zetamac-modal-actions">
                        <button class="zetamac-modal-btn zetamac-modal-btn-cancel">${cancelText}</button>
                        <button class="zetamac-modal-btn zetamac-modal-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            const btnConfirm = overlay.querySelector('.zetamac-modal-btn-confirm');
            const btnCancel = overlay.querySelector('.zetamac-modal-btn-cancel');

            const cleanup = () => {
                // Add fade out animation?
                this.container.removeChild(overlay);
            };

            btnConfirm.onclick = () => {
                cleanup();
                resolve(true);
            };

            btnCancel.onclick = () => {
                cleanup();
                resolve(false);
            };

            // Close on background click
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            };

            this.container.appendChild(overlay);
            
            // Focus confirm button for a11y/UX
            btnConfirm.focus();
        });
    }
}
