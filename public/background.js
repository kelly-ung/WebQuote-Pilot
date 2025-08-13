// This script will run when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['geminiApiKey'], (result) => {
        if (!result.geminiApiKey) { 
            chrome.tabs.create({ url: "options.html" }); // Open options page if API key is not set
        }
    });
});