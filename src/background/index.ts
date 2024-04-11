// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

chrome.runtime.onInstalled.addListener(() => {
})

// toggle the side panel from the extension's action button,
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error))

// In your background script
chrome.runtime.onMessage.addListener((message, sender) => {
	console.log('message', message)
	if (sender.tab) return
	// send this to the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]
		if (!tab?.id)
			return console.error('Failed to send message: No active tab found')
		console.log('sending message to tab', tab.id)
		chrome.tabs.sendMessage(tab.id, message)
			.catch(console.error)
	})
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.active) {
		chrome.runtime.sendMessage({ message: 'tabUpdated', tabId, url: tab.url })
			.catch(console.error)
	}

})