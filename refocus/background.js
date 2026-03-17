// background.js
// background service worker for the extension
// detecting which website is being used, tracking time used, checking if time limit is exceeded, triggering block when limit is exceeded

import { addManagedSite, getManagedSites, getUsage, saveUsage } from "./storage.js";

let activeDomain = null;

function getDomain(url) {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return null;
    }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    activeDomain = getDomain(tab.url);
    console.log("Active domain:", activeDomain);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        activeDomain = getDomain(tab.url);
        console.log("Active domain updated:", activeDomain);
    }
});