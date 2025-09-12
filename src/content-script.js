// Content script for Core SERP Vitals settings handshake
(function () {
  // Listen for requests from the page for settings
  window.addEventListener('message', function (event) {
    if (event.source !== window) return
    if (event.data && event.data.type === 'CORE_SERP_VITALS_SETTINGS_REQUEST') {
      // Fetch settings from chrome.storage and post to page
      Promise.all([
        new Promise(resolve => chrome.storage.sync.get('apiKey', resolve)),
        new Promise(resolve => chrome.storage.sync.get('deviceSettings', resolve)),
        new Promise(resolve => chrome.storage.sync.get('levelSettings', resolve))
      ]).then(([cruxKey, device, level]) => {
        const settings = {
          cruxKey: cruxKey.apiKey || '',
          vitalsLevel: level.levelSettings || 'URL',
          vitalsDevice: device.deviceSettings || 'PHONE'
        }
        window.postMessage({
          type: 'CORE_SERP_VITALS_SETTINGS',
          settings: settings
        }, '*')
      })
    }
  })
})()
