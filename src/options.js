function save_options () {
  const apiKey = document.getElementById('apiKey').value
  const deviceSettings = document.getElementById('deviceSettings').value
  const levelSettings = document.getElementById('levelSettings').value
  chrome.storage.sync.set({
    apiKey: apiKey,
    deviceSettings: deviceSettings,
    levelSettings: levelSettings
  }, function () {
    // Update status to let user know options were saved.
    const status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(function () {
      status.textContent = ''
    }, 750)
  })
}

function restore_options () {
  chrome.storage.sync.get({
    apiKey: null,
    deviceSettings: 'PHONE',
    levelSettings: 'URL'
  }, function (items) {
    document.getElementById('apiKey').value = items.apiKey
    document.getElementById('deviceSettings').value = items.deviceSettings
    document.getElementById('levelSettings').value = items.levelSettings
  })
}
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('submit').addEventListener('click',
  save_options)
