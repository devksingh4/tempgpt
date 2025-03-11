chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ disableUntil: 0 });
});
