async function enableTemporaryChat() {
    const isDisabled = await checkIfDisabled();
    if (isDisabled) return;

    const url = new URL(window.location.href);

    if (url.pathname === "/" && !url.searchParams.has("temporary-chat")) {
        const button = document.querySelector('button[aria-label="Temporary"]');
        
        if (button && !button.disabled) {
            button.click();
        }
    }
}

function checkIfDisabled() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["disableUntil"], (result) => {
            const disableUntil = result.disableUntil || 0;
            const now = Date.now();
            resolve(now < disableUntil || disableUntil === -1);
        });
    });
}

const observer = new MutationObserver(enableTemporaryChat);
observer.observe(document.body, { childList: true, subtree: true });

enableTemporaryChat();
