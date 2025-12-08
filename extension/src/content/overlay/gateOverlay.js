export const GateOverlay = {
    create: () => {
        const host = document.createElement('div');
        host.id = 'lowkey-smarter-host';
        const shadow = host.attachShadow({mode: 'open'});

        // Helper to load CSS
        // Since we are in an isolated world or main world, loading CSS from file is trickier without extension API or inline.
        // We'll use <link> to chrome.runtime.getURL for simplicity if web_accessible_resources allows, 
        // OR simpler: just inline the styles for now to ensure it works without complex build or fetch.
        // But wait, the file structure has overlay.css. Let's try to load it.
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('src/content/overlay/overlay.css');
        shadow.appendChild(link);

        const overlay = document.createElement('div');
        overlay.id = 'gate-overlay-root';
        
        const container = document.createElement('div');
        container.className = 'gate-container';
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
            }
        };
    }
};
