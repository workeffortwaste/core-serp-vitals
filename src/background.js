chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'options.html' })
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url !== undefined) {
    /* Abort if we're not on a search page */
    if (new URL(tab.url).pathname !== '/search') return

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['bundle.js']
    })
  }
})
