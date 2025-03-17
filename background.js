async function updateRedirectRules() {
    const settingsGPT = await getChatSettingsChatGPT();
    const settingsClaude = await getChatSettingsClaude();

    // Remove existing rules
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3, 4], // Remove previous rules
        addRules: [
            // ChatGPT: Temporary Chat Mode
            settingsGPT.chatMode === "temporary" ? {
                "id": 1,
                "priority": 1,
                "action": {
                    "type": "redirect",
                    "redirect": {
                        "url": "https://chatgpt.com/?temporary-chat=true"
                    }
                },
                "condition": {
                    "urlFilter": "https://chatgpt.com/",
                    "resourceTypes": ["main_frame"]
                }
            } : null,

            // ChatGPT: Project Redirect
            (settingsGPT.chatMode === "project" && settingsGPT.projectId) ? {
                "id": 2,
                "priority": 1,
                "action": {
                    "type": "redirect",
                    "redirect": {
                        "url": `https://chatgpt.com/g/${settingsGPT.projectId}/project`
                    }
                },
                "condition": {
                    "urlFilter": "https://chatgpt.com/",
                    "resourceTypes": ["main_frame"]
                }
            } : null,

            // Claude: Project Redirect
            (settingsClaude.chatMode === "project" && settingsClaude.projectId) ? {
                "id": 3,
                "priority": 1,
                "action": {
                    "type": "redirect",
                    "redirect": {
                        "url": `https://claude.ai/project/${settingsClaude.projectId}`
                    }
                },
                "conditions": [
                {
                    "urlFilter": "https://claude.ai/new",
                    "resourceTypes": ["main_frame"]
                },
                {
                    "urlFilter": "https://claude.ai/",
                    "resourceTypes": ["main_frame"]
                }
                ]
            } : null
        ].filter(Boolean)
    });
}

function getChatSettingsChatGPT() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["chatMode", "projectId"], (result) => {
            resolve({
                chatMode: result.chatMode || "nothing",
                projectId: result.projectId || ""
            });
        });
    });
}

function getChatSettingsClaude() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["chatModeClaude", "projectIdClaude"], (result) => {
            resolve({
                chatMode: result.chatModeClaude || "nothing",
                projectId: result.projectIdClaude || ""
            });
        });
    });
}

chrome.storage.onChanged.addListener(updateRedirectRules);
chrome.runtime.onInstalled.addListener(updateRedirectRules);
chrome.runtime.onStartup.addListener(updateRedirectRules);
