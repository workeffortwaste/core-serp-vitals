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

const runtimeInjection = async (settings) => {
  window.vitalsLevel = settings.level
  window.cruxKey = settings.cruxKey
  window.vitalsDevice = settings.vitalsDevice
}

const validLocation = async () => {
  return location.pathname === '/search'
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url !== undefined) {
    /* Abort if we're not on a search page */
    if (new URL(tab.url).pathname !== '/search') return

    const cruxKey = await getLocalStorageValue('apiKey')
    let device = await getLocalStorageValue('deviceSettings')
    let level = await getLocalStorageValue('levelSettings')

    if (Object.keys(device).length === 0) { device = { deviceSettings: 'PHONE' } }
    if (Object.keys(level).length === 0) { level = { levelSettings: 'URL' } }

    const settings = {
      cruxKey: cruxKey.apiKey,
      level: level.levelSettings,
      vitalsDevice: device.deviceSettings
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runtimeInjection,
      args: [settings]
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['bundle.js']
      })
    })
  }
})
