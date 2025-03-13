async function handleClaude() {
    const isDisabled = await checkIfDisabled();
    if (isDisabled) return;

    const url = new URL(window.location.href);
    const settings = await getChatSettings();

    if (url.pathname === "/new" && settings.chatMode === 'project' && settings.projectId) {
        window.location.href = `https://claude.ai/project/${settings.projectId}`;
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
        chrome.storage.local.get(["chatModeClaude", "projectIdClaude"], (result) => {
            resolve({
                chatMode: result.chatModeClaude || 'nothing',
                projectId: result.projectIdClaude || ''
            });
        });
    });
}

const observer = new MutationObserver(handleClaude);
observer.observe(document.body, { childList: true, subtree: true });
handleClaude();