chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'options.html' })
  }
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
    let device = await getLocalStorageValue('deviceSettings')

    if (Object.keys(device).length === 0) { device = { deviceSettings: 'PHONE' } }

    chrome.tabs.executeScript(tab.id, {
      code: 'window.cruxKey = "' + cruxKey.apiKey + '"; window.vitalsDevice = "' + device.deviceSettings + '"'
    }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'bundle.js' })
    })
  }
})
