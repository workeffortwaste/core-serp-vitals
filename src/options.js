function save_options () {
  const apiKey = document.getElementById('apiKey').value
  chrome.storage.sync.set({
    apiKey: apiKey
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
    apiKey: null
  }, function (items) {
    document.getElementById('apiKey').value = items.apiKey
  })
}
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click',
  save_options)
