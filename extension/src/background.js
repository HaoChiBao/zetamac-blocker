
// Background Service Worker

// Listen for History API updates (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId === 0) { // Top-level frame only
        console.log('[Background] History state updated:', details.url);
        
        // Notify content script to re-check gate
        chrome.tabs.sendMessage(details.tabId, {
            action: 'CHECK_GATE',
            url: details.url
        }).catch(err => {
            // Content script might not be ready or page context invalid
             // console.warn('[Background] Failed to send message:', err);
        });
    }
});
