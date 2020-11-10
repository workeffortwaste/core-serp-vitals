chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'options.html' })
})

async function getLocalStorageValue (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(key, (value) => { resolve(value) })
    } catch (ex) {
      reject(ex)
    }
  })
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url !== undefined) {
    const cruxKey = await getLocalStorageValue('apiKey')
    chrome.tabs.executeScript(tab.id, {
      code: 'window.cruxKey = "' + cruxKey.apiKey + '"'
    }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'bundle.js' })
    })
  }
})
