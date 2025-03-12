async function handleChatGPT() {
    const isDisabled = await checkIfDisabled();
    if (isDisabled) return;

    const url = new URL(window.location.href);
    const settings = await getChatSettings();

    if (url.pathname === "/") {
        if (settings.chatMode === 'temporary' && !url.searchParams.has("temporary-chat")) {
            const tempButton = document.querySelector('button[aria-label="Temporary"]');
            if (tempButton && !tempButton.disabled) {
                tempButton.click();
            }
        } else if (settings.chatMode === 'project' && settings.projectId) {
            window.location.href = `https://chatgpt.com/g/${settings.projectId}/project`;
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

function getChatSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["chatMode", "projectId"], (result) => {
            resolve({
                chatMode: result.chatMode || 'temporary',
                projectId: result.projectId || ''
            });
        });
    });
}

const observer = new MutationObserver(handleChatGPT);
observer.observe(document.body, { childList: true, subtree: true });
handleChatGPT();