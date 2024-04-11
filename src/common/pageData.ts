import type { Writable } from 'svelte/store'
import type { FieldValue } from './data'
import { isStringField, isTextField, isUrlField } from './data.js'

export function fillPageData(data: Writable<Record<string, FieldValue>>) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]
		if (!tab?.id) return console.error('Page data: No active tab found')
		data.update((d) => {
			d = { ...d }
			if (isUrlField(d.url) && tab.url)
				d.url = { ...d.url, url: tab.url }
			if (isTextField(d.url) && tab.url)
				d.url = { ...d.url, text: tab.url }
			if (isStringField(d.title) && tab.title)
				d.title = { ...d.title, text: tab.title }
			if (isTextField(d.title) && tab.title)
				d.title = { ...d.title, text: tab.title }
			return d
		})
		chrome.tabs.sendMessage(tab.id, { action: 'pick-pageData' })
			.catch(console.error)
	})
}
