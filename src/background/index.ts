// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

import contentFile from '../content/index.js?script'

chrome.runtime.onInstalled.addListener(() => {
})

// toggle the side panel from the extension's action button,
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error))

// In your background script
chrome.runtime.onMessage.addListener((message, sender) => {
	console.log('message', message, 'sender', sender.tab?.id)
	if (sender.tab) return
	// send this to the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]
		if (!tab?.id) {
			if (!message.isOptional)
				console.error('Failed to send message: No active tab found')
			return
		}
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: [contentFile]
		}).then(() => {
			console.log('sending message to tab', tab.id)
			chrome.tabs.sendMessage(tab.id!, message)
				.catch(console.error)
		})
	})
})


