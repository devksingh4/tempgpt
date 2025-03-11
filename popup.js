function disableFor(duration) {
    if (duration === -1) {
        chrome.storage.local.set({ disableUntil: -1 });
    } else {
        const disableUntil = Date.now() + duration;
        chrome.storage.local.set({ disableUntil });
    }
    getCurrentStatus();
}

function getCurrentStatus() {
    function updateStatus() {
        chrome.storage.local.get(['disableUntil'], (result) => {
            const statusElement = document.getElementById("current");
            const disableUntil = result.disableUntil;
            const now = Date.now();

            if (disableUntil === -1) {
                statusElement.innerText = "Permanently Disabled";
                clearInterval(statusUpdater);
            } else if (!disableUntil || disableUntil <= now) {
                statusElement.innerText = "Enabled";
                clearInterval(statusUpdater);
            } else {
                const timeLeft = Math.max(0, disableUntil - now);
                statusElement.innerText = `Disabled for ${formatTimeLeft(timeLeft)}`;
            }
        });
    }

    updateStatus();
    clearInterval(statusUpdater);
    statusUpdater = setInterval(updateStatus, 1000);
}

function formatTimeLeft(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

let statusUpdater;

document.getElementById("disable-15min").addEventListener("click", () => disableFor(15 * 60 * 1000));
document.getElementById("disable-1hr").addEventListener("click", () => disableFor(60 * 60 * 1000));
document.getElementById("disable-24hr").addEventListener("click", () => disableFor(24 * 60 * 60 * 1000));
document.getElementById("disable-forever").addEventListener("click", () => disableFor(-1));
document.getElementById("enable-now").addEventListener("click", () => disableFor(0));
document.addEventListener("DOMContentLoaded", getCurrentStatus);
