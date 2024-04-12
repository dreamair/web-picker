import type { Writable } from 'svelte/store'
import type { Field } from './data.js'
import { getField, updateField } from './data.js'

export function fillPageData(data: Writable<Field[]>) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]
		if (!tab?.id) return console.error('Page data: No active tab found')
		data.update(fields => {
			if (getField(fields, 'url') && tab.url)
				fields = updateField(fields, 'url', { value: tab.url })
			if (getField(fields, 'title') && tab.title)
				fields = updateField(fields, 'title', { value: tab.title })
			return fields
		})
		chrome.tabs.sendMessage(tab.id, { action: 'pick-pageData' })
			.catch(console.error)
	})
}
