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
            const statusDot = document.getElementById("status-dot");
            const disableUntil = result.disableUntil;
            const now = Date.now();
            
            if (disableUntil === -1) {
                statusElement.innerText = "Permanently Disabled";
                statusElement.style.color = "#e74c3c"; // Red text
                statusDot.style.backgroundColor = "#e74c3c"; // Red dot
                clearInterval(statusUpdater);
            } else if (!disableUntil || disableUntil <= now) {
                statusElement.innerText = "Enabled";
                statusElement.style.color = "#2ecc71"; // Green text
                statusDot.style.backgroundColor = "#2ecc71"; // Green dot
                clearInterval(statusUpdater);
            } else {
                const timeLeft = Math.max(0, disableUntil - now);
                statusElement.innerText = `Disabled for ${formatTimeLeft(timeLeft)}`;
                statusElement.style.color = "#e74c3c"; // Red text
                statusDot.style.backgroundColor = "#e74c3c"; // Red dot
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

function saveChatSettings() {
    const chatMode = document.getElementById("chat-mode").value;
    const chatModeClaude = document.getElementById("chat-mode-claude").value;
    const projectId = document.getElementById("project-id").value.trim();
    const projectIdClaude = document.getElementById("project-id-claude").value.trim();
    
    chrome.storage.local.set({
        chatMode,
        projectId,
        chatModeClaude,
        projectIdClaude
    });
}

function loadChatSettings() {
    chrome.storage.local.get(['chatMode', 'projectId', 'chatModeClaude', 'projectIdClaude'], (result) => {
        const chatMode = result.chatMode || 'temporary';
        const projectId = result.projectId || '';
        const chatModeClaude = result.chatModeClaude || 'nothing';
        const projectIdClaude = result.projectIdClaude || '';
        document.getElementById("chat-mode").value = chatMode;
        document.getElementById("project-id").value = projectId;
        document.getElementById("chat-mode-claude").value = chatModeClaude;
        document.getElementById("project-id-claude").value = projectIdClaude;
        toggleProjectInput(chatMode);
        toggleProjectInputClaude(chatModeClaude);
    });
}

function toggleProjectInput(mode) {
    const projectInputs = document.querySelectorAll('.project-input');
    projectInputs.forEach(input => {
        input.style.display = mode === 'project' ? 'block' : 'none';
    });
}

function toggleProjectInputClaude(mode) {
    const projectInputs = document.querySelectorAll('.project-input-claude');
    projectInputs.forEach(input => {
        input.style.display = mode === 'project' ? 'block' : 'none';
    });
}

let statusUpdater;

document.addEventListener("DOMContentLoaded", () => {
    getCurrentStatus();
    loadChatSettings();
    
    document.getElementById("chat-mode").addEventListener("change", (e) => {
        toggleProjectInput(e.target.value);
        saveChatSettings();
    });
    document.getElementById("chat-mode-claude").addEventListener("change", (e) => {
        toggleProjectInputClaude(e.target.value);
        saveChatSettings();
    });
    
    document.getElementById("project-id").addEventListener("change", saveChatSettings);
    document.getElementById("project-id").addEventListener("input", saveChatSettings);
    document.getElementById("project-id-claude").addEventListener("change", saveChatSettings);
    document.getElementById("project-id-claude").addEventListener("input", saveChatSettings);
    
    // Tab functionality
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
});

document.getElementById("disable-15min").addEventListener("click", () => disableFor(15 * 60 * 1000));
document.getElementById("disable-1hr").addEventListener("click", () => disableFor(60 * 60 * 1000));
document.getElementById("disable-24hr").addEventListener("click", () => disableFor(24 * 60 * 60 * 1000));
document.getElementById("disable-forever").addEventListener("click", () => disableFor(-1));
document.getElementById("enable-now").addEventListener("click", () => disableFor(0));