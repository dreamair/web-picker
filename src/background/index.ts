// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

import contentFile from '../content/index.js?script'
import contentCss from '../content/styles.css?raw'

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
	chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
		const tab = tabs[0]
		if (!tab?.id) {
			if (!message.isOptional)
				console.error('Failed to send message: No active tab found')
			return
		}
		const cssResult = await chrome.scripting.insertCSS({
			target: { tabId: tab.id },
			css: contentCss as string
		})
		console.log('injected css into tab', tab.id, cssResult)
		const result = await chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: [contentFile]
		})
		console.log('injected script into tab', tab.id, result)
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			console.log('sending message to tab', tab.id, tabs[0].id, tab.active, tab.highlighted)
			chrome.tabs.sendMessage(tab.id!, message)
				.catch(console.error)
		})
	})
})


