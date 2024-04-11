import type { Writable } from 'svelte/store'
import type { Area, Command, Field, FieldValue } from './data'
import { cropImage } from './imageUtils.js'

export function setupMessages(data: Writable<Record<string, FieldValue>>,
	activeCommand: Writable<Command | null>) {
	// send
	activeCommand.subscribe(cmd => {
		if (!cmd) return
		data.subscribe(d => {
			const key = cmd.key
			const value = key ? d[key] : undefined
			console.log(cmd.action, key, value)
			chrome.runtime.sendMessage(
				{ action: cmd.action, payload: { key, value } })
				.catch(console.error)
		})()
	})
	// receive
	const handlers: Record<string, (payload: any) => void> = {
		setField: ({ key, value }: Field) => {
			console.log('set field', key, value)
			data.update(d => ({ ...d, [key]: value }))
			activeCommand.set(null)
		},
		setFields: (fields: Record<string, FieldValue>) => {
			console.log('set fields', fields)
			data.update(d => ({ ...d, ...fields }))
			activeCommand.set(null)
		},
		takeScreenshot: async ({ field, area }: { field: Field; area: Area }) => {
			console.log('Taking screenshot...', area)
			const dataUrl = await chrome.tabs.captureVisibleTab()
			const url = await cropImage(dataUrl, area)
			console.log('set screenshot', field)
			data.update(d => ({ ...d, [field.key]: { ...field.value, url } }))
			activeCommand.set(null)
		}
	}
	const onMessage = (message: any) => {
		if (message.action in handlers) handlers[message.action](message.payload)
	}
	chrome.runtime.onMessage.removeListener(onMessage)
	chrome.runtime.onMessage.addListener(onMessage)
}